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
  execution: Array<Schedules_Execution> = new Array();

  /**
   *  TODO: Rework this whole parsing of Parse.Object to this object. Basically Parse should make the direct relation with the executions.
   * @param parseresult Is of type ParseObjectSubclass
   */
  parseObjectToSchedule(parseresult: any) {
    this.objectId = parseresult.id;
    this.title = parseresult.get('title');
    this.description = parseresult.get('description');
    this.updatedAt = parseresult.get('updatedAt');
    this.workplaceid = parseresult.get('workplaceid');
    this.createdAt = parseresult.get('createdAt');
    this.series = parseresult.get('series');
    this.images = parseresult.get('images');
    this.steps = parseresult.get('steps');
  }

  parseObjectToExecutions(parseresult: Array<Parse.Object>) {
    parseresult.forEach((parseexecution) => {
      let _execution = new Schedules_Execution();
      _execution.objectId = parseexecution.id;
      _execution.updatedAt = parseexecution.get('updatedAt');
      _execution.createdAt = parseexecution.get('createdAt');
      _execution.createdBy = parseexecution.get('createdBy');
      _execution.steps = parseexecution.get('steps');
      this.execution.push(_execution);
    });
  }
}

export class Schedules_Execution {
  objectId: string = '';
  updatedAt: any = '';
  createdAt: any = '';
  createdBy: any = '';
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
