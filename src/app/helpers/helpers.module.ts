import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormatLabelDowntimeLongPipe,
  FormatLabelDowntimeShortPipe,
  FormatLabelFrequencyLongPipe,
  FormatLabelRestrictionPipe,
  FormatLabelWorkplacePipe,
  ReverseArraylPipe,
  SafeHtmlPipe,
  WorkplaceIdToName,
} from './pipes/pipes';
import { FancyprogressbarComponent } from './fancyprogressbar/fancyprogressbar.component';
import { ConfirmationDialog, ErrorDialog } from '../services/dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GalleryModule } from 'ng-gallery';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { EditTicketDialogComponent } from './dialog/edit-ticket-dialog/edit-ticket-dialog.component';

@NgModule({
  declarations: [
    SafeHtmlPipe,
    WorkplaceIdToName,
    ReverseArraylPipe,
    FancyprogressbarComponent,
    FormatLabelRestrictionPipe,
    FormatLabelDowntimeLongPipe,
    FormatLabelDowntimeShortPipe,
    FormatLabelWorkplacePipe,
    FormatLabelFrequencyLongPipe,
    ConfirmationDialog,
    ErrorDialog,
    EditTicketDialogComponent,
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
    MatCardModule,
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
    FormatLabelWorkplacePipe,
    FormatLabelFrequencyLongPipe,
    ConfirmationDialog,
    ErrorDialog,
    EditTicketDialogComponent,
  ],
})
export class HelpersModule {}
