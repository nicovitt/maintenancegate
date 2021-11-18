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

    this.parseService.getKanbanColumns().then((data) => {
      console.log(data);
    });

    this.zammadService.listTickets().subscribe((data: Array<any>) => {
      data.forEach((value) => {
        value.maintenancegate_downtime = JSON.parse(
          value.maintenancegate_downtime.replaceAll('=>', ':')
        );
        value.maintenancegate_frequency = JSON.parse(
          value.maintenancegate_frequency.replaceAll('=>', ':')
        );
        value.maintenancegate_priority = JSON.parse(
          value.maintenancegate_priority.replaceAll('=>', ':')
        );
        value.maintenancegate_restriction = JSON.parse(
          value.maintenancegate_restriction.replaceAll('=>', ':')
        );
        value.maintenancegate_workplace = JSON.parse(
          value.maintenancegate_workplace.replaceAll('=>', ':')
        );
      });

      this.ticketList = data;
    });
  }
}
