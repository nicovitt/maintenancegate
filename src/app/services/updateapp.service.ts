import { ApplicationRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { interval, concat } from 'rxjs';
import { first } from 'rxjs/operators';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateappService {
  //Good example: https://medium.com/@arjenbrandenburgh/angulars-pwa-swpush-and-swupdate-15a7e5c154ac
  //Documentation: https://angular.io/guide/service-worker-communications
  //Documentation: https://angular.io/api/service-worker/SwUpdate

  constructor(
    private updateservice: SwUpdate,
    appRef: ApplicationRef,
    private snackbar: SnackbarService
  ) {
    if (this.updateservice.isEnabled) {
      //This initializes an updatecycle to check periodically for updates.
      // Allow the app to stabilize first, before starting polling for updates with `interval()`.
      const appisstable$ = appRef.isStable.pipe(
        first((isStable) => isStable === true)
      );
      const interval$ = interval(2 * 60 * 60 * 1000);
      const updatecycle$ = concat(appisstable$, interval$);

      updatecycle$.subscribe(() => {
        updateservice
          .checkForUpdate()
          .then(() => {})
          .catch((err) => {
            let snackerror = this.snackbar.opensnackbar(
              'Fehler während des Suchens nach Updates',
              'OK',
              1000
            );
            snackerror.onAction().subscribe(() => {
              snackerror.dismiss();
            });
          });
      });
    }

    //This is the part, where the update will be activated.
    this.updateservice.versionUpdates.subscribe((evt) => {
      const snackdoupdate = this.snackbar.opensnackbar(
        'Es ist ein Update verfügbar.',
        'Jetzt ausführen',
        -1
      );
      snackdoupdate.onAction().subscribe(() => {
        this.updateservice
          .activateUpdate()
          .then(() => {
            snackdoupdate.dismiss();
            document.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  }

  checkIfUpdateAvailable() {
    console.log('Checking for updates.');
    if (!this.updateservice.isEnabled) {
      return;
    }
    this.updateservice
      .checkForUpdate()
      .then(() => {})
      .catch((err) => {
        const snack = this.snackbar.opensnackbar(
          'Fehler während des Suchens nach Updates',
          'OK',
          -1
        );
        snack.onAction().subscribe(() => {
          snack.dismiss();
        });
      });
  }
}
