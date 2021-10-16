import {NgModule, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskManagementRoutingModule } from './risk-management-routing.module';
import { RiskManagementComponent } from './risk-management.component';
import {SharedModule} from "../../components/shared.module";
import {MatAccordion} from "@angular/material/expansion";

@NgModule({
  declarations: [RiskManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    RiskManagementRoutingModule
  ]
})
export class RiskManagementModule {
  @ViewChild(MatAccordion) accordion: MatAccordion;
}
