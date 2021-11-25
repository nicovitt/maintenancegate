import { Injectable } from '@angular/core';
import { Faultcategory } from '../classes/faultcategory';
import { Kanban_Column } from '../classes/kanban';
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
  get instance() {
    return Parse;
  }

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
}
