import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  otrs_Ticket,
  otrs_TicketSearchRequest,
  otrs_statesOTRS,
  otrs_TicketGetRequest,
  otrs_TicketSearchResponse,
  otrs_TicketGetResponse,
  otrs_TicketGetResponseTicket,
  otrs_TicketCreateResponse,
  otrs_TicketCreateRequest,
  otrs_TicketCreateRequestArticle,
  otrs_GenericAttachment,
  otrs_GenericDynamicField,
  otrs_TicketCreateRequestTicket,
  otrs_Ticketstate,
  otrs_TicketInputModality,
  otrs_TicketGetResponseTicketArticle,
  otrs_TicketArticle,
  otrs_TicketGetResponseTicketArticleAttachment,
} from '../classes/otrsclasses';
import {
  WorkplaceNameList,
  workplacesList_VETTER_ID_1,
} from '../classes/workplaces';
import { AuthService } from './auth.service';
import { OtrsService } from './otrs.service';

@Injectable({
  providedIn: 'root',
})
export class OtrsticketsService {
  allTickets: otrs_Ticket[];
  otherWorkplaces: WorkplaceNameList[];

  constructor(
    private datePipe: DatePipe,
    private authService: AuthService,
    private otrsService: OtrsService,
    private cookieService: CookieService
  ) {
    this.allTickets = new Array<otrs_Ticket>();
    this.otherWorkplaces = new Array<WorkplaceNameList>();
  }

  /**
   * Gets all non-closed tickets as well as closed ones that have been closed for less than a month. So tickets that were moved to closed will disappear after a month, unless their status was changed meannwhile. Then the "counter" starts over agein.
   * @param
   * @returns A ticket array as Promise
   */
  getTickets(): Promise<Array<otrs_Ticket>> {
    return new Promise((resolve, reject) => {
      // First, all tickets (e.g. un-losed and closed < 14 days) are being searched and the returned IDs are prepared for a TicketGetRequest
      let ticketsearchbody: otrs_TicketSearchRequest =
        new otrs_TicketSearchRequest();

      this.authService
        .getQueueIdsFromUsergroup()
        .then((queues: Array<number>) => {
          // prepare ticket search for un-closed tickets
          ticketsearchbody.QueueIDs = queues;
          ticketsearchbody.States = otrs_statesOTRS.filter(
            (_status: string | string[]) => !_status.includes('closed')
          ); // filter all status except closed

          // prepare ticket get request
          let ticketgetbody: otrs_TicketGetRequest =
            new otrs_TicketGetRequest();
          ticketgetbody.TicketID = '';
          ticketgetbody.AllArticles = 1; //true
          ticketgetbody.Attachments = 1; // this will also request the attachments so we know how many there are. But...
          ticketgetbody.GetAttachmentContents = 0; // ... since this would take very long and would cause unneccessary traffic, OTRS offers to leave out the actual content, but only returns the meta data :-)
          ticketgetbody.Extended = 1; // true
          ticketgetbody.DynamicFields = 1; // true

          // #1 search first for open (un-closed) and then for closed tickets. After that, get the respective ticket IDs from OTRS
          this.otrsService
            .TicketSearch(ticketsearchbody)
            .subscribe((data: otrs_TicketSearchResponse) => {
              if (Object.entries(data).length > 0 && data.TicketID.length > 0) {
                // add the open tickets to the Get request
                data.TicketID.map((id: Number) => {
                  ticketgetbody.TicketID += id.toString() + ',';
                });
              }

              // prepare search for closed tickets younger than one month
              ticketsearchbody.States = new Array(); // empty the states, bacause the following TicketCloseTimeNewerDate will do the job
              ticketsearchbody.States = otrs_statesOTRS.filter(
                (_status: string | string[]) => _status.includes('closed')
              ); // filter all closed closed tickets that are younger than ...
              ticketsearchbody.TicketCloseTimeNewerDate =
                this.datePipe.transform(Date.now() - 1209600000, 'yyyy-MM-dd') +
                ' 00:00:01'; // ... 1209600000 = 14 days

              // #2 search for ticktes that have been closed for less than threshold
              this.otrsService
                .TicketSearch(ticketsearchbody)
                .subscribe((data: otrs_TicketSearchResponse) => {
                  if (
                    Object.entries(data).length > 0 &&
                    data.TicketID.length > 0 &&
                    data
                  ) {
                    // add the closed tickets younger than one month to the Get request
                    data.TicketID.map((id: Number) => {
                      ticketgetbody.TicketID += id.toString() + ',';
                    });
                  }

                  if (ticketgetbody.TicketID != '') {
                    let _ticketPromise: Promise<otrs_Ticket[]> =
                      this.getTicket(ticketgetbody);
                    _ticketPromise.then((ticketList: otrs_Ticket[]) => {
                      this.allTickets = ticketList;
                    });
                    resolve(_ticketPromise);
                  } else {
                    // if there are no tickets resolved by OTRS, an empty array will be resolved
                    reject([]);
                    console.log(
                      'Keine Tickets entsprechen den Suchparametern. Vielleicht sind einfach keine neuen oder kürzlich geschlossenen Tickets vorhanden.'
                    );
                  }
                });
            });
        })
        .catch((error: Error) => {
          reject(error.message);
        });
    });
  }

  /**
   * Get single ticket from OTRS
   * @param ticketgetbody
   */
  getTicket(ticketgetbody: otrs_TicketGetRequest): Promise<Array<otrs_Ticket>> {
    return new Promise((resolve, reject) => {
      this.otrsService.TicketGet(ticketgetbody).subscribe(
        (getdata: otrs_TicketGetResponse) => {
          let _tickets: otrs_Ticket[] = new Array();

          for (let i in getdata.Ticket) {
            let _responseTicket = getdata.Ticket[
              i
            ] as any as otrs_TicketGetResponseTicket;
            let newticket: otrs_Ticket = new otrs_Ticket();

            //Build the ticket
            newticket.id = _responseTicket.TicketID;
            newticket.title = _responseTicket.Title;
            newticket.stateOTRS = _responseTicket.State;
            newticket.dueDate =
              this.findDueDateInDynamicFields(_responseTicket);
            newticket.overdue = this.isDueDateExpired(newticket.dueDate);
            newticket.creationdate = new Date(
              +_responseTicket.Article[0].IncomingTime * 1000
            ); // notwendig, da das CreateDate und alle anderen Dates aus OTRS falsch zurückkommen. Die IncomingTime aus dem Artikel ist die richte Zeit als Unix-Timestamp und muss mit dem Faktor 1000 multipliziert werden, damit der Date-Construktor den Wert annimmt!
            newticket.workplace =
              this.findWorkplaceInDynamicFields(_responseTicket);
            newticket.categorie =
              this.findCategoryInDynamicFields(_responseTicket);
            newticket.state = this.findStateInDynamicFields(_responseTicket);
            newticket.ticketArticles = this.findAllArticles(_responseTicket);
            newticket.workerdowntime =
              this.findWorkerdowntimeInDynamicFields(_responseTicket);
            newticket.workerrecurring =
              this.findWorkerrecurringInDynamicFields(_responseTicket);
            newticket.workerrestriction =
              this.findWorkerrestrictionInDynamicFields(_responseTicket);
            newticket.maintenanceeffort =
              this.findMaintenanceEffortInDynamicFields(_responseTicket);
            newticket.ticketinputmodality =
              this.findTicketInputModalityInDynamicFields(_responseTicket);
            newticket.audios = new Array(); // todo
            newticket.photos = this.findAllImagesInArticles(_responseTicket);
            newticket.priority = _responseTicket.Priority;
            // push to ticket array
            _tickets.push(newticket);

            // eventually add a workplace to the workplace lists, in case it does not exist yet
            this.addOtherWorkplaces(newticket);
          }

          resolve(_tickets);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  private addOtherWorkplaces(ticket: otrs_Ticket) {
    // search in the "ordinary" workplaces list
    let _workplace = workplacesList_VETTER_ID_1.find(
      (_wp: { text: string | any[] }) => _wp.text.includes(ticket.workplace)
    );

    // if there was no match before and there are already new workplaces in the 'otherWorkplaces' list, continue search here
    if (_workplace == undefined && this.otherWorkplaces.length > 0) {
      _workplace = this.otherWorkplaces.find((_wp: { text: string | any[] }) =>
        _wp.text.includes(ticket.workplace)
      );
    }

    // if there were no matches, create a new workplae in 'otherWorkplaces'
    //    the list otherWorkplaces will be separately shown in the filter dialog
    if (_workplace == undefined) {
      this.otherWorkplaces.push({
        id: 999,
        title: ticket.workplace,
        description: ticket.workplace,
        text: ticket.workplace,
      });
    }
  }

  /**
   * Create a ticket in OTRS
   * @param ticketcreatebody
   */
  async saveTicket(
    buildticket: otrs_Ticket
  ): Promise<otrs_TicketCreateResponse> {
    //Build the ticket
    let ticketcreatebody: otrs_TicketCreateRequest =
      new otrs_TicketCreateRequest();

    //Article
    let article = buildticket.ticketArticles[
      buildticket.ticketArticles.length - 1
    ] as any as otrs_TicketCreateRequestArticle;
    article.CommunicationChannel = 'Email';
    article.Subject = 'Ticket wurde erstellt';

    article.Body +=
      " <br> <span class='secondaryText'>" +
      'Priorität: ' +
      buildticket.priority +
      ', </span>';
    article.Body +=
      " <br> <span class='secondaryText'>" +
      'Aufwandsschätzung Instandhaltung: ' +
      buildticket.maintenanceeffort +
      ', </span>';
    article.ContentType = 'text/plain; charset=utf-8';
    article.From = this.authService.userFullName;
    article.ContentType = 'text/plain; charset=utf-8';
    ticketcreatebody.Article = article;

    //Attachments
    buildticket.photos.forEach((attachment: otrs_GenericAttachment) => {
      ticketcreatebody.Attachment.push(attachment);
    });
    if (ticketcreatebody.Attachment.length == 0) {
      ticketcreatebody.Attachment = null;
    }

    //DynamicFields
    ticketcreatebody.DynamicField.push(
      new otrs_GenericDynamicField('workplace', buildticket.workplace)
    );
    ticketcreatebody.DynamicField.push(
      new otrs_GenericDynamicField('workerdowntime', buildticket.workerdowntime)
    );
    ticketcreatebody.DynamicField.push(
      new otrs_GenericDynamicField(
        'workerrecurring',
        buildticket.workerrecurring
      )
    );
    ticketcreatebody.DynamicField.push(
      new otrs_GenericDynamicField(
        'workerrestriction',
        buildticket.workerrestriction
      )
    );
    ticketcreatebody.DynamicField.push(
      new otrs_GenericDynamicField('workerpriority', buildticket.workerpriority)
    );
    ticketcreatebody.DynamicField.push(
      new otrs_GenericDynamicField(
        'maintenanceeffort',
        '' + buildticket.maintenanceeffort
      )
    );
    ticketcreatebody.DynamicField.push(
      new otrs_GenericDynamicField('category', buildticket.categorie)
    );
    ticketcreatebody.DynamicField.push(
      new otrs_GenericDynamicField(
        'ticketinputmodality',
        '' + buildticket.ticketinputmodality
      )
    );
    if (ticketcreatebody.DynamicField.length == 0) {
      ticketcreatebody.DynamicField = null;
    }
    if (buildticket.dueDate) {
      ticketcreatebody.DynamicField.push(
        new otrs_GenericDynamicField(
          'dueDate',
          buildticket.dueDate.toUTCString()
        )
      );
    }

    //Ticket
    let ticketCreateRequestTicket = new otrs_TicketCreateRequestTicket();
    ticketCreateRequestTicket.Title = buildticket.title;
    //ticketcreatebody.Ticket.PendingTime = new GenericPe

    //Get the correct Queue for the user
    ticketCreateRequestTicket.QueueID =
      this.authService.getQueueIdFromUsername();
    ticketCreateRequestTicket.StateID = 1;
    ticketCreateRequestTicket.Priority = buildticket.priority.toString();
    ticketCreateRequestTicket.Owner = 'vetterapiuser';
    ticketCreateRequestTicket.Responsible = 'vetterapiuser';
    ticketCreateRequestTicket.CustomerUser =
      this.cookieService.get('stoeri_username');
    ticketcreatebody.Ticket = ticketCreateRequestTicket;

    return new Promise((resolve, reject) => {
      this.otrsService.TicketCreate(ticketcreatebody).subscribe(
        (getdata: otrs_TicketCreateResponse) => {
          resolve(getdata);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  findWorkplaceInDynamicFields(
    responseTicekt: otrs_TicketGetResponseTicket
  ): string {
    let workplace = '';
    responseTicekt.DynamicField.forEach((df: otrs_GenericDynamicField) => {
      if (df.Name == 'workplace') {
        workplace = df.Value;
      }
    });
    if (!workplace) {
      workplace = 'Kein Arbeitsplatz';
    }
    return workplace;
  }

  findCategoryInDynamicFields(
    responseTicket: otrs_TicketGetResponseTicket
  ): string {
    let category = '';
    responseTicket.DynamicField.forEach((df: otrs_GenericDynamicField) => {
      if (df.Name == 'category') {
        category = df.Value;
      }
    });
    if (!category) {
      category = 'Keine Kategorie';
    }
    return category;
  }

  findStateInDynamicFields(
    responseTicket: otrs_TicketGetResponseTicket
  ): otrs_Ticketstate {
    let state = otrs_Ticketstate.pool;
    responseTicket.DynamicField.forEach((df: otrs_GenericDynamicField) => {
      if (df.Name == 'state') {
        state = parseInt(df.Value);
      }
    });
    if (!state) {
      state = otrs_Ticketstate.pool;
    }
    return state;
  }

  findTicketInputModalityInDynamicFields(
    responseTicket: otrs_TicketGetResponseTicket
  ): otrs_TicketInputModality {
    let _modality = otrs_TicketInputModality.Unbestimmt;

    responseTicket.DynamicField.forEach((df: otrs_GenericDynamicField) => {
      if (df.Name == 'ticketinputmodality') {
        _modality = parseInt(df.Value);
      }
    });
    if (!_modality) {
      _modality = otrs_TicketInputModality.Unbestimmt;
    }
    return _modality;
  }

  findWorkerdowntimeInDynamicFields(
    responseTicket: otrs_TicketGetResponseTicket
  ): string {
    let workerdowntime = '';
    responseTicket.DynamicField.forEach((df: otrs_GenericDynamicField) => {
      if (df.Name == 'workerdowntime') {
        workerdowntime = df.Value;
      }
    });
    if (!workerdowntime) {
      workerdowntime = '0';
    }
    return workerdowntime;
  }

  findMaintenanceEffortInDynamicFields(
    responseTicket: otrs_TicketGetResponseTicket
  ): number {
    let maintenanceeffort: number;
    responseTicket.DynamicField.forEach((df: otrs_GenericDynamicField) => {
      if (df.Name == 'maintenanceeffort') {
        maintenanceeffort = df.Value as any as number;
      }
    });
    if (!maintenanceeffort) {
      maintenanceeffort = 0;
    }
    return maintenanceeffort;
  }

  findWorkerrecurringInDynamicFields(
    responseTicket: otrs_TicketGetResponseTicket
  ): string {
    let workerrecurring = '';
    responseTicket.DynamicField.forEach((df: otrs_GenericDynamicField) => {
      if (df.Name == 'workerrecurring') {
        workerrecurring = df.Value;
      }
    });
    if (!workerrecurring) {
      workerrecurring = '0';
    }
    return workerrecurring;
  }

  findWorkerrestrictionInDynamicFields(
    responseTicket: otrs_TicketGetResponseTicket
  ): string {
    let workerrestriction = '';
    responseTicket.DynamicField.forEach((df: otrs_GenericDynamicField) => {
      if (df.Name == 'workerrestriction') {
        workerrestriction = df.Value;
      }
    });
    if (!workerrestriction) {
      workerrestriction = '0';
    }
    return workerrestriction;
  }

  /**
   * Maybe depricated, as in the future the former message of the ticket is being replaced by an article array according to OTRS (CK)
   * @param getdata Object of type TicketGetResponse
   */
  findAllBodysInArticles(responseTicket: otrs_TicketGetResponseTicket): string {
    let body = '';
    let articleDate: string;
    let correctedIncomingTime: string;
    responseTicket.Article.forEach(
      (article: otrs_TicketGetResponseTicketArticle) => {
        correctedIncomingTime = article.IncomingTime + '000'; // notwendig, da die Angular-Datepipe mit dem Unix-Timestamp-Format nicht zurechtkommt. Es scheinen drei Nullen am Ende zu fehlen, die unten einfach hinzugefügt werden...
        articleDate = this.datePipe.transform(
          correctedIncomingTime,
          'dd.MM.yyyy HH:mm'
        );
        body = body.concat(
          '<p>',
          articleDate,
          ' (',
          article.From,
          '):<br>',
          article.Body,
          '<br>-----',
          '</p>'
        );
      }
    );
    return body;
  }

  /**
   * Gets all Articles of a ticket and saves it to an Array of TicketArticle
   * @param ticketGetResponse TicketGetResponse
   * @returns TicketArticle[]
   * @author Christoph
   */
  findAllArticles(
    responseTicket: otrs_TicketGetResponseTicket
  ): otrs_TicketArticle[] {
    let ticketArticles: otrs_TicketArticle[] = new Array();
    let articleDate: string;
    let correctedIncomingTime: string;

    responseTicket.Article.forEach(
      (article: otrs_TicketGetResponseTicketArticle) => {
        correctedIncomingTime = article.IncomingTime + '000'; // notwendig, da die Angular-Datepipe mit dem Unix-Timestamp-Format nicht zurechtkommt. Es scheinen drei Nullen am Ende zu fehlen, die unten einfach hinzugefügt werden...
        articleDate = this.datePipe.transform(
          correctedIncomingTime,
          'dd.MM.yyyy HH:mm'
        );

        article.IncomingTime = articleDate; // replaces the corrected timestamp with a readable time format
        ticketArticles.push(article as otrs_TicketArticle);

        // body = body.concat("<p>", articleDate, " (", article.From, "):<br>", article.Body, "<br>-----", "</p>");
      }
    );
    return ticketArticles;
  }

  findAllImagesInArticles(
    responseTicket: otrs_TicketGetResponseTicket
  ): otrs_GenericAttachment[] {
    let images = new Array();
    responseTicket.Article.forEach(
      (article: otrs_TicketGetResponseTicketArticle) => {
        if (article.hasOwnProperty('Attachment')) {
          article.Attachment.forEach(
            (attachment: otrs_TicketGetResponseTicketArticleAttachment) => {
              let ga = new otrs_GenericAttachment();
              ga.Content = attachment.Content;
              ga.ContentType = attachment.ContentType;
              ga.Filename = attachment.Filename;
              ga.TimeStamp = article.IncomingTime;
              if (ga.ContentType != 'text/plain') {
                images.push(ga);
              }
            }
          );
        }
      }
    );
    return images;
  }

  findDueDateInDynamicFields(
    responseTicket: otrs_TicketGetResponseTicket
  ): Date {
    let _dueDate: Date;
    responseTicket.DynamicField.forEach((df: otrs_GenericDynamicField) => {
      if (df.Name == 'dueDate') {
        if (!df.Value) {
          _dueDate = undefined;
        } else {
          _dueDate = new Date(df.Value);
        }
      }
    });
    if (!_dueDate) {
      _dueDate = undefined;
    }
    return _dueDate;
  }

  isDueDateExpired(dueDate: Date): boolean {
    if (dueDate && dueDate.getTime() < Date.now()) {
      return true; // not overdue
    } else {
      return false; // not overdue; also coveres cases when the date is not defined (undefinded, null, not a date, etc.)
    }
  }

  calculatepriority(buildticket: {
    workerdowntime: string;
    workerrecurring: string;
    workerrestriction: string;
  }) {
    let calculatedpriority =
      (parseInt(buildticket.workerdowntime) +
        parseInt(buildticket.workerrecurring)) *
      parseInt(buildticket.workerrestriction);

    //Now get the percentage of the calculatedpriority while 0 = 0% and 600 = 100%
    calculatedpriority = (calculatedpriority / 600) * 100;

    if (calculatedpriority < 10) {
      calculatedpriority = 10;
    }
    if (calculatedpriority > 70) {
      calculatedpriority = 70;
    }
    return calculatedpriority;
  }

  calculateBase64MimeType(encoded: string) {
    var result = null;
    if (typeof encoded !== 'string') {
      return result;
    }
    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
      result = mime[1];
    }
    return result;
  }
}
