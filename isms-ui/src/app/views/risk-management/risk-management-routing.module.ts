import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RiskManagementComponent} from './risk-management.component';
import {ConsequenceParametersComponent} from "./consequence-parameters/consequence-parameters.component";
import {ConsequenceParametersTypeComponent} from "./consequence-parameters-type/consequence-parameters-type.component";

const routes: Routes = [
  {
    path: '', component: RiskManagementComponent, children: [
      { path: 'settings', children: [
          { path: 'consequence-parameters', component: ConsequenceParametersComponent, children: [
              { path: 'type', component: ConsequenceParametersTypeComponent }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskManagementRoutingModule { }
