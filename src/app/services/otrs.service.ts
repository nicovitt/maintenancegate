import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {
  otrs_Ticket,
  otrs_TicketCreateResponse,
  otrs_TicketGetResponse,
  otrs_TicketSearchResponse,
  otrs_TicketUpdateResponse,
  otrs_TicketSearchRequest,
  otrs_TicketGetRequest,
  otrs_TicketCreateRequest,
  otrs_TicketUpdateRequest,
  otrs_SessionCreateRequest,
  otrs_SessionCreateResponse,
  otrs_SessionGetRequest,
  otrs_SessionGetResponse,
  otrs_statesOTRS,
  otrs_TicketGetResponseTicket,
  otrs_Ticketstate,
  otrs_GenericDynamicField,
  otrs_TicketUpdateRequestArticle,
  otrs_TicketUpdateRequestAttachment,
  otrs_TicketCreateRequestArticle,
  otrs_TicketCreateRequestTicket,
  otrs_TicketUpdateRequestTicket,
  otrs_GenericAttachment,
  otrs_TicketGetResponseTicketArticle,
  otrs_TicketGetResponseTicketArticleAttachment,
  otrs_TicketArticle,
  otrs_TicketInputModality,
} from '../classes/otrsclasses';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import {
  WorkplaceNameList,
  workplacesList_VETTER_ID_1,
  workplacesList_BRAEUER_ID_2,
  workplacesList_DEFAULT_ID_0,
} from '../classes/workplaces';
import { DatePipe } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OtrsService {
  endpointUrl =
    'https://tickets.kompetenzzentrum-siegen.digital/otrs/nph-genericinterface.pl/Webservice/Stoermeldungen_REST/';
  sessionid: string = '';
  canEditTickets: boolean; // needs to be stored here for parent-child-communication (app.component -> all its children)
  editTicketModeEnabled: boolean; // needs to be stored here for parent-child-communication (app.component -> all its children)
  scrollPositionTicketList: number;
  routingOrigin: string; // variable to store the component url from where a ticket input was started

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.sessionid = this.cookieService.get('maintenancegate_otrs_sessionid');
  }

  //Ticket Create
  TicketCreate(body: otrs_TicketCreateRequest) {
    const httpbody = body ? JSON.stringify(body) : {};
    let httpoptions = {
      params: new HttpParams().set('SessionID', this.sessionid),
    };
    return this.http.post<otrs_TicketCreateResponse>(
      this.endpointUrl + 'Ticket/Create',
      httpbody,
      httpoptions
    );
  }

  //Ticket Search
  TicketSearch(body: otrs_TicketSearchRequest) {
    const httpbody = body ? JSON.stringify(body) : {};
    const httpoptions = {
      params: new HttpParams().set('SessionID', this.sessionid),
    };
    return this.http.post<otrs_TicketSearchResponse>(
      this.endpointUrl + 'Tickets/Search',
      httpbody,
      httpoptions
    );
  }

  //Ticket Get
  TicketGet(body: otrs_TicketGetRequest) {
    const httpbody = body ? JSON.stringify(body) : {};
    let httpoptions = {
      params: new HttpParams().set('SessionID', this.sessionid),
    };
    return this.http.post<otrs_TicketGetResponse>(
      this.endpointUrl + 'Ticket/Get',
      httpbody,
      httpoptions
    );
  }

  //Ticket Update
  TicketUpdate(
    body: otrs_TicketUpdateRequest
  ): Observable<otrs_TicketUpdateResponse> {
    const httpbody = body ? JSON.stringify(body) : {};
    let httpoptions = {
      params: new HttpParams().set('SessionID', this.sessionid),
    };
    return this.http.post<otrs_TicketUpdateResponse>(
      this.endpointUrl + 'Ticket/Update',
      httpbody,
      httpoptions
    );
  }

  //Session Create
  SessionCreate(body: otrs_SessionCreateRequest) {
    const httpbody = body ? JSON.stringify(body) : {};
    return this.http.post<otrs_SessionCreateResponse>(
      this.endpointUrl + 'Session/Create',
      httpbody
    );
  }

  //Session Get
  SessionGet(body: otrs_SessionGetRequest) {
    const httpbody = body ? JSON.stringify(body) : {};
    return this.http.post<otrs_SessionGetResponse>(
      this.endpointUrl + 'Session/Get',
      httpbody
    );
  }
}
