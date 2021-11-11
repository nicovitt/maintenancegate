import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor() {}

  /**
   *
   * @param itemname
   * @param item
   */
  setitem(itemname: string, item: any) {
    localStorage.setItem(itemname, item);
  }

  getitem(itemname: string) {
    return localStorage.getItem(itemname);
  }

  removeitem(itemname: string) {
    localStorage.removeItem(itemname);
  }

  clearstorage() {
    localStorage.clear();
  }
}
