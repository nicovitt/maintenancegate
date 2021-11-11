import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { WorkplaceIdToName } from './helpers/pipes';

// START Components
import { CreateticketComponent } from './createticket/createticket.component';
import { ListticketComponent } from './listticket/listticket.component';
import { AuthenticationComponent } from './authentication/authentication.component';
// END Components

// START Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
// END Angular Material

// START Dialog
import { ConfirmationDialog, ErrorDialog } from './services/dialog.service';
// END Dialog

import { GalleryModule } from 'ng-gallery';
import { GALLERY_CONFIG } from 'ng-gallery';
import { CookieService } from 'ngx-cookie-service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressbarComponent } from './helpers/progressbar/progressbar.component';
import { TranslocoRootModule } from './transloco-root.module';
// import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
  declarations: [
    AppComponent,
    CreateticketComponent,
    ListticketComponent,
    AuthenticationComponent,
    ProgressbarComponent,

    // START Dialog
    ConfirmationDialog,
    ErrorDialog,
    // END Dialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // START Angular Material
    MatToolbarModule,
    MatSelectModule,
    MatDividerModule,
    MatInputModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    MatRadioModule,
    MatSliderModule,
    MatProgressBarModule,
    MatCardModule,
    MatAutocompleteModule,
    MatDialogModule,
    // END Angular Material

    GalleryModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    // ReactiveComponentModule,

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    TranslocoRootModule,
  ],
  providers: [
    CookieService,
    DatePipe,
    WorkplaceIdToName,
    {
      provide: GALLERY_CONFIG,
      useValue: {
        dots: true,
        imageSize: 'cover',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
