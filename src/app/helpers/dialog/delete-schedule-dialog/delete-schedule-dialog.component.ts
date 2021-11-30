import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedules } from 'src/app/classes/schedules';
import { ShowScheduleDialogComponent } from '../show-schedule-dialog/show-schedule-dialog.component';

@Component({
  selector: 'app-delete-schedule-dialog',
  templateUrl: './delete-schedule-dialog.component.html',
  styleUrls: ['./delete-schedule-dialog.component.scss'],
})
export class DeleteScheduleDialogComponent implements OnInit {
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
