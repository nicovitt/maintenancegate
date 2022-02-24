import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';

// START Components
import { ReportsComponent } from './reports/reports.component';
import { MachinebookComponent } from './machinebook/machinebook.component';
import { SchedulesComponent } from './schedules/schedules.component';
// END Components

// START Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HelpersModule } from '../helpers/helpers.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
// END Angular Material

@NgModule({
  declarations: [ReportsComponent, MachinebookComponent, SchedulesComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    HelpersModule,

    // START Angular Material
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatGridListModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    // END Angular Material

    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'),
    }),
  ],
})
export class ReportsModule {}
