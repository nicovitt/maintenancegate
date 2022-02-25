import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitorRoutingModule } from './monitor-routing.module';
import { MonitorComponent } from './monitor/monitor.component';
import { HelpersModule } from '../helpers/helpers.module';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MonitorComponent],
  imports: [
    CommonModule,
    MonitorRoutingModule,
    HelpersModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
  ],
})
export class MonitorModule {}
