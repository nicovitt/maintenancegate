import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Step, Schedules } from '../classes/schedules';
import { DialogService } from '../services/dialog.service';
import { ParseService } from '../services/parse.service';
import { ScheduleService } from '../services/schedule.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-schedulescreateedit',
  templateUrl: './schedulescreateedit.component.html',
  styleUrls: ['./schedulescreateedit.component.scss'],
})
export class SchedulescreateeditComponent implements OnInit {
  public schedule: Schedules;
  public schedulemetadataForm: FormGroup;
  public plansaved: boolean = false;
  @ViewChild(MatTable) table: MatTable<Step>;
  public displayedColumns: string[] = [
    'performer',
    'position',
    'topic',
    'frequency',
    'protectivegear',
    'type',
    'description',
    'usedmaterial',
    'actions',
  ];

  constructor(
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private parseService: ParseService,
    private _formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private scheduleService: ScheduleService
  ) {
    this.schedule = this.scheduleService.schedule;
    console.log(this.schedule);
  }

  ngOnInit(): void {
    this.schedulemetadataForm = this._formBuilder.group({
      title: [this.schedule.title, Validators.required],
      description: [this.schedule.description, Validators.required],
    });
  }

  addstep() {
    let dialogRef = this.dialogService.addStep();
    dialogRef.afterClosed().subscribe((value: Step) => {
      if (value instanceof Step) {
        this.schedule.steps.push(value);
        this.recalculateindexes();
        this.table.renderRows();
      }
    });
  }

  deletestep(step: Step) {
    this.schedule.steps.splice(
      this.schedule.steps.findIndex((value) => {
        value.id == step.id;
      }),
      1
    );
    this.recalculateindexes();
    this.table.renderRows();
  }

  save() {
    this.route.params.subscribe((params) => {
      if (
        this.schedulemetadataForm.get('title').invalid ||
        this.schedulemetadataForm.get('description').invalid
      ) {
        return;
      }
      this.schedule.title = this.schedulemetadataForm.get('title').value;
      this.schedule.description =
        this.schedulemetadataForm.get('description').value;
      this.schedule.workplaceid = parseInt(params['id']);
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
  }

  private recalculateindexes() {
    let i = 1;
    this.schedule.steps.forEach((step) => {
      step.id = i;
      i++;
    });
  }
}
