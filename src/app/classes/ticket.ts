import { Article } from './article';

export class Ticket {
  objectId: string = '';
  id: number = null;
  title: string = '';
  group: string = '';
  article: Array<Article>;
  customer: string = '';
  created_at: string = '';
  number: string = '';
  owner: any;
  updated_at: string = '';
  kanban_state: number = 1;
  downtime: Downtime[] = new Array<Downtime>();
  frequency: Frequency[] = new Array<Frequency>();
  priority: Priority[] = new Array<Priority>();
  restriction: Restriction[] = new Array<Restriction>();
  workplace: Workplace[] = new Array<Workplace>();
  faultcategory: Fault[] = new Array<Fault>();
  duedate: Duedate[] = new Array<Duedate>();

  constructor() {
    this.article = new Array<Article>();
  }

  /**
   *  TODO: Rework this whole parsing of Parse.Object to this object. Basically Parse should make the direct relation with the executions.
   * @param parseresult Is of type ParseObjectSubclass
   */
  parseObjectToTicket(parseresult: any) {
    this.objectId = parseresult.id;
    this.id = parseresult.id;
    this.title = parseresult.get('title');
    this.created_at = parseresult.get('createdAt');
    this.updated_at = parseresult.get('updatedAt');
    this.kanban_state = parseresult.get('kanban_state');
    this.downtime = parseresult.get('downtime');
    this.frequency = parseresult.get('frequency');
    this.priority = parseresult.get('priority');
    this.restriction = parseresult.get('restriction');
    this.workplace = parseresult.get('workplace');
    this.faultcategory = parseresult.get('faultcategory');
    this.duedate = parseresult.get('duedate');
  }

  parseObjectToArticle(parseresult: Array<Parse.Object>) {
    parseresult.forEach((parsearticle) => {
      let article = new Article();
      article.body = parsearticle.get('body');
      article.subject = parsearticle.get('subject');
      article.created_at = parsearticle.get('created_at');
      article.id = parsearticle.id;
      article.author = parsearticle.get('author');
      article.images = parsearticle.get('attachment');
      this.article.push(article);
    });
  }
}

export interface Downtime {
  label: string;
  value: number;
  date: string;
}

export interface Frequency {
  label: string;
  value: number;
  date: string;
}

export interface Priority {
  label: string;
  value: number;
  date: string;
}

export interface Restriction {
  label: string;
  value: number;
  date: string;
}

export interface Workplace {
  label: string;
  value: number;
  date: string;
}

export interface Fault {
  label: string;
  value: number;
  date: string;
}

export interface Duedate {
  label: string;
  start: string;
  end: string;
  date: string;
}

export class Generictabledata {
  label: string;
  value: number;
  date: Date;

  constructor(
    x: Downtime | Frequency | Priority | Restriction | Workplace | Fault
  ) {
    this.label = x.label;
    this.value = x.value;
    this.date = new Date(Date.parse(x.date));
  }
}
