import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { CreateticketComponent } from './createticket/createticket.component';
import { ListticketComponent } from './listticket/listticket.component';
import { ViewticketComponent } from './viewticket/viewticket.component';

const routes: Routes = [
  { path: 'login', component: AuthenticationComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: ListticketComponent },
  { path: 'newticket', component: CreateticketComponent },
  { path: 'ticket/:id', component: ViewticketComponent },
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
