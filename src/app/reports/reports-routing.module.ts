import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateOnAuthenticated } from '../helpers/guards/can-activate-on-authenticated';
import { MachinebookComponent } from './machinebook/machinebook.component';
import { ReportsComponent } from './reports/reports.component';
import { SchedulesComponent } from './schedules/schedules.component';

const routes: Routes = [
  // { path: '', redirectTo: '/overview', pathMatch: 'full' },
  {
    path: '',
    component: ReportsComponent,
    canActivate: [CanActivateOnAuthenticated],
  },
  {
    path: 'machinebook',
    component: MachinebookComponent,
    canActivate: [CanActivateOnAuthenticated],
  },
  {
    path: 'schedules',
    component: SchedulesComponent,
    canActivate: [CanActivateOnAuthenticated],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
