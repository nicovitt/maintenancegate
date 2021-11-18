import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { Ticket } from '../classes/ticket';
import { LocalstorageService } from './localstorage.service';
import { environment } from '../../environments/environment';
import { PlainArticlePost } from '../classes/article';

/**
 * TODO: Create an interceptor to handle authentication.
 */
@Injectable({
  providedIn: 'root',
})
export class ZammadService {
  constructor(private http: HttpClient, private lss: LocalstorageService) {}

  getUser() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization:
        'Token token=' + this.lss.getitem(environment.sessiontokenname),
    });
    return this.http.get(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/users',
      {
        headers: headers,
      }
    );
  }

  checkSession(): Promise<boolean> {
    if (this.lss.getitem(environment.sessiontokenname)) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization:
          'Token token=' + this.lss.getitem(environment.sessiontokenname),
      });
      return new Promise((resolve, reject) => {
        this.http
          .get('https://zammad-1.zentrum-digitalisierung.de/api/v1/users/me', {
            headers: headers,
          })
          .subscribe(
            (value: any) => {
              // console.log(value);
              resolve(true);
            },
            (error: any) => {
              console.log(error);
              reject(false);
            }
          );
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    }
  }

  /**
   *
   * @param username
   * @param password
   * @returns Provides an access token which is stored and can be used for further requests until logout.
   */
  authorize(username: string, password: string): Promise<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic ' + btoa(username + ':' + password),
    });

    return new Promise((resolve, reject) => {
      this.http
        .get(
          'https://zammad-1.zentrum-digitalisierung.de/api/v1/user_access_token',
          { headers: headers }
        )
        .subscribe((data: any) => {
          // Remove old token if existing
          if (data['tokens'].length > 0) {
            data['tokens'].forEach((token: any) => {
              if (token['label'] === environment.sessiontokenlabel) {
                this.lss.removeitem(environment.sessiontokenname);
                this.http
                  .delete(
                    'https://zammad-1.zentrum-digitalisierung.de/api/v1/user_access_token/' +
                      token['id'],
                    { headers: headers }
                  )
                  .subscribe(
                    (value) => {
                      console.log('Delete token success.');
                    },
                    (error) => {
                      console.log('Delete token error.');
                    }
                  );
              }
            });
          }

          // Create an access token
          this.http
            .post(
              'https://zammad-1.zentrum-digitalisierung.de/api/v1/user_access_token',
              {
                label: environment.sessiontokenlabel,
                permission: ['cti.agent', 'ticket.agent'],
                expires_at: null as any,
              },
              { headers: headers }
            )
            .subscribe(
              (value: any) => {
                // Check if access token was created successfully.
                if (value['name']) {
                  // Write to localStorage to use in future requests.
                  this.lss.setitem(environment.sessiontokenname, value['name']);
                  this.lss.setitem(environment.sessionuserlabel, username);
                  resolve(true);
                }
              },
              (error) => {
                reject(true);
              }
            );
        });
    });
  }

  logout() {
    // TODO: Remove the token in zammad aswell.

    // Remove token from local storage
    this.lss.removeitem(environment.sessiontokenname);
    this.lss.removeitem(environment.sessionuserlabel);
  }

  getCurrentUserDetails() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization:
        'Token token=' + this.lss.getitem(environment.sessiontokenname),
    });
    return this.http.get(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/users/me',
      { headers: headers }
    );
  }

  showTicket(ticketid: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization:
        'Token token=' + this.lss.getitem(environment.sessiontokenname),
    });
    return this.http
      .get<Array<any>>(
        'https://zammad-1.zentrum-digitalisierung.de/api/v1/tickets/' +
          ticketid,
        { headers: headers }
      )
      .pipe(
        tap((ticket: any) => {
          ticket.maintenancegate_downtime = JSON.parse(
            ticket.maintenancegate_downtime.replace(/=>/gm, ':')
          );
          ticket.maintenancegate_frequency = JSON.parse(
            ticket.maintenancegate_frequency.replace(/=>/gm, ':')
          );
          ticket.maintenancegate_priority = JSON.parse(
            ticket.maintenancegate_priority.replace(/=>/gm, ':')
          );
          ticket.maintenancegate_restriction = JSON.parse(
            ticket.maintenancegate_restriction.replace(/=>/gm, ':')
          );
          ticket.maintenancegate_workplace = JSON.parse(
            ticket.maintenancegate_workplace.replace(/=>/gm, ':')
          );
          ticket.maintenancegate_faultcategory = JSON.parse(
            ticket.maintenancegate_faultcategory.replace(/=>/gm, ':')
          );
        })
      );
  }

  listTickets() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization:
        'Token token=' + this.lss.getitem(environment.sessiontokenname),
    });
    return this.http.get<Array<any>>(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/tickets',
      { headers: headers }
    );
  }

  postTicket(ticket: Ticket): Observable<HttpResponse<Ticket>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization:
        'Token token=' + this.lss.getitem(environment.sessiontokenname),
    });
    return this.http.post<Ticket>(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/tickets',
      ticket,
      { headers: headers, observe: 'response' }
    );
  }

  listArticlesByTicket(ticketid: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization:
        'Token token=' + this.lss.getitem(environment.sessiontokenname),
    });
    return this.http.get<Array<any>>(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/ticket_articles/by_ticket/' +
        ticketid,
      { headers: headers }
    );
  }

  createPlainArticle(article: PlainArticlePost): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization:
        'Token token=' + this.lss.getitem(environment.sessiontokenname),
    });
    return this.http.post<any>(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/ticket_articles',
      article,
      { headers: headers, observe: 'response' }
    );
  }
}
