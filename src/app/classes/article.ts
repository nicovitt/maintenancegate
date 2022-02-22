import { Attachment } from './attachment';

export class Article {
  id: string = '';
  subject: string = '';
  body: string = '';
  author: any;
  created_at: string = '';
  images: Array<Attachment>;

  constructor() {
    this.images = new Array<Attachment>();
  }
}
