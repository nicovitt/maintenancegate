import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ticket } from '../classes/ticket';
import { LocalstorageService } from './localstorage.service';
import { PlainArticlePost } from '../classes/article';
import { Group } from '../classes/group';

@Injectable({
  providedIn: 'root',
})
export class ZammadService {
  constructor(private http: HttpClient, private lss: LocalstorageService) {}

  // getCurrentUserDetails(): Observable<HttpResponse<any>> {
  //   return this.http.get(
  //     'https://zammad-1.zentrum-digitalisierung.de/api/v1/users/me',
  //     {
  //       headers: this._createHeadersWithTokenAuthorization(),
  //       observe: 'response',
  //     }
  //   );
  // }

  showTicket(ticketid: number) {
    return this.http
      .get<Array<any>>(
        'https://zammad-1.zentrum-digitalisierung.de/api/v1/tickets/' +
          ticketid,
        { headers: this._createHeadersWithTokenAuthorization() }
      )
      .pipe(
        tap((ticket: any) => {
          ticket.downtime = JSON.parse(ticket.downtime.replace(/=>/gm, ':'));
          ticket.frequency = JSON.parse(ticket.frequency.replace(/=>/gm, ':'));
          ticket.priority = JSON.parse(ticket.priority.replace(/=>/gm, ':'));
          ticket.restriction = JSON.parse(
            ticket.restriction.replace(/=>/gm, ':')
          );
          ticket.workplace = JSON.parse(ticket.workplace.replace(/=>/gm, ':'));
          ticket.faultcategory = JSON.parse(
            ticket.faultcategory.replace(/=>/gm, ':')
          );
          ticket.duedate = JSON.parse(ticket.duedate.replace(/=>/gm, ':'));
        })
      );
  }

  listTickets() {
    return this.http
      .get<Array<any>>(
        'https://zammad-1.zentrum-digitalisierung.de/api/v1/tickets',
        { headers: this._createHeadersWithTokenAuthorization() }
      )
      .pipe(
        tap((tickets: any) => {
          tickets.forEach((ticket: any) => {
            ticket.downtime = JSON.parse(ticket.downtime.replace(/=>/gm, ':'));
            ticket.frequency = JSON.parse(
              ticket.frequency.replace(/=>/gm, ':')
            );
            ticket.priority = JSON.parse(ticket.priority.replace(/=>/gm, ':'));
            ticket.restriction = JSON.parse(
              ticket.restriction.replace(/=>/gm, ':')
            );
            ticket.workplace = JSON.parse(
              ticket.workplace.replace(/=>/gm, ':')
            );
            ticket.faultcategory = JSON.parse(
              ticket.faultcategory.replace(/=>/gm, ':')
            );
            ticket.duedate = JSON.parse(ticket.duedate.replace(/=>/gm, ':'));
          });
        })
      );
  }

  // postTicket(ticket: Ticket): Observable<HttpResponse<Ticket>> {
  //   return this.http.post<Ticket>(
  //     'https://zammad-1.zentrum-digitalisierung.de/api/v1/tickets',
  //     ticket,
  //     {
  //       headers: this._createHeadersWithTokenAuthorization(),
  //       observe: 'response',
  //     }
  //   );
  // }

  updateTicket(ticket: Ticket): Observable<HttpResponse<Ticket>> {
    return this.http.put<Ticket>(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/tickets/' + ticket.id,
      ticket,
      {
        headers: this._createHeadersWithTokenAuthorization(),
        observe: 'response',
      }
    );
  }

  listArticlesByTicket(ticketid: number) {
    return this.http.get<Array<any>>(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/ticket_articles/by_ticket/' +
        ticketid,
      { headers: this._createHeadersWithTokenAuthorization() }
    );
  }

  createPlainArticle(article: PlainArticlePost): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/ticket_articles',
      article,
      {
        headers: this._createHeadersWithTokenAuthorization(),
        observe: 'response',
      }
    );
  }

  listGroups() {
    return this.http.get<Array<Group>>(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/groups',
      { headers: this._createHeadersWithTokenAuthorization() }
    );
  }

  private _createHeadersWithTokenAuthorization(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      // Authorization:
      // 'Token token=' + this.lss.getitem(environment.sessiontokenname),
    });
  }

  private _createHeadersWithBasicAuthorization(
    username: string,
    password: string
  ): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic ' + btoa(username + ':' + password),
    });
  }
}
