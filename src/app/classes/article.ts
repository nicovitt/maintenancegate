import { Attachment } from './attachment';

export class Article {
  id: string = '';
  subject: string = '';
  body: string = '';
  author: any;
  created_at: Date = new Date();
  images: Array<Attachment>;

  constructor() {
    this.images = new Array<Attachment>();
  }
}
