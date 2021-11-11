export class otrs_Ticket {
  id: number;
  title: string = '';
  message: string = '';
  creationdate: Date;
  dueDate: Date; // due date
  overdue: boolean = false;
  workplace: string = '';
  otherworkplace: string = '';
  categorie: string = '';
  state: otrs_Ticketstate; // our own state to identify in which colum in KANBAN a ticket is listed
  stateOTRS: string; // the native OTRS state
  ticketArticles: otrs_TicketArticle[] = new Array();
  priority: number = 0;
  audios: otrs_GenericAttachment[] = new Array();
  photos: otrs_GenericAttachment[] = new Array();
  workerdowntime: string = '0'; //Der Stillstand, den der Werker meint.
  workerrecurring: string = '0'; //Der wiederkehrende Auftritt des Problems, den der Werker meint.
  workerrestriction: string = '-1'; //Die Einschränkung, die der Werker meint.
  maintenanceeffort: number = 0; // Aufwandsabschätzung durch die Instandhaltung
  workerpriority: string = '';
  ticketinputmodality: otrs_TicketInputModality;
  private _displayfromfilter: boolean[] = [true];

  constructor() {
    this.ticketArticles.push(new otrs_TicketArticle());
  }

  get displayfromfilter(): boolean {
    if (this._displayfromfilter.includes(false)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * @param _display pass 'null' to reset this property and thus show all tickets
   * @returns true | false
   */
  set displayfromfilter(_display: boolean) {
    if (_display == null) {
      this._displayfromfilter = [true];
    } else {
      this._displayfromfilter.push(_display);
    }
  }
}

export class otrs_TicketArticle {
  ArticleID: string;
  From: string;
  To: string;
  Cc: string;
  Subject: string;
  Body: string;
  ReplyTo: string;
  MessageID: string;
  InReplyTo: string;
  References: string;
  SenderType: string;
  SenderTypeID: string;
  IsVisibleForCustomer: string;
  ContentType: string;
  Charset: string;
  MimeType: string;
  IncomingTime: string;
  DynamicField: otrs_GenericDynamicField[] = new Array();
  Attachment: otrs_TicketArticleAttachment[] = new Array();

  constructor(body?: string) {
    this.Body = body ? body : '';
  }
}

export class otrs_TicketArticleAttachment {
  Content: string;
  ContentAlternative: string;
  ContentID: string;
  ContentType: string;
  FileID: number;
  Filename: string;
  FilesizeRaw: number;
}

export enum otrs_Ticketstate {
  draft = 1, //Ein Ticket, welches noch ein Entwurf ist.
  pool = 2, //Ein Ticket, welches noch nicht begonnen wurde, aber im Arbeitsvorrat liegt.
  inProgress = 3, //Ein Ticket, an dem momentan gearbeitet wird.
  waiting = 4, // Ein Ticket, an dem gerade nicht gearbeitet wird, weil auf Rückmeldung gewartet wird
  closed = 5, //Ein Ticket, welches abgeschlossen ist.
}

export enum otrs_TicketInputModality {
  /**
   * Ticket, welches Über das + Symbol angelegt wurde.
   */
  Standard = 1,
  Chat = 2,
  Foto = 3,
  Audio = 4,
  Anruf = 5,
  OTRS = 6,
  Unbestimmt = 99, // wenn kein anderer Wert zutrifft
}

// original states from OTRS
export const otrs_statesOTRS: string[] = [
  'closed successful',
  'closed unsuccessful',
  'merged',
  'new',
  'open',
  'pending auto close+',
  'pending auto close-',
  'pending reminder',
  'removed',
];

//Kann später genutzt werden, um die Bodys aus den Articles zu parsen.
export class otrs_Ticketmessage {
  time: Date;
  body: string;
}

export class otrs_Ticketfilter {
  draft: boolean = true;
  open: boolean = true;
  closed: boolean = true;
}

//Ticket Create
//https://doc.otrs.com/doc/api/otrs/6.0/Perl/Kernel/GenericInterface/Operation/Ticket/TicketCreate.pm.html
export class otrs_TicketCreateRequest {
  UserLogin: string;
  CustomerUserLogin: string;
  Password: string;
  Ticket: otrs_TicketCreateRequestTicket;
  Article: otrs_TicketCreateRequestArticle;
  DynamicField: otrs_GenericDynamicField[] = new Array();
  Attachment: otrs_GenericAttachment[] = new Array();
}
export class otrs_TicketCreateRequestTicket {
  Title: string;
  QueueID: number;
  Queue: string;
  LockID: number;
  Lock: string;
  TypeID: number;
  Type: string;
  ServiceID: number;
  Service: string;
  SLAID: number;
  SLA: string;
  StateID: number;
  State: string;
  PriorityID: number;
  Priority: string;
  OwnerID: number;
  Owner: string;
  ResponsibleID: number;
  Responsible: string;
  CustomerUser: string;
  PendingTime: otrs_GenericPendingTime;
}
export class otrs_TicketCreateRequestArticle {
  CommunicationChannel: string;
  CommunicationChannelID: number;
  IsVisibleForCustomer: number;
  SenderTypeID: number;
  SenderType: string;
  AutoResponseType: string;
  From: string;
  Subject: string;
  Body: string;
  ContentType: string;
  MimeType: string;
  Charset: string;
  HistoryType: string;
  HistoryComment: string;
  TimeUnit: number;
  NoAgentNotify: number;
  ForceNotificationToUserID: number[];
  ExcludeNotificationToUserID: number[];
  ExcludeMuteNotificationToUserID: number[];
}
export class otrs_TicketCreateResponse {
  TicketID: number;
  TicketNumber: number;
  ArticleID: number;
  Error: otrs_GenericErrorMessage;
  Ticket: otrs_TicketCreateResponseTicket[]; //TODO: Bei einem Test mit erfolgreicher Ticektanlage wurde dieser Parameter NICHT von OTRS zurückgegeben! Lieber rausnehmen?
}
class otrs_TicketCreateResponseTicket {
  Ticketnumber: string;
  Title: string;
  TicketID: number;
  State: string;
  StateID: number;
  StateType: string;
  Priority: string;
  PriorityID: number;
  Lock: string;
  LockID: number;
  Queue: string;
  QueueID: number;
  CustomerID: string;
  CustomerUserID: string;
  Owner: string;
  OwnerID: number;
  Type: string;
  TypeID: number;
  SLA: string;
  SLAID: number;
  Service: string;
  ServiceID: number;
  Responsible: string;
  ResponsibleID: number;
  Age: number;
  Created: string;
  CreateBy: number;
  Changed: string;
  ChangeBy: number;
  ArchiveFlag: string;
  DynamicField: otrs_GenericDynamicField[];
  Article: otrs_TicketCreateResponseTicketArticle[];
}
class otrs_TicketCreateResponseTicketArticle {
  ArticleID: number;
  From: string;
  To: string;
  Cc: string;
  Subject: string;
  Body: string;
  ReplyTo: string;
  MessageID: string;
  InReplyTo: string;
  References: string;
  SenderType: string;
  SenderTypeID: string;
  IsVisibleForCustomer: string;
  ContentType: string;
  Charset: string;
  MimeType: string;
  IncomingTime: string;
  DynamicField: otrs_GenericDynamicField[];
  Attachment: otrs_TicketCreateResponseTicketArticleAttachments[];
}
class otrs_TicketCreateResponseTicketArticleAttachments {
  Content: string;
  ContentAlternative: string;
  ContentID: string;
  ContentType: string;
  FileID: number;
  Filename: string;
  FilesizeRaw: number;
}

//Ticket Search
//https://doc.otrs.com/doc/api/otrs/6.0/Perl/Kernel/GenericInterface/Operation/Ticket/TicketSearch.pm.html
//You can search for a lot of fields and infos of the thicket. I will include only needed ones. Have a look at the documentation which is reachable by clicking on the link.
export class otrs_TicketSearchRequest {
  QueueIDs: number[] = new Array();
  CustomerUserLogin: string[] = new Array();
  States: string[] = new Array();
  TicketCloseTimeNewerDate: string; // '2006-01-09 00:00:01',
}
export class otrs_TicketSearchResponse {
  TicketID: number[] = new Array();
}

//Ticket Get
//https://doc.otrs.com/doc/api/otrs/6.0/Perl/Kernel/GenericInterface/Operation/Ticket/TicketGet.pm.html
export class otrs_TicketGetRequest {
  UserLogin: string;
  CustomerUserLogin: string;
  SessionID: number;
  Password: string;
  TicketID: string;
  DynamicFields: number;
  Extended: number;
  AllArticles: number;
  ArticleSenderType: string[] = new Array();
  ArticleOrder: string;
  ArticleLimit: number;
  Attachments: number;
  GetAttachmentContents: number;
  HTMLBodyAsAttachment: number;
}
export class otrs_TicketGetResponse {
  Success: number;
  ErrorMessage: string;
  Ticket: otrs_TicketGetResponseTicket[] = new Array();
}
export class otrs_TicketGetResponseTicket {
  Ticketnumber: string;
  Title: string;
  TicketID: number;
  State: string;
  StateID: number;
  StateType: string;
  Priority: number;
  PriorityID: number;
  Lock: string;
  LockID: number;
  Queue: string;
  QueueID: number;
  CustomerID: string;
  CustomerUserID: string;
  Type: string;
  TypeID: number;
  SLA: string;
  SLAID: number;
  Service: string;
  ServiceID: number;
  Responsible: string;
  ResponsibleID: number;
  Age: number;
  Created: string;
  CreateBy: number;
  Changed: string;
  ChangeBy: number;
  ArchiveFlag: string;
  DynamicField: otrs_GenericDynamicField[] = new Array();
  Article: otrs_TicketGetResponseTicketArticle[] = new Array();
}
export class otrs_TicketGetResponseTicketArticle {
  ArticleID: string;
  From: string;
  To: string;
  Cc: string;
  Subject: string;
  Body: string;
  ReplyTo: string;
  MessageID: string;
  InReplyTo: string;
  References: string;
  SenderType: string;
  SenderTypeID: string;
  IsVisibleForCustomer: string;
  ContentType: string;
  CreateTime: string;
  Charset: string;
  MimeType: string;
  IncomingTime: string;
  DynamicField: otrs_GenericDynamicField[] = new Array();
  Attachment: otrs_TicketGetResponseTicketArticleAttachment[] = new Array();
}
export class otrs_TicketGetResponseTicketArticleAttachment {
  Content: string;
  ContentAlternative: string;
  ContentID: string;
  ContentType: string;
  FileID: number;
  Filename: string;
  FilesizeRaw: number;
}

//Ticket Update
//https://doc.otrs.com/doc/api/otrs/6.0/Perl/Kernel/GenericInterface/Operation/Ticket/TicketUpdate.pm.html
export class otrs_TicketUpdateRequest {
  UserLogin: string;
  CustomerUserLogin: string;
  SessionID: number;
  Password: string;
  TicketID: number;
  Ticketnumber: string;
  Ticket: otrs_TicketUpdateRequestTicket;
  Article: otrs_TicketUpdateRequestArticle;
  DynamicField: otrs_GenericDynamicField[] = new Array();
  Attachment: otrs_TicketUpdateRequestAttachment[] = new Array();
}
export class otrs_TicketUpdateRequestTicket {
  Title: string;
  QueueID: number;
  Queue: string;
  LockID: number;
  Lock: string;
  TypeID: number;
  Type: string;
  ServiceID: number;
  Service: string;
  SLAID: number;
  SLA: string;
  StateID: number;
  State: string;
  PriorityID: number;
  Priority: string;
  OwnerID: number;
  Owner: string;
  ResponsibleID: number;
  Responsible: string;
  CustomerUser: string;
  PendingTime: otrs_GenericPendingTime;
}
export class otrs_TicketUpdateRequestArticle {
  CommunicationChannel: string;
  CommunicationChannelID: number;
  IsVisibleForCustomer: number;
  SenderTypeID: number;
  SenderType: string;
  AutoResponseType: string;
  From: string;
  Subject: string;
  Body: string;
  ContentType: string;
  MimeType: string;
  Charset: string;
  HistoryType: string;
  HistoryComment: string;
  TimeUnit: number;
  NoAgentNotify: number;
  ForceNotificationToUserID: number[];
  ExcludeNotificationToUserID: number[];
  ExcludeMuteNotificationToUserID: number[];
}
export class otrs_TicketUpdateRequestAttachment {
  Content: string;
  ContentType: string;
  Filename: string;
}
export class otrs_TicketUpdateResponse {
  TicketID: number;
  ArticleID: number;
  Error: otrs_GenericErrorMessage;
  Ticket: otrs_TicketUpdateResponseTicket[];
}
export class otrs_TicketUpdateResponseTicket {
  Ticketnumber: string;
  Title: string;
  TicketID: number;
  State: string;
  StateID: number;
  StateType: string;
  Priority: string;
  PriorityID: number;
  Lock: string;
  LockID: number;
  Queue: string;
  QueueID: number;
  CustomerID: string;
  CustomerUserID: string;
  Owner: string;
  OwnerID: number;
  Type: string;
  TypeID: number;
  SLA: string;
  SLAID: number;
  Service: string;
  ServiceID: number;
  Responsible: string;
  ResponsibleID: number;
  Age: number;
  Created: string;
  CreateBy: number;
  Changed: string;
  ChangeBy: number;
  ArchiveFlag: string;
  DynamicField: otrs_GenericDynamicField[];
  Article: otrs_TicketUpdateResponseTicketArticle[];
}
export class otrs_TicketUpdateResponseTicketArticle {
  ArticleID: string;
  From: string;
  To: string;
  Cc: string;
  Subject: string;
  Body: string;
  ReplyTo: string;
  MessageID: string;
  InReplyTo: string;
  References: string;
  SenderType: string;
  SenderTypeID: string;
  IsVisibleForCustomer: string;
  ContentType: string;
  Charset: string;
  MimeType: string;
  IncomingTime: string;
  DynamicField: otrs_GenericDynamicField[];
  Attachment: otrs_TicketUpdateResponseTicketArticleAttachment[];
}
export class otrs_TicketUpdateResponseTicketArticleAttachment {
  Content: string;
  ContentAlternative: string;
  ContentID: string;
  ContentType: string;
  Filename: string;
  Filesize: string;
  FilesizeRaw: number;
}

//Session Create
//https://doc.otrs.com/doc/api/otrs/6.0/Perl/Kernel/GenericInterface/Operation/Session/SessionCreate.pm.html
export class otrs_SessionCreateRequest {
  CustomerUserLogin: string;
  Password: string;
}
export class otrs_SessionCreateResponse {
  SessionID: string;
}

//Session Get
//https://doc.otrs.com/doc/api/otrs/6.0/Perl/Kernel/GenericInterface/Operation/Session/SessionGet.pm.html
export class otrs_SessionGetRequest {
  SessionID: string;
}
export class otrs_SessionGetResponse {
  Error: otrs_GenericErrorMessage;
  SessionData: otrs_SessionGetResponseData[] =
    new Array<otrs_SessionGetResponseData>();
}
export class otrs_SessionGetResponseData {
  Value: string;
  Key: string;
}

// Different sub-fileds in the data portions
export class otrs_GenericDynamicField {
  Name: string;
  Value: string;
  constructor(thename: string, thevalue: string) {
    this.Name = thename;
    this.Value = thevalue;
  }
}

export class otrs_GenericAttachment {
  Content: string;
  ContentType: string;
  Filename: string;
  TimeStamp?: string;
}

class otrs_GenericErrorMessage {
  ErrorCode: string;
  ErrorMessage: string;
}

export class otrs_GenericPendingTime {
  Year: number;
  Month: number;
  Day: number;
  Hour: number;
  Minute: number;

  constructor(
    _year: number,
    _month: number,
    _day: number,
    _hour: number,
    _minute: number
  ) {
    this.Year = _year;
    this.Month = _month;
    this.Day = _day;
    this.Hour = _hour;
    this.Minute = _minute;
  }
}

export class GroupQueueRelation {
  groupname: string;
  groupid: number;
  queuename: string;
  queueid: number;
  canSeeAll: boolean; //defines whether this group can see all tickets.
  canSeeKanban: boolean; //defines whether this group can see the Kanban in the menu.

  constructor(
    groupname: string,
    groupid: number,
    queuename: string,
    queueid: number,
    canSeeAll: boolean,
    canSeeKanban: boolean
  ) {
    this.groupname = groupname;
    this.groupid = groupid;
    this.queuename = queuename;
    this.queueid = queueid;
    this.canSeeAll = canSeeAll;
    this.canSeeKanban = canSeeKanban;
  }
}

export const groupqueuerelationlist: GroupQueueRelation[] = [
  // hint: the respective IDs can be acquired from the URL in OTRS

  //Demo
  new GroupQueueRelation('Demo', 14, 'Demo', 14, false, true),

  // Arthur Bräuer
  new GroupQueueRelation(
    'Arthur Bräuer GmbH',
    15,
    'Störmeldungen Arthur Bräuer',
    15,
    false,
    true
  ),

  // Risse+Wilke
  new GroupQueueRelation(
    'Risse+Wilke',
    17,
    'Störmeldungen Risse+Wilke',
    17,
    true,
    true
  ),

  // Wirtschaftsförderung Soest
  new GroupQueueRelation(
    'Arthur Bräuer GmbH',
    16,
    'Störmeldungen Wirtschaftsförderung Soest',
    16,
    true,
    true
  ),

  // VETTER Krantechnik
  new GroupQueueRelation(
    'Störmeldungen VETTER Krantechnik::Produktionsleitung',
    5,
    'VETTER Krantechnik Produktionsleitung',
    8,
    true,
    true
  ),
  new GroupQueueRelation(
    'Störmeldungen VETTER Krantechnik::Instandhaltung',
    6,
    'VETTER Krantechnik Instandhaltung',
    7,
    true,
    true
  ),
  new GroupQueueRelation(
    'Störmeldungen VETTER Krantechnik::Logistik',
    7,
    'VETTER Krantechnik Logistik',
    6,
    false,
    false
  ),
  new GroupQueueRelation(
    'Störmeldungen VETTER Krantechnik::Auftragsvorbereitung',
    8,
    'VETTER Krantechnik Auftragsvorbereitung',
    9,
    false,
    false
  ),
  new GroupQueueRelation(
    'Störmeldungen VETTER Krantechnik::Fertigung 1',
    9,
    'VETTER Krantechnik Fertigung 1',
    11,
    false,
    false
  ),
  new GroupQueueRelation(
    'Störmeldungen VETTER Krantechnik::Fertigung 2',
    10,
    'VETTER Krantechnik Fertigung 2',
    12,
    false,
    false
  ),
  new GroupQueueRelation(
    'Störmeldungen VETTER Krantechnik::Endmontage',
    11,
    'VETTER Krantechnik Endmontage',
    10,
    false,
    false
  ),
  new GroupQueueRelation(
    'Störmeldungen VETTER Krantechnik::Extern',
    13,
    'VETTER Krantechnik Extern',
    13,
    false,
    false
  ),
];

export class CustomeruserQueueRelation {
  customerusername: string;
  queuename: string;
  queueid: number;

  constructor(customerusername: string, queuename: string, queueid: number) {
    this.customerusername = customerusername;
    this.queuename = queuename;
    this.queueid = queueid;
  }
}

export const customeruserqueuerelationlist: CustomeruserQueueRelation[] = [
  // Demo
  new CustomeruserQueueRelation('demo', 'Demo', 14), // only the Demo user should be able to access this queue to separate the test from productive system!

  // Studenten
  new CustomeruserQueueRelation('marcusrommel', 'Demo', 14),
  new CustomeruserQueueRelation('dominikkorczak', 'Demo', 14),
  new CustomeruserQueueRelation('shiliu', 'Demo', 14),
  new CustomeruserQueueRelation('lukasschroeder', 'Demo', 14),

  // Arthur Bräuer
  new CustomeruserQueueRelation(
    'johannabartels',
    'Störmeldungen Arthur Bräuer',
    15
  ),
  new CustomeruserQueueRelation(
    'michaelkirchhoff',
    'Störmeldungen Arthur Bräuer',
    15
  ),
  new CustomeruserQueueRelation('ralfweber', 'Störmeldungen Arthur Bräuer', 15),
  new CustomeruserQueueRelation(
    'thomasbraeuer',
    'Störmeldungen Arthur Bräuer',
    15
  ),
  new CustomeruserQueueRelation(
    'arthurbraeuer',
    'Störmeldungen Arthur Bräuer',
    15
  ),
  new CustomeruserQueueRelation(
    'ingokebben',
    'Störmeldungen Arthur Bräuer',
    15
  ),
  new CustomeruserQueueRelation(
    'ronnyglienke',
    'Störmeldungen Arthur Bräuer',
    15
  ),
  new CustomeruserQueueRelation(
    'frankanders',
    'Störmeldungen Arthur Bräuer',
    15
  ),

  // Risse+Wilke
  new CustomeruserQueueRelation('rwdemo', 'Störmeldungen Risse+Wilke', 17),

  // Wirtschaftsförderung Soest
  new CustomeruserQueueRelation(
    'wfg',
    'Störmeldungen Wirtschaftsförderung Soest',
    16
  ),

  // VETTER Krantechnik
  new CustomeruserQueueRelation(
    'andreasweigel',
    'Störmeldungen VETTER Krantechnik::Produktionsleitung',
    8
  ),
  new CustomeruserQueueRelation(
    'instandhaltung',
    'Störmeldungen VETTER Krantechnik::Instandhaltung',
    7
  ),
  new CustomeruserQueueRelation(
    'andreehabig',
    'Störmeldungen VETTER Krantechnik::Produktionsleitung',
    8
  ),
  new CustomeruserQueueRelation(
    'av',
    'Störmeldungen VETTER Krantechnik::Auftragsvorbereitung',
    9
  ),
  new CustomeruserQueueRelation(
    'christophkotthaus',
    'Störmeldungen VETTER Krantechnik::Extern',
    13
  ),
  new CustomeruserQueueRelation(
    'elektro',
    'Störmeldungen VETTER Krantechnik::Endmontage',
    10
  ),
  new CustomeruserQueueRelation(
    'endmontage',
    'Störmeldungen VETTER Krantechnik::Endmontage',
    10
  ),
  new CustomeruserQueueRelation(
    'fertigung1',
    'Störmeldungen VETTER Krantechnik::Fertigung 1',
    11
  ),
  new CustomeruserQueueRelation(
    'fertigung2',
    'Störmeldungen VETTER Krantechnik::Fertigung 2',
    12
  ),
  new CustomeruserQueueRelation(
    'lackieren',
    'Störmeldungen VETTER Krantechnik::Fertigung 2',
    12
  ),
  new CustomeruserQueueRelation(
    'logistik',
    'Störmeldungen VETTER Krantechnik::Logistik',
    6
  ),
  new CustomeruserQueueRelation(
    'mechanik',
    'Störmeldungen VETTER Krantechnik::Fertigung 1',
    11
  ),
  new CustomeruserQueueRelation(
    'nicovitt',
    'Störmeldungen VETTER Krantechnik::Extern',
    13
  ),
  new CustomeruserQueueRelation(
    'roxanafischer',
    'Störmeldungen VETTER Krantechnik::Extern',
    13
  ),
  new CustomeruserQueueRelation(
    'produktionslogistik',
    'Störmeldungen VETTER Krantechnik::Logistik',
    6
  ),
  new CustomeruserQueueRelation(
    'schweissen',
    'Störmeldungen VETTER Krantechnik::Fertigung 1',
    11
  ),
  new CustomeruserQueueRelation(
    'sonderbau',
    'Störmeldungen VETTER Krantechnik::Fertigung 1',
    11
  ),
  new CustomeruserQueueRelation(
    'sozialdienste',
    'Störmeldungen VETTER Krantechnik::Logistik',
    6
  ),
  new CustomeruserQueueRelation(
    'verkabelung',
    'Störmeldungen VETTER Krantechnik::Endmontage',
    10
  ),
  new CustomeruserQueueRelation(
    'versand',
    'Störmeldungen VETTER Krantechnik::Logistik',
    6
  ),
  new CustomeruserQueueRelation(
    'produktion1',
    'Störmeldungen VETTER Krantechnik::Produktionsleitung',
    8
  ),
  new CustomeruserQueueRelation(
    'meister1',
    'Störmeldungen VETTER Krantechnik::Produktionsleitung',
    8
  ),
  new CustomeruserQueueRelation(
    'meister2',
    'Störmeldungen VETTER Krantechnik::Produktionsleitung',
    8
  ),
  new CustomeruserQueueRelation(
    'linie1',
    'Störmeldungen VETTER Krantechnik::Fertigung 1',
    11
  ),
];
