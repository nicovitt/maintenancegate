export class Schedules {
  objectId: string = '';
  title: string = '';
  description: string = '';
  workplaceid: number = 0;
  updatedAt: string = '';
  createdAt: string = '';
  steps: Array<Step> = new Array();
}

export class Step {
  id: number = 0;
  performer: string = '';
  position: string = '';
  topic: string = '';
  frequency: string = '';
  protectivegear: string = '';
  type: string = '';
  description: string = '';
  usedmaterial: string = '';
}
