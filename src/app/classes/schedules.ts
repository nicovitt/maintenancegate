import * as moment from 'moment';
import { Attachment } from './attachment';

export class Schedules {
  objectId: string = '';
  title: string = '';
  description: string = '';
  workplaceid: number = 0;
  updatedAt: string = '';
  createdAt: string = '';
  series: Series = new Series();
  images: Array<Attachment> = new Array();
  steps: Array<Step> = new Array();
}

export class Schedules_Execution {
  objectId: string = '';
  updatedAt: string = '';
  createdAt: string = '';
  createdBy: string = '';
  schedule: any;
  steps: Array<Step> = new Array();
}

export class Step {
  id: number = 0;
  position: string = '';
  protectivegear: string = '';
  type: string = '';
  description: string = '';
  usedmaterial: string = '';
  performer: string = '';
  done: boolean = false;
  comment: string = '';
}

export class Series {
  frequency: string = '';
  monday: boolean = false;
  tuesday: boolean = false;
  wednesday: boolean = false;
  thursday: boolean = false;
  friday: boolean = false;
  saturday: boolean = false;
  sunday: boolean = false;
  startdate: moment.Moment = moment();
  enddate: moment.Moment = moment();
}
