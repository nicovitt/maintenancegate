import { Attachment } from './attachment';

export class Article {
  subject: string = '';
  body: string = '';
  attachments: Array<Attachment>;

  constructor() {
    this.attachments = new Array<Attachment>();
  }
}
