import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Downtime,
  Frequency,
  Priority,
  Restriction,
  Ticket,
  Workplace,
} from '../classes/ticket';
import { iif, Observable } from 'rxjs';
import { DialogService } from '../services/dialog.service';
import { ParseService } from '../services/parse.service';
import { map, startWith } from 'rxjs/operators';
import { Faultcategory } from '../classes/faultcategory';
import { Workplacecategory } from '../classes/workplacecategory';
import { ProgressbarService } from '../services/progressbar.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { GalleryComponent } from 'ng-gallery';
import { WorkplaceIdToName } from '../helpers/pipes';
import { LocalstorageService } from '../services/localstorage.service';
import { environment } from '../../environments/environment';
import { TicketService } from '../services/ticket.service';
import { getLocaleDateTimeFormat } from '@angular/common';
import { ZammadService } from '../services/zammad.service';
import { User } from '../classes/user';
import { ImageService } from '../services/image.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-createticket',
  templateUrl: './createticket.component.html',
  styleUrls: ['./createticket.component.scss'],
})
export class CreateticketComponent implements OnInit {
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
    private dialogService: DialogService,
    private parseService: ParseService,
    private progressbar: ProgressbarService,
    private pipe_workplaceidtoname: WorkplaceIdToName,
    private lss: LocalstorageService,
    private ticketService: TicketService,
    private zammadService: ZammadService,
    private imageService: ImageService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.progressbar.toggleProgressBar();

    this.formGroup = this._formBuilder.group({
      title: ['Test 1', Validators.required],
      category: ['', Validators.required],
      category2: [''],
      message: ['fmiweomf wf wfwefwfew  \nnjeqw äü'],
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
    let filetype = element.files[0].type; // image/jpeg for example

    reader.readAsDataURL(element.files[0]);
    reader.onloadend = () => {
      const base64String = <string>reader.result;
      let type = this.imageService.calculateFileEnding(
        this.imageService.calculateBase64MimeType(base64String)
      );
      let filebasename = Math.floor(Math.random() * 1000000 + 1);

      this.gallery.addImage({
        src: base64String,
      });

      const base64string = 'base64,';
      let result = <string>reader.result;
      this.ticket.article.attachments.push({
        filename: filebasename + '.' + type,
        data: result.substring(
          result.indexOf(base64string) + base64string.length,
          result.length
        ),
        'mime-type': 'text/plain',
      });
    };
  }

  submitTicket() {
    let now = new Date().toISOString();

    this.zammadService.getCurrentUserDetails().subscribe((data) => {
      const x = data as User;
      this.ticket.group = Object.keys(x.group_ids)[0];
      this.ticket.owner_id = x.id;

      // Construct the ticket.
      this.ticket.created_at = now;
      this.ticket.article.body = this.formGroup.get('message').value;
      this.ticket.article.subject = this.formGroup.get('title').value;

      this.ticket.title = this.formGroup.get('title').value;
      this.ticket.customer = this.lss.getitem(environment.sessionuserlabel);
      this.ticket.maintenancegate_downtime.push(
        new Downtime(
          'downtime_worker_' + now,
          this.formGroup.get('worker_downtime').value
        )
      );
      this.ticket.maintenancegate_frequency.push(
        new Frequency(
          'frequency_worker_' + now,
          this.formGroup.get('worker_frequency').value
        )
      );
      this.ticket.maintenancegate_restriction.push(
        new Restriction(
          'restriction_worker_' + now,
          this.formGroup.get('worker_restriction').value
        )
      );
      this.ticket.maintenancegate_workplace.push(
        new Workplace(
          'workpalce_worker_' + now,
          this.formGroup.get('workplace').value
        )
      );
      this.ticket.maintenancegate_priority.push(
        new Priority(
          'worker_priority_' + now,
          this.ticketService.calculatepriority(
            this.formGroup.get('worker_downtime').value,
            this.formGroup.get('worker_frequency').value,
            this.formGroup.get('worker_restriction').value
          )
        )
      );

      this.zammadService.postTicket(this.ticket).subscribe(
        (response: HttpResponse<Ticket>) => {
          if (response.status == 201) {
            let dialogRef = this.dialogService.presentConfirmation$({
              header: 'ticketCreateSuccess',
              title:
                'Ticket "' + response.body.title + '" erfolgreich erstellt.',
              message:
                'Das Ticket wurde versendet und ist bei der Instandhaltung eingetroffen. Sie werden informiert.',
            });

            dialogRef.afterClosed().subscribe((result) => {
              this.router.navigate(['/dashboard']);
            });
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
    });
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

    let workplace: Workplacecategory = this.pipe_workplaceidtoname.transform(
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
