import { Injectable } from '@angular/core';
import { Attachment } from '../classes/attachment';
import { Faultcategory } from '../classes/faultcategory';
import { Kanban_Column } from '../classes/kanban';
import { Schedules } from '../classes/schedules';
import { Workplacecategory } from '../classes/workplacecategory';
import { ImageService } from './image.service';
import { UserService } from './user.service';

const Parse = require('parse');

@Injectable({
  providedIn: 'root',
})
export class ParseService {
  private faultCategories: Array<Faultcategory> = [];
  private workplaceCategories: Array<Workplacecategory> = [];
  private kanbancolumns: Array<Kanban_Column> = [];
  private maintenanceschedule: Array<Schedules> = [];

  get instance() {
    return Parse;
  }

  // TODO: Parse has to check whether the user is authorized to get the data. Users could change domainname in localstorage and get data from others.
  constructor(
    private userService: UserService,
    private imageService: ImageService
  ) {
    Parse.initialize('maintenancegate_parse_server_1');
    Parse.serverURL = 'https://parse-1.zentrum-digitalisierung.de/parse';
  }

  login(username: string, password: string): Promise<boolean> {
    // Session-token is returned
    return new Promise((resolve, reject) => {
      this.instance.User.logIn(username, password)
        .then(
          (value: any) => {
            value.className == '_User' ? resolve(true) : reject();
            // sessiontoken can be accessed via value.attributes.sessionToken
          },
          () => {
            reject();
          }
        )
        .catch(() => {
          reject();
        });
    });
  }

  async logout() {
    return await this.instance.User.logOut();
  }

  async getFaultCategories() {
    const Mandant = this.instance.Object.extend('Mandant');
    const query = new this.instance.Query(Mandant);

    query.equalTo('domain', this.userService.domainname);
    const results = await query.find();
    for (let i = 0; i < results.length; i++) {
      this.faultCategories = results[i].get('faults');
    }
    return this.faultCategories;
  }

  async getWorkplaceCategories() {
    const Mandant = this.instance.Object.extend('Mandant');
    const query = new this.instance.Query(Mandant);

    query.equalTo('domain', this.userService.domainname);
    const results = await query.find();
    for (let i = 0; i < results.length; i++) {
      this.workplaceCategories = results[i].get('workplaces');
    }
    return this.workplaceCategories;
  }

  async getKanbanColumns() {
    const Mandant = this.instance.Object.extend('Mandant');
    const query = new this.instance.Query(Mandant);

    query.equalTo('domain', this.userService.domainname);
    const results = await query.find();
    for (let i = 0; i < results.length; i++) {
      this.kanbancolumns = results[i].get('kanban_columns');
    }
    return this.kanbancolumns;
  }

  async getSchedules(id: number) {
    this.maintenanceschedule = [];
    const Mandant = this.instance.Object.extend('Mandant');
    const querymandant = new this.instance.Query(Mandant);
    querymandant.equalTo('domain', this.userService.domainname);

    const Schedules = this.instance.Object.extend('Schedule');
    const queryschedule = new this.instance.Query(Schedules);
    queryschedule.equalTo('workplaceid', id);

    queryschedule.matchesKeyInQuery('objectid', 'mandant', querymandant);

    let results = await queryschedule.find();
    for (let i = 0; i < results.length; i++) {
      this.maintenanceschedule.push(results[i].toJSON());
      this.maintenanceschedule[0].images = results[i].attributes.images.map(
        (image: Parse.File) => {
          let attachment = new Attachment();
          attachment.data = image.url();
          attachment.filename = image.name();
          attachment.id = 0;
          attachment['mime-type'] =
            this.imageService.calculateMimeTypeFromFileName(image.name());
          return attachment;
        }
      );
    }
    return this.maintenanceschedule;
  }

  saveSchedules(schedule: Schedules): Promise<any> {
    const Schedules = this.instance.Object.extend('Schedule');
    const queryschedule = new this.instance.Query(Schedules);

    queryschedule.equalTo('objectId', schedule.objectId);
    return queryschedule.first().then((object: any) => {
      if (object) {
        // Object already exists. Has to be updated.
        object.set('title', schedule.title);
        object.set('description', schedule.description);
        object.set('workplaceid', schedule.workplaceid);
        object.set('steps', schedule.steps);
      } else {
        // No object exists. Create a new one.
        var object = new Schedules();
        object.set('title', schedule.title);
        object.set('description', schedule.description);
        object.set('workplaceid', schedule.workplaceid);
        object.set('steps', schedule.steps);
      }
      if (schedule.images.length > 0) {
        this.uploadFiles(schedule.images, object).then(
          (backobject: Parse.Object) => {
            object = backobject;
          }
        );
      }
      return object.save();
    });
  }

  async deleteSchedule(schedule: Schedules) {
    const Schedules = this.instance.Object.extend('Schedule');
    const queryschedule = new this.instance.Query(Schedules);

    queryschedule.equalTo('objectId', schedule.objectId);
    return await queryschedule.first().then(async (object: any) => {
      if (object) {
        return await object.destroy({});
      }
    });
  }

  async uploadFiles(
    files: Attachment[],
    parseObject: Parse.Object
  ): Promise<Parse.Object> {
    let promises: Promise<Parse.File>[] = [];
    let parseFiles: Parse.File[] = [];
    files.forEach((file, i) => {
      parseFiles.push(
        new this.instance.File(file.filename, {
          base64: file.data,
        })
      );
      promises.push(parseFiles[i].save());
    });

    await Promise.all(promises).then(
      (value: any) => {
        // success callback says all files are saved, now lets add them to the parent
        parseFiles.forEach((parseFile) => {
          // delete parseFile._previousSave; //--> fix circular json error
          parseObject.addUnique('images', parseFile); // could alternatively use .add()
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
    return parseObject;
  }
}
