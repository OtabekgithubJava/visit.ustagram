import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { App } from './app';

const routes: Routes = [
  {path: '', component: App},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
