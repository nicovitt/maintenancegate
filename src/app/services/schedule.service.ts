import { Injectable } from '@angular/core';
import { Schedules } from '../classes/schedules';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private _schedule: Schedules = new Schedules();

  constructor() {}

  get schedule() {
    return this._schedule;
  }

  set schedule(value: Schedules) {
    this._schedule = value;
  }
}
