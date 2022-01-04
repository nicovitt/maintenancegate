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
  WorkplaceTitleToName,
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
import { ShowScheduleDialogComponent } from './dialog/show-schedule-dialog/show-schedule-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { CreateScheduleDialogComponent } from './dialog/create-schedule-dialog/create-schedule-dialog.component';
import { CreateScheduleStepDialogComponent } from './dialog/create-schedule-step-dialog/create-schedule-step-dialog.component';
import { DeleteScheduleDialogComponent } from './dialog/delete-schedule-dialog/delete-schedule-dialog.component';
import { BackButtonDirective } from './backbutton/back-button.directive';
import { PageheaderComponent } from './pageheader/pageheader.component';
import { DeleteGenericDialogComponent } from './dialog/delete-generic-dialog/delete-generic-dialog.component';
import { ExecuteScheduleDialogComponent } from './dialog/execute-schedule-dialog/execute-schedule-dialog.component';

@NgModule({
  declarations: [
    SafeHtmlPipe,
    WorkplaceTitleToName,
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
    ShowScheduleDialogComponent,
    CreateScheduleDialogComponent,
    CreateScheduleStepDialogComponent,
    DeleteScheduleDialogComponent,
    BackButtonDirective,
    PageheaderComponent,
    DeleteGenericDialogComponent,
    ExecuteScheduleDialogComponent,
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
    MatTableModule,
    // END Angular Material
  ],
  exports: [
    SafeHtmlPipe,
    WorkplaceTitleToName,
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
    BackButtonDirective,
    PageheaderComponent,
  ],
})
export class HelpersModule {}
