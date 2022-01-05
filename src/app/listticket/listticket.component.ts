import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ticket } from '../classes/ticket';
import { ParseService } from '../services/parse.service';
import { ZammadService } from '../services/zammad.service';

@Component({
  selector: 'app-listticket',
  templateUrl: './listticket.component.html',
  styleUrls: ['./listticket.component.scss'],
})
export class ListticketComponent implements OnInit {
  constructor(
    private zammadService: ZammadService,
    private router: Router,
    private parseService: ParseService
  ) {}

  public ticketList: Array<Ticket> = new Array();

  ngOnInit(): void {
    this.parseService.getKanbanColumns().then((data) => {
      // console.log(data);
    });

    this.parseService.getTickets().then((data: Array<Ticket>) => {
      this.ticketList = data;
      console.log(this.ticketList);
    });
  }
}
