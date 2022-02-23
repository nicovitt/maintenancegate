import { Component, Inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Ticket } from '../classes/ticket';
import 'moment/locale/de';
import { EditTicketDialogComponent } from '../helpers/dialog/edit-ticket-dialog/edit-ticket-dialog.component';
import { Schedules } from '../classes/schedules';
import { ShowScheduleDialogComponent } from '../helpers/dialog/show-schedule-dialog/show-schedule-dialog.component';
import { CreateScheduleStepDialogComponent } from '../helpers/dialog/create-schedule-step-dialog/create-schedule-step-dialog.component';
import { CreateScheduleDialogComponent } from '../helpers/dialog/create-schedule-dialog/create-schedule-dialog.component';
import { DeleteScheduleDialogComponent } from '../helpers/dialog/delete-schedule-dialog/delete-schedule-dialog.component';
import { DeleteGenericDialogComponent } from '../helpers/dialog/delete-generic-dialog/delete-generic-dialog.component';
import { ExecuteScheduleDialogComponent } from '../helpers/dialog/execute-schedule-dialog/execute-schedule-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(public dialog: MatDialog) {}

  /**
   * Title will be the title displayed on top of the dialog.
   * Message will be the content of the dialog.
   * @param param0
   * @returns Returns the reference of the dialog.
   */
  presentAlert$({ header, message }: { header: string; message: string }) {
    return;
  }

  /**
   * Title will be the title displayed on top of the dialog.
   * Message will be the content of the dialog.
   * @param param0
   * @returns Returns the reference of the dialog.
   */
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

  /**
   * Title will be the title displayed on top of the dialog.
   * Message will be the content of the dialog.
   * @param param0
   * @returns Returns the reference of the dialog.
   */
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
    const dialogRef = this.dialog.open(EditTicketDialogComponent, {
      width: '90%',
      data: ticket,
      hasBackdrop: true,
      disableClose: true,
    });
    return dialogRef;
  }

  showSchedule(schedule: Schedules) {
    const dialogRef = this.dialog.open(ShowScheduleDialogComponent, {
      width: '90%',
      data: schedule,
      hasBackdrop: true,
      disableClose: true,
    });
    return dialogRef;
  }

  addSchedule() {
    const dialogRef = this.dialog.open(CreateScheduleDialogComponent, {
      width: '90%',
      hasBackdrop: true,
      disableClose: true,
    });
    return dialogRef;
  }

  executeSchedule(schedule: Schedules) {
    const dialogRef = this.dialog.open(ExecuteScheduleDialogComponent, {
      width: '90%',
      data: schedule,
      hasBackdrop: true,
      disableClose: true,
    });
    return dialogRef;
  }

  deleteSchedule(schedule: Schedules) {
    const dialogRef = this.dialog.open(DeleteScheduleDialogComponent, {
      width: '90%',
      data: schedule,
      hasBackdrop: true,
      disableClose: true,
    });
    return dialogRef;
  }

  deleteGeneric() {
    const dialogRef = this.dialog.open(DeleteGenericDialogComponent, {
      width: '90%',
      hasBackdrop: true,
      disableClose: true,
    });
    return dialogRef;
  }

  addStep(roles: any) {
    const dialogRef = this.dialog.open(CreateScheduleStepDialogComponent, {
      width: '90%',
      data: roles,
      hasBackdrop: true,
      disableClose: true,
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
