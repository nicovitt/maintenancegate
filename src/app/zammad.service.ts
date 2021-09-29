import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Ticket } from './classes/ticket';

@Injectable({
  providedIn: 'root',
})
export class ZammadService {
  constructor(private http: HttpClient) {}

  postTicket(ticket: Ticket) {
    return this.http.post<Ticket>(
      'https://zammad-1.zentrum-digitalisierung.de/api/v1/tickets',
      ticket
    );
  }
}
