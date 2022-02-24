import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Schedules } from '../classes/schedules';
import { Workplacecategory } from '../classes/workplacecategory';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _searchstring: string = '';
  _searchtextChange: Subject<boolean> = new Subject<boolean>();

  get searchString(): string {
    return this._searchstring;
  }

  set searchString(search: string) {
    this._searchstring = search.trim();
    this._searchtextChange.next();
  }

  constructor() {
    this._searchstring = '';
  }

  filterWorkplacesWithSchedules(
    objecttofilter: Array<{
      workplace: Workplacecategory;
      schedules: Array<Schedules>;
    }>
  ): Array<{
    workplace: Workplacecategory;
    schedules: Array<Schedules>;
  }> {
    if (this.searchString === '') {
      return objecttofilter;
    }
    return objecttofilter.filter((object) => {
      let found = false;
      if (
        object.workplace.title
          ? object.workplace.title
              .toLowerCase()
              .includes(this.searchString.toLowerCase())
          : false
      ) {
        found = true;
      }

      if (
        object.workplace.description
          ? object.workplace.description
              .toLowerCase()
              .includes(this.searchString.toLowerCase())
          : false
      ) {
        found = true;
      }

      if (
        object.workplace.id
          ? object.workplace.id
              .toString()
              .toLowerCase()
              .includes(this.searchString.toLowerCase())
          : false
      ) {
        found = true;
      }
      return found;
    });
  }
}
