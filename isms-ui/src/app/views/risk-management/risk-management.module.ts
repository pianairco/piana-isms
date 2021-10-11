import {NgModule, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskManagementRoutingModule } from './risk-management-routing.module';
import { RiskManagementComponent } from './risk-management.component';
import { ConsequenceParametersComponent } from './consequence-parameters/consequence-parameters.component';
import {SharedModule} from "../../components/shared.module";
import {MatAccordion} from "@angular/material/expansion";
import { ConsequenceParametersTypeComponent } from './consequence-parameters-type/consequence-parameters-type.component';


@NgModule({
  declarations: [RiskManagementComponent, ConsequenceParametersComponent, ConsequenceParametersTypeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RiskManagementRoutingModule
  ]
})
export class RiskManagementModule {
  @ViewChild(MatAccordion) accordion: MatAccordion;
}
