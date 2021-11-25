import { Component, Inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Ticket } from '../classes/ticket';
import 'moment/locale/de';
import { EditTicketDialogComponent } from '../helpers/dialog/edit-ticket-dialog/edit-ticket-dialog.component';

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
