import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket } from '../classes/ticket';
import { Observable } from 'rxjs';
import { ParseService } from '../services/parse.service';
import { map, startWith } from 'rxjs/operators';
import { Faultcategory } from '../classes/faultcategory';
import { Workplacecategory } from '../classes/workplacecategory';
import { ProgressbarService } from '../services/progressbar.service';
import { GalleryComponent } from 'ng-gallery';
import { ImageService } from '../services/image.service';
import { WorkplaceTitleToName } from '../helpers/pipes/pipes';
import { TicketService } from '../services/ticket.service';
import { Router } from '@angular/router';
import { DialogService } from '../services/dialog.service';
import { Article } from '../classes/article';

@Component({
  selector: 'app-createticket',
  templateUrl: './createticket.component.html',
  styleUrls: ['./createticket.component.scss'],
})
export class CreateticketComponent implements OnInit {
  public _faultcategoryotherlabel = 'Sonstiger';
  public _workplaceotherlabel = 'Sonstiger';

  @ViewChild('categorieformcontrol', { static: true })
  categorieformcontrol!: NgModel;
  @ViewChild(GalleryComponent) gallery: GalleryComponent;

  public videoCapable = true;
  public pictureTaken = false;
  public downloadLink: string;
  public ticket: Ticket = new Ticket();

  // START FormControl
  public formGroup: FormGroup;
  // END FormControl

  // START Fault categories
  public Faultcategories: Array<Faultcategory> = [];
  public filteredFaultcategories: Observable<Faultcategory[]>;
  // END Fault Categories

  // START Workplace
  public Workplacecategories: Array<Workplacecategory> = [];
  public filteredWorkplacecategories: Observable<Workplacecategory[]>;
  // END Workplace

  constructor(
    private _formBuilder: FormBuilder,
    private parseService: ParseService,
    private progressbar: ProgressbarService,
    private imageService: ImageService,
    private ticketService: TicketService,
    private dialogService: DialogService,
    private router: Router,
    private pipe_workplacetitletoname: WorkplaceTitleToName
  ) {}

  async ngOnInit() {
    this.progressbar.toggleProgressBar();
    this.ticket.article.push(new Article());

    this.formGroup = this._formBuilder.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      category2: [''],
      message: [''],
      workplace: ['', Validators.required],
      workplace2: [''],
      photos: ['', Validators.required],
      audios: [''],
      worker_downtime: ['0', Validators.required],
      worker_frequency: ['0', Validators.required],
      worker_restriction: ['1', Validators.required],
    });

    this.parseService.getFaultCategories().then(
      (value) => {
        this.Faultcategories = value;

        this.filteredFaultcategories = this.formGroup
          .get('category')!
          .valueChanges.pipe(
            startWith(''),
            map((value) => this._filterFault(value))
          );

        // Turn off the progressbar if still visible
        if (this.progressbar.getshowprogressbar()) {
          this.progressbar.toggleProgressBar();
        }
      },
      (rejected) => {
        console.log('Cannot get fault categories from parse.');
        console.log(rejected);
      }
    );

    this.parseService.getWorkplaceCategories().then(
      (value) => {
        this.Workplacecategories = value;

        this.filteredWorkplacecategories = this.formGroup
          .get('workplace')!
          .valueChanges.pipe(
            startWith(''),
            map((value) => this._filterWorkplace(value))
          );

        // Turn off the progressbar if still visible
        if (this.progressbar.getshowprogressbar()) {
          this.progressbar.toggleProgressBar();
        }
      },
      (rejected) => {
        console.log('Cannot get workplace categories from parse.');
        console.log(rejected);
      }
    );
  }

  onClickCamera(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const reader = new FileReader();

    reader.readAsDataURL(element.files[0]);
    reader.onloadend = () => {
      const base64String = <string>reader.result;
      let type = this.imageService.calculateFileEndingFromMimeType(
        this.imageService.calculateBase64MimeType(base64String)
      );
      let filebasename = Math.floor(Math.random() * 1000000 + 1);

      this.gallery.addImage({
        src: base64String,
      });

      const base64string = 'base64,';
      let result = <string>reader.result;
      this.ticket.article[0].images.push({
        id: 0,
        filename: filebasename + '.' + type,
        data: result.substring(
          result.indexOf(base64string) + base64string.length,
          result.length
        ),
        mimetype: 'text/plain',
      });
    };
  }

  submitTicket() {
    let now = new Date().toISOString();

    // this.ticket.group = Object.keys(x.group_ids)[0];
    this.ticket.owner = this.parseService.getCurrentUser();
    // Construct the ticket.
    this.ticket.created_at = now;
    this.ticket.article[0].body = this.formGroup.get('message').value;
    this.ticket.article[0].subject = this.formGroup.get('title').value;
    this.ticket.title = this.formGroup.get('title').value;
    // this.ticket.customer = this.lss.getitem(environment.sessionuserlabel);
    this.ticket.downtime.push({
      label: 'worker_downtime',
      value: this.formGroup.get('worker_downtime').value,
      date: now,
    });
    this.ticket.frequency.push({
      label: 'worker_frequency',
      value: this.formGroup.get('worker_frequency').value,
      date: now,
    });
    this.ticket.restriction.push({
      label: 'worker_restriction',
      value: this.formGroup.get('worker_restriction').value,
      date: now,
    });
    this.ticket.workplace.push({
      label: 'worker_workplace',
      value:
        this.formGroup.get('workplace').value == this._workplaceotherlabel
          ? this.formGroup.get('workplace2').value
          : this.formGroup.get('workplace').value,
      date: now,
    });
    this.ticket.faultcategory.push({
      label: 'worker_faultcategory',
      value:
        this.formGroup.get('category').value == this._faultcategoryotherlabel
          ? this.formGroup.get('category2').value
          : this.formGroup.get('category').value,
      date: now,
    });
    this.ticket.priority.push({
      label: 'worker_priority',
      value: this.ticketService.calculatepriority(
        this.formGroup.get('worker_downtime').value,
        this.formGroup.get('worker_frequency').value,
        this.formGroup.get('worker_restriction').value
      ),
      date: now,
    });
    // Send the ticket to parse
    this.parseService.postTicket(this.ticket).then(
      (response: boolean) => {
        if (response) {
          let dialogRef = this.dialogService.presentConfirmation$({
            header: 'ticketCreateSuccess',
            title: 'Ticket erfolgreich erstellt.',
            message:
              'Das Ticket wurde versendet und ist bei der Instandhaltung eingetroffen. Sie werden informiert.',
          });
          dialogRef.afterClosed().subscribe((result) => {
            this.router.navigate(['/dashboard']);
          });
        } else {
          let dialogRef = this.dialogService.presentConfirmation$({
            header: 'ticketCreateError',
            title: 'Es ist ein Fehler aufgetreten.',
            message:
              'Entschuldigung, aber es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder zu einem späteren Zeitpunkt nochmal.',
          });
          dialogRef.afterClosed().subscribe((result) => {});
        }
      },
      (error) => {
        let dialogRef = this.dialogService.presentError$({
          header: 'ticketCreateError',
          title: 'Es ist ein Fehler aufgetreten.',
          message:
            'Entschuldigung, aber es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder zu einem späteren Zeitpunkt nochmal.',
        });
        dialogRef.afterClosed().subscribe((result) => {});
      }
    );
  }

  private _filterFault(value: string): Faultcategory[] {
    if (value) {
      return this.Faultcategories.map((fault) => ({
        id: fault.id,
        title: fault.title,
        selectable: fault.selectable,
        subCategories: _filterSubCategories(fault.subCategories, value),
      })).filter((fault) => fault.title.length > 0);
    }

    return this.Faultcategories;
  }

  private _filterWorkplace(value: number): Workplacecategory[] {
    if (!value) return this.Workplacecategories;

    let workplace: Workplacecategory = this.pipe_workplacetitletoname.transform(
      value,
      this.Workplacecategories
    );

    if (!workplace) return this.Workplacecategories;

    const filterValue = workplace.title.toLowerCase();
    return this.Workplacecategories.filter(
      (option) =>
        option.title.toLowerCase().includes(filterValue) ||
        option.description.toLowerCase().includes(filterValue)
    );
  }
}

export const _filterSubCategories = (
  subcats: Faultcategory[],
  value: string
): Faultcategory[] => {
  const filterValue = value.toLowerCase();
  return subcats.filter((item) =>
    item.title.toLowerCase().includes(filterValue)
  );
};
