import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetManagementComponent } from './asset-management.component';
import {ConsequenceParametersComponent} from "./settings/consequence-parameters/consequence-parameters.component";

const routes: Routes = [
  { path: '', component: AssetManagementComponent, children: [
      { path: 'settings', children: [
          { path: 'consequence-parameters', component: ConsequenceParametersComponent },
          { path: 'asset-grouped', component: ConsequenceParametersComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetManagementRoutingModule { }
