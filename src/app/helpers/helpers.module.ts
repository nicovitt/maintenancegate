import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormatLabelDowntimeLongPipe,
  FormatLabelDowntimeShortPipe,
  FormatLabelRestrictionPipe,
  ReverseArraylPipe,
  SafeHtmlPipe,
  WorkplaceIdToName,
} from './pipes/pipes';
import { FancyprogressbarComponent } from './fancyprogressbar/fancyprogressbar.component';
import {
  ConfirmationDialog,
  EditTicketDialog,
  ErrorDialog,
} from '../services/dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GalleryModule } from 'ng-gallery';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [
    SafeHtmlPipe,
    WorkplaceIdToName,
    ReverseArraylPipe,
    FancyprogressbarComponent,
    FormatLabelRestrictionPipe,
    FormatLabelDowntimeLongPipe,
    FormatLabelDowntimeShortPipe,
    ConfirmationDialog,
    ErrorDialog,
    EditTicketDialog,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    GalleryModule,
    MatMomentDateModule,

    // START Angular Material
    MatSelectModule,
    MatDividerModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatSliderModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    // END Angular Material
  ],
  exports: [
    SafeHtmlPipe,
    WorkplaceIdToName,
    ReverseArraylPipe,
    FancyprogressbarComponent,
    FormatLabelRestrictionPipe,
    FormatLabelDowntimeLongPipe,
    FormatLabelDowntimeShortPipe,
    ConfirmationDialog,
    ErrorDialog,
    EditTicketDialog,
  ],
})
export class HelpersModule {}
