import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Attachment } from '../classes/attachment';
import { Faultcategory } from '../classes/faultcategory';
import { Kanban_Column } from '../classes/kanban';
import { Schedules } from '../classes/schedules';
import { Ticket } from '../classes/ticket';
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
  private tickets: Array<Ticket> = [];

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
    if (this.checkSession()) {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }

    // Session-token is returned
    return new Promise((resolve, reject) => {
      this.instance.User.logIn(username, password)
        .then(
          (value: any) => {
            if (value.className == '_User') {
              this.userService.login();
              resolve(true);
            } else {
              this.userService.logout();
              reject();
            }
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
    this.userService.logout();
    return await this.instance.User.logOut();
  }

  checkSession(): boolean {
    const currentUser = this.instance.User.current();
    if (currentUser) {
      this.userService.login();
      return true;
    }
    return false;
  }

  getSessionToken(): string {
    return this.instance.User.getSessionToken();
  }

  getCurrentUser() {
    return this.instance.User.current();
  }

  getUserId(): string {
    let user = this.instance.User.current();
    return user.id;
  }

  async getTickets() {
    this.tickets = [];
    const Tickets = this.instance.Object.extend('Ticket');
    const query = new this.instance.Query(Tickets);

    query.equalTo('owner', this.getCurrentUser());
    const results = await query.find();
    for (let i = 0; i < results.length; i++) {
      let tmp = new Ticket();
      tmp.parseObjectToTicket(results[i]);
      this.tickets.push(tmp);
    }
    return this.tickets;
  }

  async postTicket(ticket: Ticket): Promise<boolean> {
    const Tickets = this.instance.Object.extend('Ticket');
    const queryticket = new this.instance.Query(Tickets);

    queryticket.equalTo('objectId', ticket.objectId);
    return queryticket.first().then((object: Parse.Object) => {
      if (!object) {
        // No object exists so create a new one
        object = new Parse.Object('Ticket');
      }
      object.set('title', ticket.title);
      object.set('owner', ticket.owner);
      object.set('kanban_state', ticket.kanban_state);
      object.set('downtime', ticket.downtime);
      object.set('frequency', ticket.frequency);
      object.set('priority', ticket.priority);
      object.set('restriction', ticket.restriction);
      object.set('workplace', ticket.workplace);
      object.set('faultcategory', ticket.faultcategory);
      object.set('duedate', ticket.duedate);

      return object.save().then(
        (savedobject) => {
          let article = new Parse.Object('Article');

          article.set(
            'subject',
            ticket.article[ticket.article.length - 1].subject
          );
          article.set('body', ticket.article[ticket.article.length - 1].body);
          article.set('author', this.getCurrentUser());
          article.set('ticket', savedobject);

          return article.save().then(
            () => {
              if (
                ticket.article[ticket.article.length - 1].attachments.length > 0
              ) {
                return this.uploadFiles(
                  ticket.article[ticket.article.length - 1].attachments,
                  article
                ).then(
                  (backobject: Parse.Object) => {
                    return new Promise((resolve, reject) => {
                      resolve(true);
                    });
                  },
                  () => {
                    return new Promise((resolve, reject) => {
                      reject(false);
                    });
                  }
                );
              } else {
                return new Promise((resolve, reject) => {
                  resolve(true);
                });
              }
            },
            () => {
              return new Promise((resolve, reject) => {
                reject(false);
              });
            }
          );
        },
        (error: Parse.Error) => {
          return new Promise((resolve, reject) => {
            reject(false);
          });
        }
      );
    });
  }

  async getFaultCategories() {
    let currentUser = this.getCurrentUser().relation('mandant').query();
    const results = await currentUser.find();

    for (let i = 0; i < results.length; i++) {
      this.faultCategories = results[i].get('faults');
    }
    return this.faultCategories;
  }

  async getWorkplaceCategories() {
    let currentUser = this.getCurrentUser().relation('mandant').query();
    const results = await currentUser.find();

    for (let i = 0; i < results.length; i++) {
      this.workplaceCategories = results[i].get('workplaces');
    }
    return this.workplaceCategories;
  }

  async getKanbanColumns() {
    let currentUser = this.getCurrentUser().relation('mandant').query();
    const results = await currentUser.find();

    for (let i = 0; i < results.length; i++) {
      this.kanbancolumns = results[i].get('kanban_columns');
    }
    return this.kanbancolumns;
  }

  async getSchedules(id: number) {
    this.maintenanceschedule = [];

    let currentUser = this.getCurrentUser().relation('mandant').query();
    const mandant = await currentUser.find();

    const Schedules = this.instance.Object.extend('Schedule');
    const queryschedule = new this.instance.Query(Schedules);
    queryschedule.equalTo('workplaceid', id);

    queryschedule.matchesKeyInQuery('objectid', 'mandant', mandant[0]);

    let results = await queryschedule.find();
    for (let i = 0; i < results.length; i++) {
      this.maintenanceschedule.push(results[i].toJSON());
      this.maintenanceschedule[0].images = results[i].attributes.images.map(
        (image: Parse.File) => {
          let attachment = new Attachment();
          attachment.data = image.url();
          attachment.filename = image.name();
          attachment.id = 0;
          attachment.mimetype = this.imageService.calculateMimeTypeFromFileName(
            image.name()
          );
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
