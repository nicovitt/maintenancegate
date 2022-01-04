import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { CreateticketComponent } from './createticket/createticket.component';
import { CanActivateOnAuthenticated } from './helpers/guards/can-activate-on-authenticated';
import { ImpressComponent } from './impress/impress.component';
import { ListticketComponent } from './listticket/listticket.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SchedulescreateeditComponent } from './schedulescreateedit/schedulescreateedit.component';
import { SchedulesexecuteComponent } from './schedulesexecute/schedulesexecute.component';
import { ScheduleslistComponent } from './scheduleslist/scheduleslist.component';
import { ViewticketComponent } from './viewticket/viewticket.component';

const routes: Routes = [
  { path: 'login', component: AuthenticationComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: ListticketComponent,
    canActivate: [CanActivateOnAuthenticated],
  },
  {
    path: 'newticket',
    component: CreateticketComponent,
    canActivate: [CanActivateOnAuthenticated],
  },
  {
    path: 'ticket/:id',
    component: ViewticketComponent,
    canActivate: [CanActivateOnAuthenticated],
  },
  {
    path: 'schedules',
    component: SchedulesComponent,
    canActivate: [CanActivateOnAuthenticated],
  },
  {
    path: 'schedules/:id',
    component: ScheduleslistComponent,
    canActivate: [CanActivateOnAuthenticated],
  },
  {
    path: 'schedules/create/:id',
    component: SchedulescreateeditComponent,
    canActivate: [CanActivateOnAuthenticated],
  },
  {
    path: 'schedules/execute/:id',
    component: SchedulesexecuteComponent,
    canActivate: [CanActivateOnAuthenticated],
  },
  { path: 'impress', component: ImpressComponent },
  {
    path: 'monitor',
    loadChildren: () =>
      import('./monitor/monitor.module').then((m) => m.MonitorModule),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
