import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  opensnackbar(message: string, action: any, duration: number) {
    return this.snackbar.open(message, action, {
      duration: duration,
    });
  }
}
