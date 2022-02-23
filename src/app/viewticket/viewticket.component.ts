import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Moment } from 'moment';
import { Article } from '../classes/article';
import {
  Downtime,
  Frequency,
  Generictabledata,
  Priority,
  Restriction,
  Ticket,
  Workplace,
} from '../classes/ticket';
import { Workplacecategory } from '../classes/workplacecategory';
import { DialogService } from '../services/dialog.service';
import { FancyprogressbarService } from '../services/fancyprogressbar.service';
import { ParseService } from '../services/parse.service';
import { ProgressbarService } from '../services/progressbar.service';
import { SnackbarService } from '../services/snackbar.service';
import { TicketService } from '../services/ticket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-viewticket',
  templateUrl: './viewticket.component.html',
  styleUrls: ['./viewticket.component.scss'],
})
export class ViewticketComponent implements OnInit {
  public ticket: Ticket = new Ticket();
  public articles: Array<Article> = new Array<Article>();
  public displayedColumns: string[] = ['label', 'value', 'date'];
  public dataSource: Generictabledata[] = [];
  public newArticle: Article = new Article();
  public articlesstep: number = 0;
  public Workplacecategories: Array<Workplacecategory> = [];
  public workplacesareloaded = false;
  @ViewChild(MatTable) table: MatTable<Generictabledata>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    public progressbar: ProgressbarService,
    private snackbarService: SnackbarService,
    private fancyprogressbarService: FancyprogressbarService,
    private router: Router,
    private datePipe: DatePipe,
    private dialogService: DialogService,
    private ticketService: TicketService,
    private parseService: ParseService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.progressbar.toggleProgressBar();

    this.parseService.getWorkplaceCategories().then((response) => {
      this.Workplacecategories = response;
      this.workplacesareloaded = true;
    });

    this.route.params.subscribe((params) => {
      this.parseService.getTicketWithArticle(params['id']).then(
        (ticket: Ticket) => {
          new Array<Downtime | Frequency | Priority | Restriction | Workplace>()
            .concat(
              ticket.downtime,
              ticket.frequency,
              ticket.restriction,
              ticket.workplace
            )
            .map((entry) => {
              this.dataSource.push(new Generictabledata(entry));
              this.dataSource.sort((firstelem, secondelem) => {
                if (new Date(firstelem.date) > new Date(secondelem.date)) {
                  return -1;
                }
                if (new Date(firstelem.date) < new Date(secondelem.date)) {
                  return 1;
                }
                return 0;
              });
              this.table.renderRows();
            });

          this.articles = ticket.article;
          this.ticket = ticket;

          this.fancyprogressbarService.animateFancyProgressbar(
            this.ticket.kanban_state
          );

          this.progressbar.toggleProgressBar();
        },
        (error) => {
          this.progressbar.getshowprogressbar
            ? this.progressbar.toggleProgressBar()
            : '';
          this.router.navigate(['/dashboard']);
        }
      );
    });
  }

  setArticlesStep(index: number) {
    this.articlesstep = index;
  }

  nextArticlesStep() {
    this.articlesstep++;
  }

  prevArticlesStep() {
    this.articlesstep--;
  }

  copyArticleToClipboard(articleid: string, event: Event) {
    event.stopPropagation();
    let article: Article = this.articles.find(
      (article) => article.id == articleid
    );
    let copyText =
      article.author +
      ' am ' +
      this.datePipe.transform(article.created_at, 'dd.MM.yyyy HH:mm') +
      '\n\n' +
      article.body;

    navigator.clipboard.writeText(copyText).then(
      () => {
        this.snackbarService.opensnackbar(
          'Aktuelle Nachricht in die Zwischenablage kopiert.',
          '',
          30000
        );
      },
      () => {
        this.snackbarService.opensnackbar(
          'Text in Zwischenablage kopieren fehlgeschlagen!',
          '',
          30000
        );
      }
    );
  }

  editTicket() {
    let dialogRef = this.dialogService.editTicket(this.ticket);
    dialogRef.afterClosed().subscribe((result: Ticket | Error) => {
      if (result instanceof Error) {
        console.log(result.message);
        return;
      }

      const now = new Date().toISOString();
      let article = new Article();
      article.subject = 'Ticket geändert.';

      if (this.ticket.title !== result.title) {
        this.ticket.title = result.title;
      }

      if (
        this.ticket.faultcategory[this.ticket.faultcategory.length - 1]
          .value !== result.faultcategory[0].value
      ) {
        article.body +=
          'Störgrund geändert von ' +
          this.ticket.faultcategory[this.ticket.faultcategory.length - 1]
            .value +
          ' nach ' +
          result.faultcategory[0].value +
          '\n';
        this.ticket.faultcategory.push(result.faultcategory[0]);
      }

      if (
        this.ticket.workplace[this.ticket.workplace.length - 1].value !==
        result.workplace[0].value
      ) {
        article.body +=
          'Arbeitsplatz geändert von ' +
          this.ticket.workplace[this.ticket.workplace.length - 1].value +
          ' nach ' +
          result.workplace[0].value +
          '\n';
        this.ticket.workplace.push(result.workplace[0]);
      }

      if (
        this.ticket.downtime[this.ticket.downtime.length - 1].value !==
        result.downtime[0].value
      ) {
        article.body +=
          'Ausfallzeit geändert von ' +
          this.ticket.downtime[this.ticket.downtime.length - 1].value +
          ' nach ' +
          result.downtime[0].value +
          '\n';
        this.ticket.downtime.push(result.downtime[0]);
      }

      if (
        this.ticket.frequency[this.ticket.frequency.length - 1].value !==
        result.frequency[0].value
      ) {
        article.body +=
          'Häufigkeit geändert von ' +
          this.ticket.frequency[this.ticket.frequency.length - 1].value +
          ' nach ' +
          result.frequency[0].value +
          '\n';
        this.ticket.frequency.push(result.frequency[0]);
      }

      if (
        this.ticket.restriction[this.ticket.restriction.length - 1].value !==
        result.restriction[0].value
      ) {
        article.body +=
          'Einschränkung geändert von ' +
          this.ticket.restriction[this.ticket.restriction.length - 1].value +
          ' nach ' +
          result.restriction[0].value +
          '\n';
        this.ticket.restriction.push(result.restriction[0]);
      }

      if (
        result.duedate.length > 0 &&
        (this.ticket.duedate[this.ticket.duedate.length - 1].start !==
          result.duedate[0].start ||
          this.ticket.duedate[this.ticket.duedate.length - 1].end !==
            result.duedate[0].end)
      ) {
        article.body +=
          'Fälligkeitsdatum geändert von ' +
          this.datePipe.transform(
            this.ticket.duedate[this.ticket.duedate.length - 1].start,
            'dd.MM.yyyy HH:mm'
          ) +
          ' - ' +
          this.datePipe.transform(
            this.ticket.duedate[this.ticket.duedate.length - 1].end,
            'dd.MM.yyyy HH:mm'
          ) +
          ' nach ' +
          this.datePipe.transform(result.duedate[0].start, 'dd.MM.yyyy HH:mm') +
          ' - ' +
          this.datePipe.transform(result.duedate[0].end, 'dd.MM.yyyy HH:mm') +
          '\n';
        this.ticket.duedate.push(result.duedate[0]);
      }

      // Check whether the priority has to be recalculated.
      if (
        result.priority[0].value !==
        this.ticket.priority[this.ticket.priority.length - 1].value
      ) {
        article.body +=
          'Priorität geändert von ' +
          this.ticket.priority[this.ticket.priority.length - 1].value +
          ' nach ' +
          result.priority[0].value +
          '\n';
        this.ticket.priority.push({
          label: 'maintenance_priority',
          value: this.ticketService.calculatepriority(
            result.downtime[0].value,
            result.frequency[0].value,
            result.restriction[0].value
          ),
          date: now,
        });
      }

      this.ticket.article.push(article);

      if (article.body.length > 0) {
        this.parseService.updateTicket(this.ticket).then(
          (response) => {
            if (response) {
              let dialogRef = this.dialogService.presentConfirmation$({
                header: 'ticketUpdateSuccess',
                title: 'Ticket erfolgreich aktualisiert.',
                message: 'Das Ticket wurde erfolgreich aktualisiert.',
              });

              dialogRef.afterClosed().subscribe((result) => {});
            } else {
              console.log(response);
            }
          },
          (error) => {
            let dialogRef = this.dialogService.presentError$({
              header: 'ticketUpdateError',
              title: 'Es ist ein Fehler aufgetreten.',
              message:
                'Entschuldigung, aber es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder zu einem späteren Zeitpunkt nochmal.',
            });

            dialogRef.afterClosed().subscribe((result) => {});
          }
        );
      } else {
        let dialogRef = this.dialogService.presentConfirmation$({
          header: 'ticketUpdateNotNecessary',
          title: 'Nichts zu tun...',
          message: 'Keine Änderungen zum Speichern da.',
        });
      }
    });
  }

  saveNewArticle() {
    if (this.newArticle.body == '') {
      return;
    }

    this.parseService.postArticle(this.ticket.objectId, this.newArticle).then(
      (response: Parse.Object) => {
        let newarticle = new Article();
        newarticle.body = response.get('body');
        newarticle.created_at = response.get('created_at');
        newarticle.author = response.get('author');
        newarticle.id = response.get('objectId');
        newarticle.subject = response.get('subject');
        this.articles.push(newarticle);
        this.newArticle.body = '';
        this.snackbarService.opensnackbar('Neue Notiz hinzugefügt.', '', 30000);
      },
      (error) => {
        this.snackbarService.opensnackbar(
          'Entschuldigung: Es ist ein Fehler beim Übertragen der Nachricht aufgetreten.',
          '',
          30000
        );
      }
    );
  }

  // TODO: Implement change-detection
  trackArticleChange(index: number, item: Article) {
    return item.id;
  }

  isDowntimeValue(element: Generictabledata) {
    return ['_downtime'].some((searchstring) =>
      element.label.includes(searchstring)
    );
  }

  isFrequencyValue(element: Generictabledata) {
    return ['_frequency'].some((searchstring) =>
      element.label.includes(searchstring)
    );
  }

  isRestrictionValue(element: Generictabledata) {
    return ['_restriction'].some((searchstring) =>
      element.label.includes(searchstring)
    );
  }

  isWorkplaceValue(element: Generictabledata) {
    return ['_workplace'].some((searchstring) =>
      element.label.includes(searchstring)
    );
  }
}
