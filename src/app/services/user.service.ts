import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permissions } from '../classes/permissions';
import { User } from '../classes/user';
import { LocalstorageService } from './localstorage.service';
import { ZammadService } from './zammad.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // TODO: This should be changed somehow.
  // TODO: If one reloads the page (F5) this is reset and the user is send to login page, then to dashboard because the userdetails were retrieved from backend.
  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private _username: string = 'Benutzer';
  private _domainname: string = '';
  private permissions = new Permissions();

  constructor(
    private zammadService: ZammadService,
    private lss: LocalstorageService
  ) {
    if (this.lss.getitem(environment.sessiontokenname)) {
      this.setUserDetails();
    }
    this.lss.getitem(environment.isloggedinname)
      ? this.isLoggedIn$.next(
          this.lss.getitem(environment.isloggedinname) === 'true'
        )
      : this.isLoggedIn$.next(false);

    this._username = this.lss.getitem(environment.usernamename)
      ? this.lss.getitem(environment.usernamename)
      : 'Benutzer';

    this._domainname = this.lss.getitem(environment.domainnamename)
      ? this.lss.getitem(environment.domainnamename)
      : '';
  }

  private setUserDetails() {
    this.zammadService.getCurrentUserDetails().subscribe(
      (data) => {
        if (data.status == 200) {
          const x = data.body as User;
          if (x.role_ids.includes(4)) {
            this.permissions.caneditticket = true;
          }
          this.username = x.firstname + ' ' + x.lastname;
          this.domainname = x.maintenancegate_parse_domainname;
          this.permissions.$gotpermissionsfrombackend = true;
          this.isLoggedIn$.next(true);
          this.setLocalstorage();
        } else {
          this.lss.setitem(environment.isloggedinname, false);
          this.isLoggedIn$.next(false);
        }
      },
      () => {
        this.lss.setitem(environment.isloggedinname, false);
        this.isLoggedIn$.next(false);
      }
    );
  }

  private setLocalstorage() {
    this.lss.setitem(environment.isloggedinname, true);
    this.lss.setitem(environment.usernamename, this.username);
    this.lss.setitem(environment.domainnamename, this.domainname);
  }

  login(username: string, password: string): Promise<boolean> {
    return this.zammadService
      .authorize(username, password)
      .then(
        (resolved) => {
          this.lss.setitem(environment.isloggedinname, resolved);
          this.isLoggedIn$.next(resolved);
          resolved ? this.setUserDetails() : null;
          return resolved;
        },
        (rejected) => {
          this.lss.setitem(environment.isloggedinname, rejected);
          this.isLoggedIn$.next(rejected);
          return rejected;
        }
      )
      .catch((error) => {
        this.lss.setitem(environment.isloggedinname, false);
        this.isLoggedIn$.next(false);
        return false;
      });
  }

  logout() {
    this.lss.removeitem(environment.domainnamename);
    this.lss.removeitem(environment.usernamename);
    this.lss.removeitem(environment.isloggedinname);
    this.isLoggedIn$.next(false);
    this.zammadService.logout();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
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
    return this.permissions.caneditticket;
  }

  set caneditticket(value: boolean) {
    this.permissions.caneditticket = value;
  }
}
