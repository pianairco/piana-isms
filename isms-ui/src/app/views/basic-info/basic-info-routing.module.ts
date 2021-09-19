import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BasicInfoViewComponent} from "./basic-info-view.component";
import {AuthGuard} from "../../guards/auth.guard";
import {CommonFormComponent} from "../../components/common-form/common-form.component";

const routes: Routes = [
  {
    path: '', component: BasicInfoViewComponent, children: [
      { path: 'common-form/:url', component: CommonFormComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicInfoRoutingModule { }
