import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ticket } from 'src/app/classes/ticket';
import { ZammadService } from 'src/app/services/zammad.service';

@Component({
  selector: 'app-machinebook',
  templateUrl: './machinebook.component.html',
  styleUrls: ['./machinebook.component.scss'],
})
export class MachinebookComponent implements OnInit {
  machinelist = new Array();
  constructor(private zammadService: ZammadService, private router: Router) {}

  ngOnInit(): void {
    this.zammadService.listTickets().subscribe((tickets: Array<Ticket>) => {
      console.log(tickets);
      tickets.forEach((ticket: Ticket) => {
        this.zammadService
          .listArticlesByTicket(ticket.id)
          .subscribe((articles) => {
            if (this.machinelist.length == 0) {
              this.machinelist.push({
                name: ticket.maintenancegate_workplace[
                  ticket.maintenancegate_workplace.length - 1
                ],
                articles: articles,
              });
            }
            this.machinelist.find((o, i) => {
              let latestworkplace =
                ticket.maintenancegate_workplace[
                  ticket.maintenancegate_workplace.length - 1
                ].label;
              if (o.name.label == latestworkplace) {
                this.machinelist[i].articles.push(articles);
                return true;
              } else {
                if (latestworkplace != 'Sonstiger') {
                  this.machinelist.push({
                    name: latestworkplace,
                    articles: articles,
                  });
                }
                return true;
              }
            });
            console.log(this.machinelist);
          });
      });
    });
  }
}
