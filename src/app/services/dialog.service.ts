import { Component, Inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';

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
