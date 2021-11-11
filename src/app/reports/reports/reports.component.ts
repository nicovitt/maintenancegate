import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services/auth.service';
import { OtrsService } from 'src/app/services/otrs.service';
import { OtrsticketsService } from 'src/app/services/otrstickets.service';
import { otrs_Ticket } from '../../classes/otrsclasses';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  public ticketList: Array<otrs_Ticket>;
  public machinelist = new Array();
  private dummytickets: Array<otrs_Ticket>;
  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Look these up
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320], // Look these up
        type: 'bar',
      },
    ],
  };

  constructor(
    private otrsService: OtrsService,
    private otrsticketService: OtrsticketsService,
    private authService: AuthService
  ) {
    this.dummytickets = new Array<otrs_Ticket>();
    this.ticketList = this.otrsticketService.allTickets; // either empty or filled when navigating back from another view. This way, scrollTop can be set properly to the last position.
  }
  ngOnInit(): void {
    // Get tickets from ticket system
    // super.toggleProgressBar();

    this.authService.logIn('ronnyglienke', 'ronnyarthurbraeuer').then(() => {
      //Get all the tickets.
      this.otrsticketService
        .getTickets()
        .then((allTickets) => {
          allTickets.forEach((newticket) => {
            if (this.machinelist.length == 0) {
              this.machinelist.push({
                name: newticket.workplace,
                articles: newticket.ticketArticles,
              });
            }
            this.machinelist.find((o, i) => {
              if (o.name == newticket.workplace) {
                this.machinelist[i].articles.push(newticket.ticketArticles);
                return true;
              } else {
                if (newticket.workplace != 'Sonstiger') {
                  this.machinelist.push({
                    name: newticket.workplace,
                    articles: newticket.ticketArticles,
                  });
                }
                return true;
              }
            });

            // if (newticket.state == otrs_Ticketstate.draft) {
            //   this.dummytickets.push(newticket);
            // } else {
            //   this.ticketList = this.otrsticketService.allTickets;
            // }
          });
          // super.toggleProgressBar();
        })
        .catch((error: Error) => {
          console.log(error.message);
          // super.toggleProgressBar();
        });
    });

    //Apply the filters from the menu
    // this.filterbridgeService.currentFilter.subscribe((filter) => {
    //   this.filter = filter;
    //   this.applyFilter();
    // });
  }
}
