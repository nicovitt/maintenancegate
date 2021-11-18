import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  opensnackbar(message: string, action: any) {
    this.snackbar.open(message, action, {
      duration: 3000,
    });
  }
}
