import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../classes/user';
import { ZammadService } from './zammad.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _isLoggedIn = false;
  private _username: string = 'Benutzer';
  private _domainname: string = '';
  private _caneditticket: boolean = false;

  constructor(private zammadService: ZammadService) {}

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.zammadService
        .authorize(username, password)
        .then(
          (resolved) => {
            if (!resolved) {
              resolve(resolved);
            }
            this.zammadService.getCurrentUserDetails().subscribe((data) => {
              if (data.status == 200) {
                const x = data.body as User;
                if (x.role_ids.includes(4)) {
                  this.caneditticket = true;
                }
                this.username = x.firstname + ' ' + x.lastname;
                this.domainname = x.maintenancegate_parse_domainname;
                this._isLoggedIn = true;
                resolve(resolved);
              }
            });
          },
          (rejected) => {
            this._isLoggedIn = false;
            reject(rejected);
          }
        )
        .catch((error) => {
          this._isLoggedIn = false;
          reject(false);
        });
    });
  }

  logout() {
    this._isLoggedIn = false;
    this.zammadService.logout();
  }

  get isLoggedIn() {
    return this._isLoggedIn;
  }

  get username() {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get domainname() {
    return this._domainname;
  }

  set domainname(value: string) {
    this._domainname = value;
  }

  get caneditticket() {
    return this._caneditticket;
  }

  set caneditticket(value: boolean) {
    this._caneditticket = value;
  }
}
