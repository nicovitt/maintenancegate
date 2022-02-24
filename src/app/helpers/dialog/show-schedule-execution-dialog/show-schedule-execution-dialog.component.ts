import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedules } from 'src/app/classes/schedules';

@Component({
  selector: 'app-show-schedule-execution-dialog',
  templateUrl: './show-schedule-execution-dialog.component.html',
  styleUrls: ['./show-schedule-execution-dialog.component.scss'],
})
export class ShowScheduleExecutionDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ShowScheduleExecutionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Schedules
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  submitChanges() {
    this.dialogRef.close(new Error('Dialog geschlossen.'));
  }

  onCloseClick() {
    this.dialogRef.close(new Error('Dialog geschlossen.'));
  }
}
