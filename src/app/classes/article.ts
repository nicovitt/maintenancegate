import { Attachment } from './attachment';

export class Article {
  id: number = 0;
  subject: string = '';
  body: string = '';
  author: any;
  created_at: string = '';
  attachments: Array<Attachment>;

  constructor() {
    this.attachments = new Array<Attachment>();
  }
}

export class PlainArticlePost {
  ticket_id = 0;
  subject = 'Neue Notiz';
  body = '';
  content_type = 'text/html';
  type = 'note';
  internal = false;
  sender = '';
  time_unit = '15';
}
