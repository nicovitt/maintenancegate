import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ticket } from 'src/app/classes/ticket';
import { ParseService } from 'src/app/services/parse.service';

@Component({
  selector: 'app-machinebook',
  templateUrl: './machinebook.component.html',
  styleUrls: ['./machinebook.component.scss'],
})
export class MachinebookComponent implements OnInit {
  public machinelist = new Array();

  constructor(private parseService: ParseService, private router: Router) {}

  ngOnInit(): void {
    this.parseService
      .getTicketsWithArticles()
      .then((tickets: Array<Ticket>) => {
        tickets.forEach((ticket: Ticket) => {
          if (this.machinelist.length == 0) {
            this.machinelist.push({
              name: ticket.workplace[ticket.workplace.length - 1],
              articles: ticket.article,
            });
          }
          this.machinelist.find((o, i) => {
            let latestworkplace =
              ticket.workplace[ticket.workplace.length - 1].label;
            if (o.name.label == latestworkplace) {
              this.machinelist[i].articles.push(ticket.article);
              return true;
            } else {
              if (latestworkplace != 'Sonstiger') {
                this.machinelist.push({
                  name: latestworkplace,
                  articles: ticket.article,
                });
              }
              return true;
            }
          });
          console.log(this.machinelist);
        });
      });
  }
}
