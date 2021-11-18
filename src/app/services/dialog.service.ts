import { Component, Inject, Injectable, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgModel,
  FormControl,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { GalleryComponent } from 'ng-gallery';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Faultcategory } from '../classes/faultcategory';
import { Ticket } from '../classes/ticket';
import { Workplacecategory } from '../classes/workplacecategory';
import { WorkplaceIdToName } from '../helpers/pipes/pipes';
import { ImageService } from './image.service';
import { ParseService } from './parse.service';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private readonly translocoService: TranslocoService,
    public dialog: MatDialog
  ) {}

  presentAlert$({ header, message }: { header: string; message: string }) {
    return;
  }

  presentError$({
    header,
    title,
    message,
  }: {
    header: string;
    title: string;
    message: string;
  }) {
    const dialogRef = this.dialog.open(ErrorDialog, {
      width: '90%',
      data: { title: title, message: message },
    });
    return dialogRef;
  }

  presentConfirmation$({
    header,
    title,
    message,
  }: {
    header: string;
    title: string;
    message: string;
  }) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '90%',
      data: { title: title, message: message },
    });
    return dialogRef;
  }

  editTicket(ticket: Ticket) {
    const dialogRef = this.dialog.open(EditTicketDialog, {
      width: '90%',
      data: { ticket: ticket },
    });
    return dialogRef;
  }
}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: '../helpers/dialog/confirmation.html',
  styleUrls: ['../helpers/dialog/confirmation.scss'],
})
export class ConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'error-dialog',
  templateUrl: '../helpers/dialog/error.html',
  styleUrls: ['../helpers/dialog/error.scss'],
})
export class ErrorDialog {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'edit-ticket-dialog',
  templateUrl: '../helpers/dialog/editTicket.html',
  styleUrls: ['../helpers/dialog/editTicket.scss'],
})
export class EditTicketDialog {
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
    public dialogRef: MatDialogRef<EditTicketDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Ticket,
    private _formBuilder: FormBuilder,
    private parseService: ParseService,
    private pipe_workplaceidtoname: WorkplaceIdToName,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      title: [this.data.title, Validators.required],
      category: [this.data.categorie, Validators.required],
      category2: [''],
      message: [''],
      workplace: ['', Validators.required],
      workplace2: [''],
      photos: ['', Validators.required],
      audios: [''],
      worker_downtime: ['0', Validators.required],
      worker_frequency: ['0', Validators.required],
      worker_restriction: ['1', Validators.required],
      start: new FormControl(),
      end: new FormControl(),
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

  submitChanges() {}

  onCloseClick(): void {
    this.dialogRef.close();
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
