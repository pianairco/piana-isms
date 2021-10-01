import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RiskManagementComponent} from './risk-management.component';
import {ConsequenceParametersComponent} from "./consequence-parameters/consequence-parameters.component";

const routes: Routes = [
  {
    path: '', component: RiskManagementComponent, children: [
      { path: 'consequence-parameters', component: ConsequenceParametersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskManagementRoutingModule { }
