import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ticket, TicketCreateRequest } from '../classes/ticket';
import { LocalstorageService } from './localstorage.service';
import { environment } from '../../environments/environment';
import { PlainArticlePost } from '../classes/article';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root',
})
export class ZammadService {
  constructor(private http: HttpClient, private lss: LocalstorageService) {}

  /**
   *
   * @param username
   * @param password
   * @returns Provides an access token which is stored and can be used for further requests until logout.
   */
  async authorize(username: string, password: string): Promise<boolean> {
    // First check whether the current token is useable
    return this.checkSession()
      .then((resolved: boolean) => {
        if (!resolved) {
          // The session is not valid anymore and a new one has to be set up with the provided credentials.
          return this.createnewsession(username, password);
        } else {
          // The session is valid and the accesstoken will be returned.
          return new Promise<boolean>((resolve, reject) => {
            resolve(true);
          });
        }
      })
      .catch(() => {
        // There was an error in calling the backend.
        return new Promise<boolean>((resolve, reject) => {
          reject(false);
        });
      });
  }

  logout() {
    // TODO: Remove the token in zammad aswell.
    // Remove token from local storage
    this.lss.removeitem(environment.sessiontokenname);
    this.lss.removeitem(environment.sessionuserlabel);
  }

  private checkSession(): Promise<boolean> {
    if (this.lss.getitem(environment.sessiontokenname)) {
      return new Promise((resolve, reject) => {
        this.getUser().subscribe(
          (value: HttpResponse<any>) => {
            if (value.status == 200) {
              resolve(true);
            } else {
              // The endpoint can not be reached (perhaps unauthorized). Remove the sessiontoken from local storage.
              this.logout();
              resolve(false);
            }
          },
          () => {
            // The endpoint can not be reached (perhaps unauthorized). Remove the sessiontoken from local storage.
            this.logout();
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

  private createnewsession(
    username: string,
    password: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          'https://zammad-1.zentrum-digitalisierung.de/api/v1/user_access_token',
          {
            headers: this._createHeadersWithBasicAuthorization(
              username,
              password
            ),
          }
        )
        .subscribe((data: any) => {
          // Remove old token if existing
          if (data['tokens'].length > 0) {
            data['tokens'].forEach((token: any) => {
              if (token['label'] === environment.sessiontokenlabel) {
                // this.lss.removeitem(environment.sessiontokenname);
                this.http
                  .delete(
                    'https://zammad-1.zentrum-digitalisierung.de/api/v1/user_access_token/' +
                      token['id'],
                    {
                      headers: this._createHeadersWithBasicAuthorization(
                        username,
                        password
                      ),
                    }
                  )
                  .subscribe(
                    (value) => {
                      console.log('Token in Zammad successfully deleted.');
                    },
                    (error) => {
                      console.log(
                        'There was an error while deleting the token in Zammad.'
                      );
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
              {
                headers: this._createHeadersWithBasicAuthorization(
                  username,
                  password
                ),
              }
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

  getUser(): Observable<HttpResponse<User>> {
    return this.http.get<User>(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/users',
      {
        headers: this._createHeadersWithTokenAuthorization(),
        observe: 'response',
      }
    );
  }

  getCurrentUserDetails(): Observable<HttpResponse<any>> {
    return this.http.get(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/users/me',
      {
        headers: this._createHeadersWithTokenAuthorization(),
        observe: 'response',
      }
    );
  }

  showTicket(ticketid: number) {
    return this.http
      .get<Array<any>>(
        'https://zammad-1.zentrum-digitalisierung.de/api/v1/tickets/' +
          ticketid,
        { headers: this._createHeadersWithTokenAuthorization() }
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
          ticket.maintenancegate_duedate = JSON.parse(
            ticket.maintenancegate_duedate.replace(/=>/gm, ':')
          );
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
            ticket.maintenancegate_duedate = JSON.parse(
              ticket.maintenancegate_duedate.replace(/=>/gm, ':')
            );
          });
        })
      );
  }

  postTicket(ticket: TicketCreateRequest): Observable<HttpResponse<Ticket>> {
    return this.http.post<Ticket>(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/tickets',
      ticket,
      {
        headers: this._createHeadersWithTokenAuthorization(),
        observe: 'response',
      }
    );
  }

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

  private _createHeadersWithTokenAuthorization(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization:
        'Token token=' + this.lss.getitem(environment.sessiontokenname),
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
