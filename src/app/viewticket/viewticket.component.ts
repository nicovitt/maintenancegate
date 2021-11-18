import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, PlainArticlePost } from '../classes/article';
import {
  Downtime,
  Frequency,
  Generictabledata,
  Priority,
  Restriction,
  Ticket,
  Workplace,
} from '../classes/ticket';
import { DialogService } from '../services/dialog.service';
import { FancyprogressbarService } from '../services/fancyprogressbar.service';
import { ProgressbarService } from '../services/progressbar.service';
import { SnackbarService } from '../services/snackbar.service';
import { UserpermissionsService } from '../services/userpermissions.service';
import { ZammadService } from '../services/zammad.service';

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
  public newArticle: PlainArticlePost = new PlainArticlePost();
  public articlesstep: number = 0;
  @ViewChild(MatTable) table: MatTable<Generictabledata>;

  constructor(
    private zammadService: ZammadService,
    private route: ActivatedRoute,
    public progressbar: ProgressbarService,
    private snackbarService: SnackbarService,
    private fancyprogressbarService: FancyprogressbarService,
    public userpermissions: UserpermissionsService,
    private router: Router,
    private datePipe: DatePipe,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.progressbar.toggleProgressBar();
    this.route.params.subscribe((params) => {
      this.zammadService.showTicket(params['id']).subscribe(
        (ticket: Ticket) => {
          new Array<Downtime | Frequency | Priority | Restriction | Workplace>()
            .concat(
              ticket.maintenancegate_downtime,
              ticket.maintenancegate_frequency,
              ticket.maintenancegate_restriction,
              ticket.maintenancegate_workplace
            )
            .map((entry) => {
              this.dataSource.push(new Generictabledata(entry));
              this.table.renderRows();
            });
          this.ticket = ticket;

          this.fancyprogressbarService.animateFancyProgressbar(
            this.ticket.maintenancegate_kanban_state
          );

          this.zammadService
            .listArticlesByTicket(params['id'])
            .subscribe((articles: any) => {
              this.articles = articles;
              this.progressbar.toggleProgressBar();
            });
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

  copyArticleToClipboard(articleid: number, event: Event) {
    event.stopPropagation();
    let article: Article = this.articles.find(
      (article) => article.id == articleid
    );
    let copyText =
      article.from +
      ' am ' +
      this.datePipe.transform(article.created_at, 'dd.MM.yyyy HH:mm') +
      '\n\n' +
      article.body;

    navigator.clipboard.writeText(copyText).then(
      () => {
        this.snackbarService.opensnackbar(
          'Aktuelle Nachricht in die Zwischenablage kopiert.',
          ''
        );
      },
      () => {
        this.snackbarService.opensnackbar(
          'Text in Zwischenablage kopieren fehlgeschlagen!',
          ''
        );
      }
    );
  }

  editTicket() {
    let dialog = this.dialogService.editTicket(this.ticket);
  }

  saveChanges() {}

  saveNewArticle() {
    if (this.newArticle.body == '') {
      return;
    }
    this.newArticle.ticket_id = this.ticket.id;
    this.zammadService.createPlainArticle(this.newArticle).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status == 201) {
          let newarticle = new Article();
          newarticle.body = response.body.body;
          newarticle.created_at = response.body.created_at;
          newarticle.from = response.body.from;
          newarticle.id = response.body.id;
          newarticle.subject = response.body.subject;
          this.newArticle.body = '';
          this.articles.push(newarticle);
          this.snackbarService.opensnackbar('Neue Notiz hinzugefügt.', '');
        } else {
          this.snackbarService.opensnackbar(
            'Entschuldigung: Die Nachricht konnte nicht gespeichert werden.',
            ''
          );
        }
      },
      (error) => {
        this.snackbarService.opensnackbar(
          'Entschuldigung: Es ist ein Fehler beim Übertragen der Nachricht aufgetreten.',
          ''
        );
      }
    );
  }

  // TODO: Implement change-detection
  trackArticleChange(index: number, item: Article) {
    return item.id;
  }

  isSliderValue(element: Generictabledata) {
    return ['_frequency', '_downtime'].some((searchstring) =>
      element.label.includes(searchstring)
    );
  }
}
