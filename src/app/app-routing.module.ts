import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateticketComponent } from './createticket/createticket.component';

const routes: Routes = [
  // { path: '', component: MainComponent },
  { path: 'newticket', component: CreateticketComponent },
  { path: 'monitor', component: CreateticketComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
