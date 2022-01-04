import { Injectable } from '@angular/core';
import { Schedules } from '../classes/schedules';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private _schedule: Schedules;
  private _seriesenabled: boolean = false;

  constructor() {}

  get schedule() {
    return this._schedule;
  }

  set schedule(value: Schedules) {
    this._schedule = value;
    if (
      this._schedule.series.monday ||
      this._schedule.series.tuesday ||
      this._schedule.series.wednesday ||
      this._schedule.series.thursday ||
      this._schedule.series.friday ||
      this._schedule.series.saturday ||
      this._schedule.series.sunday
    ) {
      this._seriesenabled = true;
    }
  }

  get series_enabled() {
    return this._seriesenabled;
  }

  set series_enabled(value: boolean) {
    this._seriesenabled = value;
  }
}
