import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RiskManagementComponent} from './risk-management.component';

const routes: Routes = [
  {
    path: '', component: RiskManagementComponent, children: [
      { path: 'assets-management', loadChildren: () => import('./asset-management/asset-management.module').then(m => m.AssetManagementModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskManagementRoutingModule { }
