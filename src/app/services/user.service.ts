import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Permissions } from '../classes/permissions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private _username: string = 'Benutzer';
  private permissions = new Permissions();

  constructor() {}

  logout() {
    this.isLoggedIn$.next(false);
  }

  login() {
    this.isLoggedIn$.next(true);
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

  get caneditticket() {
    return this.permissions.caneditticket;
  }

  set caneditticket(value: boolean) {
    this.permissions.caneditticket = value;
  }

  get caneditschedule() {
    return this.permissions.caneditschedule;
  }

  set caneditschedule(value: boolean) {
    this.permissions.caneditschedule = value;
  }
}
