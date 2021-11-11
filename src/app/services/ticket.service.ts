import { Injectable } from '@angular/core';
import { Ticket } from '../classes/ticket';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor() {}

  calculatepriority(
    downtime: number,
    frequency: number,
    restriction: number
  ): number {
    let calculatedpriority = (downtime + frequency) * restriction;

    //Now get the percentage of the calculatedpriority while 0 = 0% and 600 = 100%
    calculatedpriority = (calculatedpriority / 600) * 100;

    if (calculatedpriority < 10) {
      calculatedpriority = 10;
    }
    if (calculatedpriority > 70) {
      calculatedpriority = 70;
    }
    return Math.round(calculatedpriority);
  }
}
