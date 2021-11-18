import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

// START Components
import { CreateticketComponent } from './createticket/createticket.component';
import { ListticketComponent } from './listticket/listticket.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ViewticketComponent } from './viewticket/viewticket.component';
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
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// END Angular Material

import { GalleryModule } from 'ng-gallery';
import { GALLERY_CONFIG } from 'ng-gallery';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressbarComponent } from './helpers/progressbar/progressbar.component';
import { TranslocoRootModule } from './transloco-root.module';
import { HelpersModule } from './helpers/helpers.module';
import { WorkplaceIdToName } from './helpers/pipes/pipes';

@NgModule({
  declarations: [
    AppComponent,
    CreateticketComponent,
    ListticketComponent,
    AuthenticationComponent,
    ProgressbarComponent,
    ViewticketComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HelpersModule,

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
    MatTableModule,
    MatExpansionModule,
    MatSnackBarModule,
    // END Angular Material

    GalleryModule,
    FormsModule,
    ReactiveFormsModule,

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
