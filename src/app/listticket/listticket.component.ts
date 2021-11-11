import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ticket } from '../classes/ticket';
import { ZammadService } from '../services/zammad.service';

@Component({
  selector: 'app-listticket',
  templateUrl: './listticket.component.html',
  styleUrls: ['./listticket.component.scss'],
})
export class ListticketComponent implements OnInit {
  constructor(private zammadService: ZammadService, private router: Router) {}

  public ticketList: Array<Ticket> = [];

  ngOnInit(): void {
    // Check if already logged in then redirect
    this.zammadService.checkSession().then(
      (value) => {
        if (value) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      (rejected) => {
        this.router.navigate(['/login']);
      }
    );

    this.zammadService.listTickets().subscribe((data: Array<Ticket>) => {
      console.log(data);
      this.ticketList = data;
    });
  }
}
