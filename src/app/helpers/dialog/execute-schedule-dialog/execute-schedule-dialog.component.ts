import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedules } from 'src/app/classes/schedules';
import { ShowScheduleDialogComponent } from '../show-schedule-dialog/show-schedule-dialog.component';

@Component({
  selector: 'app-execute-schedule-dialog',
  templateUrl: './execute-schedule-dialog.component.html',
  styleUrls: ['./execute-schedule-dialog.component.scss'],
})
export class ExecuteScheduleDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ShowScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Schedules
  ) {}

  ngOnInit(): void {}

  submitChanges() {
    this.dialogRef.close(true);
  }

  onCloseClick() {
    this.dialogRef.close(false);
  }
}
