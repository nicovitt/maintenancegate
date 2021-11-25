import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateOnAuthenticated } from '../helpers/guards/can-activate-on-authenticated';
import { MonitorComponent } from './monitor/monitor.component';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    component: MonitorComponent,
    canActivate: [CanActivateOnAuthenticated],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitorRoutingModule {}
