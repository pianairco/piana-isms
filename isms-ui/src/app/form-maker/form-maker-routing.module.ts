import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormMakerComponent } from './form-maker.component';

const routes: Routes = [{ path: '', component: FormMakerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormMakerRoutingModule { }
