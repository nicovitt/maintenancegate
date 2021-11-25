import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  NgModel,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Moment } from 'moment';
import { GalleryComponent } from 'ng-gallery';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Faultcategory } from 'src/app/classes/faultcategory';
import { Ticket } from 'src/app/classes/ticket';
import { Workplacecategory } from 'src/app/classes/workplacecategory';
import { ParseService } from 'src/app/services/parse.service';
import { TicketService } from 'src/app/services/ticket.service';
import { WorkplaceIdToName } from '../../pipes/pipes';

@Component({
  selector: 'app-edit-ticket-dialog',
  templateUrl: './edit-ticket-dialog.component.html',
  styleUrls: ['./edit-ticket-dialog.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class EditTicketDialogComponent implements OnInit {
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
  public dialogformGroup: FormGroup;
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
    public dialogRef: MatDialogRef<EditTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ticket,
    private _formBuilder: FormBuilder,
    private parseService: ParseService,
    private pipe_workplaceidtoname: WorkplaceIdToName,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.dialogformGroup = this._formBuilder.group({
      title: [this.data.title, Validators.required],
      category: [
        this.data.maintenancegate_faultcategory[
          this.data.maintenancegate_faultcategory.length - 1
        ].value,
        Validators.required,
      ],
      category2: [''],
      workplace: [
        this.data.maintenancegate_workplace[
          this.data.maintenancegate_workplace.length - 1
        ].value,
        Validators.required,
      ],
      workplace2: [''],
      photos: ['', Validators.required],
      audios: [''],
      downtime: [
        this.data.maintenancegate_downtime[
          this.data.maintenancegate_downtime.length - 1
        ].value,
        Validators.required,
      ],
      frequency: [
        this.data.maintenancegate_frequency[
          this.data.maintenancegate_frequency.length - 1
        ].value,
        Validators.required,
      ],
      restriction: [
        this.data.maintenancegate_restriction[
          this.data.maintenancegate_restriction.length - 1
        ].value,
        Validators.required,
      ],
      start: [
        new Date(
          this.data.maintenancegate_duedate[
            this.data.maintenancegate_duedate.length - 1
          ].start
        ),
      ],
      end: [
        new Date(
          this.data.maintenancegate_duedate[
            this.data.maintenancegate_duedate.length - 1
          ].end
        ),
      ],
    });

    this.parseService.getFaultCategories().then(
      (value) => {
        this.Faultcategories = value;

        this.filteredFaultcategories = this.dialogformGroup
          .get('category')!
          .valueChanges.pipe(
            startWith(''),
            map((value) => this._filterFault(value))
          );
      },
      (rejected) => {
        console.log('Cannot get fault categories from parse.');
        console.log(rejected);
      }
    );

    this.parseService.getWorkplaceCategories().then(
      (value) => {
        this.Workplacecategories = value;

        this.filteredWorkplacecategories = this.dialogformGroup
          .get('workplace')!
          .valueChanges.pipe(
            startWith(''),
            map((value) => this._filterWorkplace(value))
          );
      },
      (rejected) => {
        console.log('Cannot get workplace categories from parse.');
        console.log(rejected);
      }
    );
  }

  submitChanges() {
    const now = new Date().toISOString();

    this.ticket.title = this.dialogformGroup.get('title').value;

    this.ticket.maintenancegate_faultcategory.push({
      label: 'maintenance_faultcategory',
      value:
        this.dialogformGroup.get('category').value ==
        this._faultcategoryotherlabel
          ? this.dialogformGroup.get('category2').value
          : this.dialogformGroup.get('category').value,
      date: now,
    });

    this.ticket.maintenancegate_workplace.push({
      label: 'maintenance_workplace',
      value:
        this.dialogformGroup.get('workplace').value == this._workplaceotherlabel
          ? this.dialogformGroup.get('workplace2').value
          : this.dialogformGroup.get('workplace').value,
      date: now,
    });

    this.ticket.maintenancegate_downtime.push({
      label: 'maintenance_downtime',
      value: this.dialogformGroup.get('downtime').value,
      date: now,
    });

    this.ticket.maintenancegate_frequency.push({
      label: 'maintenance_frequency',
      value: this.dialogformGroup.get('frequency').value,
      date: now,
    });

    this.ticket.maintenancegate_restriction.push({
      label: 'maintenance_restriction',
      value: this.dialogformGroup.get('restriction').value,
      date: now,
    });

    if (this.dialogformGroup.get('start').value) {
      this.ticket.maintenancegate_duedate.push({
        label: 'maintenance_duedate',
        start: (
          this.dialogformGroup.get('start').value as Moment
        ).toISOString(),
        end: (this.dialogformGroup.get('end').value as Moment).toISOString(),
        date: now,
      });
    }

    this.ticket.maintenancegate_priority.push({
      label: 'maintenance_priority',
      value: this.ticketService.calculatepriority(
        this.ticket.maintenancegate_downtime[
          this.ticket.maintenancegate_downtime.length - 1
        ].value,
        this.ticket.maintenancegate_frequency[
          this.ticket.maintenancegate_frequency.length - 1
        ].value,
        this.ticket.maintenancegate_restriction[
          this.ticket.maintenancegate_restriction.length - 1
        ].value
      ),
      date: now,
    });

    this.dialogRef.close(this.ticket);
  }

  onCloseClick() {
    this.dialogRef.close(new Error('Ticket-bearbeiten-Dialog geschlossen.'));
  }

  private _filterFault(value: string): Faultcategory[] {
    if (value) {
      return this.Faultcategories.map((fault) => ({
        id: fault.id,
        title: fault.title,
        selectable: fault.selectable,
        subCategories: this._filterSubCategories(fault.subCategories, value),
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

  _filterSubCategories = (
    subcats: Faultcategory[],
    value: string
  ): Faultcategory[] => {
    const filterValue = value.toLowerCase();
    return subcats.filter((item) =>
      item.title.toLowerCase().includes(filterValue)
    );
  };
}
