import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedules } from 'src/app/classes/schedules';

@Component({
  selector: 'app-show-schedule-dialog',
  templateUrl: './show-schedule-dialog.component.html',
  styleUrls: ['./show-schedule-dialog.component.scss'],
})
export class ShowScheduleDialogComponent implements OnInit {
  displayedColumns: string[] = [
    'performer',
    'position',
    'topic',
    'frequency',
    'protectivegear',
    'type',
    'description',
    'usedmaterial',
  ];

  constructor(
    public dialogRef: MatDialogRef<ShowScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Schedules
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  submitChanges() {}

  onCloseClick() {
    this.dialogRef.close(new Error('Arbeitsplan-anzeigen-Dialog geschlossen.'));
  }
}
