import { Injectable } from '@angular/core';
import { Faultcategory } from '../classes/faultcategory';
import { Kanban_Column } from '../classes/kanban';
import { Schedules } from '../classes/schedules';
import { Workplacecategory } from '../classes/workplacecategory';
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
  constructor(private userService: UserService) {
    Parse.initialize('maintenancegate_parse_server_1');
    Parse.serverURL = 'https://parse-1.zentrum-digitalisierung.de/parse';
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

    const results = await queryschedule.find();
    for (let i = 0; i < results.length; i++) {
      this.maintenanceschedule.push(results[i].toJSON());
    }
    return this.maintenanceschedule;
  }

  async saveSchedules(schedule: Schedules) {
    const Schedules = this.instance.Object.extend('Schedule');
    const queryschedule = new this.instance.Query(Schedules);

    queryschedule.equalTo('objectId', schedule.objectId);
    return await queryschedule.first().then(
      async (object: any) => {
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
        return await object.save();
      },
      (error: any) => {
        return error;
      }
    );
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
}
