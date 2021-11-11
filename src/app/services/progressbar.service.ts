import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Instructions on how to listen for variable changes in the components view: https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/
 */
@Injectable({
  providedIn: 'root',
})
export class ProgressbarService {
  public showprogressbar: boolean = false;
  private stateSource = new BehaviorSubject(false);
  currentState = this.stateSource.asObservable();

  constructor() {}

  /**
   * @description Inverts the state of the progressbar (on or off).
   */
  toggleProgressBar() {
    this.showprogressbar = !this.showprogressbar;
    this.stateSource.next(this.showprogressbar);
  }

  /**
   * @description If you want to know the state (on or off) of the progressbar call this function.
   * @returns The state of the prograssbar.
   */
  getshowprogressbar() {
    return this.showprogressbar;
  }
}
