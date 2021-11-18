import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import { ZammadService } from './zammad.service';

@Injectable({
  providedIn: 'root',
})
export class UserpermissionsService {
  private _caneditticket: boolean = false;

  constructor(private zammadService: ZammadService) {
    this.zammadService.getCurrentUserDetails().subscribe((data) => {
      const x = data as User;
      if (x.role_ids.includes(4)) {
        this.caneditticket = true;
      }
    });
  }

  get caneditticket() {
    return this._caneditticket;
  }

  set caneditticket(value: boolean) {
    this._caneditticket = value;
  }
}
