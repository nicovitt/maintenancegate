import { Injectable } from '@angular/core';
import { OtrsService } from './otrs.service';
import { CookieService } from 'ngx-cookie-service';
import {
  otrs_SessionGetRequest,
  otrs_SessionGetResponse,
  otrs_SessionCreateRequest,
  otrs_SessionCreateResponse,
  otrs_SessionGetResponseData,
} from '../classes/otrsclasses';
import {
  groupqueuerelationlist,
  GroupQueueRelation,
  customeruserqueuerelationlist,
  CustomeruserQueueRelation,
} from '../classes/otrsclasses';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  canSeeKanban: boolean;
  userFullName: string = '';
  customerID: number; // customer ID from OTRS
  get username(): string {
    return this.cookieService.get('stoeri_username');
  }
  set username(name: string) {
    this.cookieService.set('stoeri_username', name.trim().toLowerCase());
  }

  constructor(
    private otrsService: OtrsService,
    private cookieService: CookieService
  ) {
    // set user's proper first- and lastname. Therefore a separate get-request has to be sent to OTRS.
    this.getUserFullNameFromSession().then(
      (fullname: string) => {
        this.userFullName = fullname;
      },
      (error) => {}
    );

    // set a property also for other components to easily check for access rights
    this.checkIfCanSeeKanban().then((_result: boolean) => {
      this.canSeeKanban = _result;
    });
  }

  logIn(_username: string, _password: string): Promise<boolean> {
    let sessionbody = new otrs_SessionCreateRequest();
    let sessionGetRequest = new otrs_SessionGetRequest();
    sessionbody.CustomerUserLogin = _username;
    sessionbody.Password = _password;
    return new Promise((resolve, reject) => {
      this.otrsService.SessionCreate(sessionbody).subscribe(
        (data: otrs_SessionCreateResponse) => {
          if (data.hasOwnProperty('Error')) {
            //redirect to the main page
            reject(false);
          } else {
            this.cookieService.set(
              'maintenancegate_otrs_sessionid',
              data.SessionID
            );
            this.username = _username;
            //Perhaps this won't work well, because the cookie can not be retrieved in the next component.
            //Works after redirect. Perhaps, just a guess.
            // this.router.navigate(["tickets"]);
            this.getUserFullNameFromSession(); // to get the user's proper first- and lastname to be stored in the cookieService (CK)
            resolve(true);
          }
        },
        (error) => {
          console.log(error);
          //redirect to the main page
          reject(false);
        }
      );
    });
  }

  checkIfLoggedIn(): Promise<boolean> {
    let sessiongetbody: otrs_SessionGetRequest = new otrs_SessionGetRequest();
    sessiongetbody.SessionID = this.cookieService.get(
      'maintenancegate_otrs_sessionid'
    );
    return new Promise((resolve, reject) => {
      this.otrsService.SessionGet(sessiongetbody).subscribe(
        (data: otrs_SessionGetResponse) => {
          if (data.Error) {
            reject(data.Error);
          } else {
            resolve(true);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  checkIfCanSeeKanban(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getUsergroupsFromSession()
        .then((groups: Array<number>) => {
          //Run through the array and push the value to the cansee-array.
          let cansee = new Array<boolean>();
          groups.forEach((groupid: number) => {
            groupqueuerelationlist.forEach((gqr: GroupQueueRelation) => {
              if (groupid == gqr.groupid) {
                cansee.push(gqr.canSeeKanban);
              }
            });
          });

          //Check if there the user has the permission at least from one group and return
          if (cansee.includes(true)) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((ex: Error) => {
          reject('checkIfCanSeeKanban');
        });
    });
  }

  getQueueIdsFromUsergroup(): Promise<Array<number>> {
    return new Promise((resolve, reject) => {
      this.getUsergroupsFromSession()
        .then((groups: Array<number>) => {
          let queueids = new Array();
          groups.forEach((groupid: number) => {
            groupqueuerelationlist.forEach((gqr: GroupQueueRelation) => {
              if (groupid == gqr.groupid) {
                queueids.push(gqr.queueid);
              }
            });
          });
          resolve(queueids);
        })
        .catch(() => {
          reject('getQueueIdsFromUsergroupError');
        });
    });
  }

  getQueueIdFromUsername(): number {
    let queueid = 0; // if 0 is being returned, this will lead to an error in OTRS requesting a proper QueueID or QUEUE

    customeruserqueuerelationlist.forEach((cqr: CustomeruserQueueRelation) => {
      if (cqr.customerusername == this.username) {
        queueid = cqr.queueid;
      }
    });

    if (queueid == -1) {
      queueid = 5; //this is the number of the parent queue for VETTER
    }

    return queueid;
  }

  getUserIDFromSession(): Promise<string> {
    let username = '';
    let sessiongetbody: otrs_SessionGetRequest = new otrs_SessionGetRequest();
    sessiongetbody.SessionID = this.cookieService.get(
      'maintenancegate_otrs_sessionid'
    );
    return new Promise((resolve, reject) => {
      this.callotrs(sessiongetbody)
        .then((data: otrs_SessionGetResponse) => {
          console.log('--- Auslesen der Session-Response ---');

          data.SessionData.forEach((sd: otrs_SessionGetResponseData) => {
            console.log('Value: ' + sd.Value + ' / Key: ' + sd.Key);

            if (sd.Key == 'UserID') {
              username = sd.Value;
            }
          });
          console.log('--- Ende Session-Response ---');
          resolve(username);
        })
        .catch(() => {
          reject('error');
        });
    });
  }

  getUserFullNameFromSession(): Promise<string> {
    let firstname = '';
    let lastname = '';
    let sessiongetbody: otrs_SessionGetRequest = new otrs_SessionGetRequest();
    sessiongetbody.SessionID = this.cookieService.get(
      'maintenancegate_otrs_sessionid'
    );
    return new Promise((resolve, reject) => {
      this.callotrs(sessiongetbody)
        .then((data: otrs_SessionGetResponse) => {
          data.SessionData.forEach((sd: otrs_SessionGetResponseData) => {
            if (sd.Key == 'UserLastname') {
              lastname = sd.Value;
            }
            if (sd.Key == 'UserFirstname') {
              firstname = sd.Value;
            }
          });
          resolve(firstname + ' ' + lastname);
        })
        .catch(() => {
          reject('error');
        });
    });
  }

  getCustomerIDFromSession(): Promise<number> {
    let sessiongetbody: otrs_SessionGetRequest = new otrs_SessionGetRequest();
    sessiongetbody.SessionID = this.cookieService.get(
      'maintenancegate_otrs_sessionid'
    );
    return new Promise((resolve, reject) => {
      this.callotrs(sessiongetbody)
        .then((data: otrs_SessionGetResponse) => {
          data.SessionData.forEach((sd: otrs_SessionGetResponseData) => {
            if (sd.Key == 'CustomerID') {
              this.customerID = +sd.Value;
            }
          });
          resolve(this.customerID);
        })
        .catch(() => {
          reject('auth.service: error calling OTRS for customerID');
        });
    });
  }

  getUsergroupsFromSession(): Promise<Array<number>> {
    let groups = new Array<number>();
    let sessiongetbody: otrs_SessionGetRequest = new otrs_SessionGetRequest();
    sessiongetbody.SessionID = this.cookieService.get(
      'maintenancegate_otrs_sessionid'
    );
    return new Promise((resolve, reject) => {
      this.callotrs(sessiongetbody)
        .then((data: otrs_SessionGetResponse) => {
          data.SessionData.forEach((sd: otrs_SessionGetResponseData) => {
            if (sd.Key == 'UserGroupsID') {
              let splitted = sd.Value.split(', ');
              splitted.forEach((strnumber: string) => {
                groups.push(+strnumber); //+ converts string to number.
              });
            }
          });
          resolve(groups);
        })
        .catch(() => {
          reject('auth.service: error calling OTRS for user groups');
        });
    });
  }

  private callotrs(
    sessiongetbody: otrs_SessionGetRequest
  ): Promise<otrs_SessionGetResponse> {
    return new Promise((resolve) => {
      this.otrsService
        .SessionGet(sessiongetbody)
        .subscribe((data: otrs_SessionGetResponse) => {
          resolve(data);
        });
    });
  }
}
