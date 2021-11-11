import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SafeHtmlPipe } from '../helpers/pipes';

// START Components
import { ReportsComponent } from './reports/reports.component';
import { MachinebookComponent } from './machinebook/machinebook.component';
// END Components

// START Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
// END Angular Material

@NgModule({
  declarations: [ReportsComponent, MachinebookComponent, SafeHtmlPipe],
  imports: [
    CommonModule,
    ReportsRoutingModule,

    // START Angular Material
    MatCardModule,
    MatButtonModule,
    // END Angular Material

    FlexLayoutModule,

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
