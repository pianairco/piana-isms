import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskManagementRoutingModule } from './risk-management-routing.module';
import { RiskManagementComponent } from './risk-management.component';
import { ConsequenceParametersComponent } from './consequence-parameters/consequence-parameters.component';


@NgModule({
  declarations: [RiskManagementComponent, ConsequenceParametersComponent],
  imports: [
    CommonModule,
    RiskManagementRoutingModule
  ]
})
export class RiskManagementModule { }
