import { Article, TicketCreateArticleRequest } from './article';

export class Ticket {
  id: number = null;
  title: string = '';
  group: string = '';
  article: Article;
  customer: string = '';
  // customer_id: string = '';
  // article_count: number = 0;
  // close_at: any = null;
  // close_diff_in_min: null;
  // close_escalation_at: null;
  // close_in_min: null;
  // create_article_sender_id: number = 0;
  // create_article_type_id: number = 0;
  created_at: string = '';
  // created_by_id: number = 0;
  // escalation_at: null;
  // first_response_at: string = '';
  // first_response_diff_in_min: null;
  // first_response_escalation_at: null;
  // first_response_in_min: null;
  // group_id: number = 0;
  // last_contact_agent_at: string = '';
  // last_contact_at: string = '';
  // last_contact_customer_at: null;
  // last_owner_update_at: string = '';
  // note: null;
  number: string = '';
  // organization_id: number = 0;
  owner_id: number = 0;
  // pending_time: null;
  // preferences: {};
  // priority_id: number = 0;
  // state_id: number = 0;
  // time_unit: null;
  // type: null;
  // update_diff_in_min: null;
  // update_escalation_at: null;
  // update_in_min: null;
  updated_at: string = '';
  // updated_by_id: number = 0;
  categorie: number = 0;
  maintenancegate_kanban_state: number = 1;
  maintenancegate_downtime: Downtime[] = new Array<Downtime>();
  maintenancegate_frequency: Frequency[] = new Array<Frequency>();
  maintenancegate_priority: Priority[] = new Array<Priority>();
  maintenancegate_restriction: Restriction[] = new Array<Restriction>();
  maintenancegate_workplace: Workplace[] = new Array<Workplace>();
  maintenancegate_faultcategory: Fault[] = new Array<Fault>();
  maintenancegate_duedate: Duedate[] = new Array<Duedate>();

  constructor() {
    this.article = new Article();
  }
}

export class TicketCreateRequest {
  title: string = '';
  group: string = '';
  article: TicketCreateArticleRequest;
  customer: string = '';
  owner_id: number = 0;
  created_at: string = '';
  maintenancegate_kanban_state: number = 1;
  maintenancegate_downtime: Downtime[] = new Array<Downtime>();
  maintenancegate_frequency: Frequency[] = new Array<Frequency>();
  maintenancegate_priority: Priority[] = new Array<Priority>();
  maintenancegate_restriction: Restriction[] = new Array<Restriction>();
  maintenancegate_workplace: Workplace[] = new Array<Workplace>();
  maintenancegate_faultcategory: Fault[] = new Array<Fault>();
  maintenancegate_duedate: Duedate[] = new Array<Duedate>();

  constructor() {
    this.article = new TicketCreateArticleRequest();
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
