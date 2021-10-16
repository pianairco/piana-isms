import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AssetManagementRoutingModule} from './asset-management-routing.module';
import {AssetManagementComponent} from './asset-management.component';
import {ConsequenceParametersComponent} from "./settings/consequence-parameters/consequence-parameters.component";
import {ConsequenceParametersTypeComponent} from "./settings/consequence-parameters-type/consequence-parameters-type.component";
import {SharedModule} from "../../../components/shared.module";
import { ConsequenceParametersTypeSelectorComponent } from './settings/consequence-parameters-type-selector/consequence-parameters-type-selector.component';


@NgModule({
  declarations: [
    AssetManagementComponent,
    ConsequenceParametersComponent,
    ConsequenceParametersTypeComponent,
    ConsequenceParametersTypeSelectorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AssetManagementRoutingModule
  ]
})
export class AssetManagementModule { }
