import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FancyprogressbarService {
  private animationSource = new BehaviorSubject(0);
  animationState = this.animationSource.asObservable();

  public kanbanready: boolean = false;
  private kanbanSource = new BehaviorSubject(false);
  kanbanState = this.kanbanSource.asObservable();

  constructor() {}

  /**
   * @description animates the progressbar according to the individual kanban states.
   * @param state_of_ticket
   */
  animateFancyProgressbar(state_of_ticket: number) {
    this.animationSource.next(state_of_ticket);
  }

  // TODO: Perhaps this has to be checked in viewcomponent of whether it finished to anmate the progressbar afterwards?!
  /**
   * @description Changes the state of whether the data is collected from parse server and ready in component.
   */
  changeKanbanState() {
    this.kanbanready = !this.kanbanready;
    this.kanbanSource.next(this.kanbanready);
  }
}
