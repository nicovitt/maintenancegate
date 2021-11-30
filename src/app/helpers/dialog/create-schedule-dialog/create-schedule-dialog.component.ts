import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedules } from 'src/app/classes/schedules';

@Component({
  selector: 'app-create-schedule-dialog',
  templateUrl: './create-schedule-dialog.component.html',
  styleUrls: ['./create-schedule-dialog.component.scss'],
})
export class CreateScheduleDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CreateScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Schedules
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  submitChanges() {}

  onCloseClick() {
    this.dialogRef.close(new Error('Schritt-hinzufügen-Dialog geschlossen.'));
  }
}
