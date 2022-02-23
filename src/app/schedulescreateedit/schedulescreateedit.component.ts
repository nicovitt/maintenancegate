import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';
import { GalleryComponent, GalleryItem, ImageItem } from 'ng-gallery';
import { Attachment } from '../classes/attachment';
import { Step, Schedules } from '../classes/schedules';
import { DialogService } from '../services/dialog.service';
import { ImageService } from '../services/image.service';
import { ParseService } from '../services/parse.service';
import { ScheduleService } from '../services/schedule.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-schedulescreateedit',
  templateUrl: './schedulescreateedit.component.html',
  styleUrls: ['./schedulescreateedit.component.scss'],
})
export class SchedulescreateeditComponent implements OnInit, AfterViewInit {
  public schedule: Schedules;
  public schedulemetadataForm: FormGroup;
  public roles: any = [];
  public plansaved: boolean = false;
  public attachments: Array<Attachment> = [];
  public images: Array<GalleryItem> = [];
  @ViewChild(GalleryComponent) gallery: GalleryComponent;
  @ViewChild('stepstable') stepstable: MatTable<Step>;
  public stepstable_displayedColumns: string[] = [
    'position',
    'protectivegear',
    'type',
    'description',
    'usedmaterial',
    'performer',
    'actions',
  ];
  @ViewChild('filestable') filesstable: MatTable<Attachment>;
  public filestable_displayedColumns: string[] = [
    'filename',
    'mime',
    'actions',
  ];

  constructor(
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private parseService: ParseService,
    private _formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private scheduleService: ScheduleService,
    private imageService: ImageService,
    private router: Router
  ) {
    if (typeof this.scheduleService.schedule == 'undefined') {
      this.router.navigate(['/schedules']);
    }
    this.schedule = this.scheduleService.schedule;
    this.parseService.getUserRoles().then((roles) => {
      this.roles = roles;
    });
  }

  ngOnInit(): void {
    this.schedulemetadataForm = this._formBuilder.group({
      title: [this.schedule.title, Validators.required],
      description: [this.schedule.description, Validators.required],
      series_enabled: [this.scheduleService.series_enabled],
      series_frequency: [this.schedule.series.frequency],
      monday: [this.schedule.series.monday],
      tuesday: [this.schedule.series.tuesday],
      wednesday: [this.schedule.series.wednesday],
      thursday: [this.schedule.series.thursday],
      friday: [this.schedule.series.friday],
      saturday: [this.schedule.series.saturday],
      sunday: [this.schedule.series.sunday],
      startdate: [this.schedule.series.startdate],
      enddate: [this.schedule.series.enddate],
    });

    this.schedule.images.forEach((image) => {
      this.images.push(new ImageItem({ src: image.data }));
      this.attachments.push(image);
      this.recalculateindexes(this.attachments);
    });
  }

  ngAfterViewInit() {
    this.filesstable.renderRows();
    this.gallery.load(this.images);
  }

  addfile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const reader = new FileReader();
    let filetype = element.files[0].type; // image/jpeg for example

    reader.readAsDataURL(element.files[0]);
    reader.onloadend = () => {
      this.imageService
        .resizeImage(<string>reader.result, 1920, 1280)
        .then((value: string) => {
          const base64string = value.substring(
            value.indexOf('base64,') + 'base64,'.length,
            value.length
          );

          this.attachments.push({
            id: 0,
            filename:
              Math.floor(Math.random() * 1000000 + 1) +
              '.' +
              this.imageService.calculateFileEndingFromMimeType(
                this.imageService.calculateBase64MimeType(value)
              ),
            data: base64string,
            mimetype: this.imageService.calculateBase64MimeType(value),
          });
          this.images.push(new ImageItem({ src: value }));
          this.recalculateindexes(this.attachments);
          this.filesstable.renderRows();
          this.gallery.load(this.images);
        });
    };
  }

  addstep() {
    let dialogRef = this.dialogService.addStep(this.roles);
    dialogRef.afterClosed().subscribe((value: Step) => {
      if (value instanceof Step) {
        this.schedule.steps.push(value);
        this.recalculateindexes(this.schedule.steps);
        this.stepstable.renderRows();
      }
    });
  }

  deletestep(step: Step) {
    console.log(step);
    this.schedule.steps.splice(
      this.schedule.steps.findIndex((value) => value == step),
      1
    );
    this.recalculateindexes(this.schedule.steps);
    this.stepstable.renderRows();
  }

  movestep(step: Step, upwards: boolean) {
    let indexofstep = this.schedule.steps.findIndex((value) => value == step);
    if (upwards) {
      this.schedule.steps = this.array_move(
        this.schedule.steps,
        indexofstep,
        indexofstep - 1
      );
    } else {
      this.schedule.steps = this.array_move(
        this.schedule.steps,
        indexofstep,
        indexofstep + 1
      );
    }
    this.recalculateindexes(this.schedule.steps);
    this.stepstable.renderRows();
  }

  deletefile(file: Attachment) {
    this.dialogService
      .deleteGeneric()
      .afterClosed()
      .subscribe((value: boolean) => {
        if (!value) {
          return;
        }
        this.attachments.splice(
          this.attachments.findIndex((value) => {
            value.filename == file.filename;
          }),
          1
        );
        this.recalculateindexes(this.attachments);
        this.images.splice(file.id - 1, 1);
        this.filesstable.renderRows();
        this.gallery.set(0);
      });
  }

  save() {
    // TODO: Delete file in Parse.
    if (this.schedulemetadataForm.valid) {
      this.route.params.subscribe((params) => {
        this.schedule.title = this.schedulemetadataForm.get('title').value;
        this.schedule.description =
          this.schedulemetadataForm.get('description').value;
        this.schedule.workplaceid = parseInt(params['id']);
        this.schedule.images = this.attachments;
        if (this.schedulemetadataForm.get('series_enabled').value) {
          this.schedule.series.frequency =
            this.schedulemetadataForm.get('series_frequency').value;
          this.schedule.series.monday =
            this.schedulemetadataForm.get('monday').value;
          this.schedule.series.tuesday =
            this.schedulemetadataForm.get('tuesday').value;
          this.schedule.series.wednesday =
            this.schedulemetadataForm.get('wednesday').value;
          this.schedule.series.thursday =
            this.schedulemetadataForm.get('thursday').value;
          this.schedule.series.friday =
            this.schedulemetadataForm.get('friday').value;
          this.schedule.series.saturday =
            this.schedulemetadataForm.get('saturday').value;
          this.schedule.series.sunday =
            this.schedulemetadataForm.get('sunday').value;
          this.schedule.series.enddate =
            this.schedulemetadataForm.get('enddate').value;
          this.schedule.series.startdate =
            this.schedulemetadataForm.get('startdate').value;
        }
        this.parseService
          .saveSchedules(this.schedule)
          .then(
            (fullfilled) => {
              this.schedule.objectId = fullfilled.id;
              this.schedule.createdAt = fullfilled.get('createdAt');
              this.schedule.updatedAt = fullfilled.get('updatedAt');
              this.plansaved = true;
              this.snackbar.opensnackbar('Plan gespeichert', 'OK', 10000);
            },
            (notfullfilled) => {
              this.snackbar.opensnackbar('Fehler beim Speichern', 'OK', 10000);
            }
          )
          .catch((error) => {
            this.snackbar.opensnackbar('Fehler beim Speichern', 'OK', 10000);
          });
      });
    } else {
      Object.keys(this.schedulemetadataForm.controls).forEach((key) => {
        if (this.schedulemetadataForm.get(key).invalid) {
          this.schedulemetadataForm.get(key).setErrors({ incorrect: true });
        }
      });
    }
  }

  resetseries() {
    if (!this.schedulemetadataForm.get('series_enabled').value) {
      this.schedulemetadataForm.get('series_frequency').setValue('');
      this.schedulemetadataForm.get('monday').setValue('');
      this.schedulemetadataForm.get('tuesday').setValue('');
      this.schedulemetadataForm.get('wednesday').setValue('');
      this.schedulemetadataForm.get('thursday').setValue('');
      this.schedulemetadataForm.get('friday').setValue('');
      this.schedulemetadataForm.get('saturday').setValue('');
      this.schedulemetadataForm.get('sunday').setValue('');
    }
  }

  updateFormDate(event: Moment, formfield: string) {
    this.schedulemetadataForm.get(formfield).setValue(event);
    if (
      this.schedulemetadataForm.get('enddate').value <
      this.schedulemetadataForm.get('startdate').value
    ) {
      this.schedulemetadataForm
        .get('enddate')
        .setValue(this.schedulemetadataForm.get('startdate').value);
    }
  }

  private recalculateindexes(arraytosort: Step[] | Attachment[]) {
    let i = 1;
    arraytosort.forEach((value) => {
      value.id = i;
      i++;
    });
  }

  private array_move(arr: Array<any>, old_index: number, new_index: number) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }
}
