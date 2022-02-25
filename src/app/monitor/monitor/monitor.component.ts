import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/classes/article';
import { Kanban_Column } from 'src/app/classes/kanban';
import { Ticket } from 'src/app/classes/ticket';
import { DialogService } from 'src/app/services/dialog.service';
import { ParseService } from 'src/app/services/parse.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent implements OnInit {
  public kanbanstates: Kanban_Column[] = new Array<Kanban_Column>();
  public ticketList: Array<Ticket> = new Array();

  constructor(
    private parseService: ParseService,
    private dialogService: DialogService
  ) {
    this.parseService.getKanbanColumns().then((data) => {
      this.kanbanstates = data;
      console.log(this.kanbanstates);
    });

    this.parseService.getTickets().then((data: Array<Ticket>) => {
      this.ticketList = data;
      console.log(this.ticketList);
    });
  }

  ngOnInit(): void {}

  chagestate(ticket: Ticket, event: any) {
    event.stopPropagation();
    this.dialogService
      .editTicketKanbanState({ ticket: ticket, states: this.kanbanstates })
      .afterClosed()
      .subscribe((result: { ticket: Ticket; description: string }) => {
        this.parseService.updateTicket(result.ticket).then((resultticket) => {
          if (resultticket) {
            let article = new Article();
            article.body = result.description
              ? result.description
              : 'Der Status des Tickets wurde aktualisiert.';
            article.subject = 'Ticket aktualisiert';
            this.parseService
              .postArticle(result.ticket.objectId, article)
              .then((resultarticle) => {
                console.log(resultarticle);
              });
          }
        });
      });
  }
}
