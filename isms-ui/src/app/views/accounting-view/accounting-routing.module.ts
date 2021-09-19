import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../guards/auth.guard";
import {CommonSearchComponent} from "../../components/common-search/common-search.component";
import {AccountingViewComponent} from "./accounting-view.component";

const routes: Routes = [
  {
    path: '', component: AccountingViewComponent, children: [
      { path: 'common-search/:url', component: CommonSearchComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
