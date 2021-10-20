import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AssetManagementRoutingModule} from './asset-management-routing.module';
import {AssetManagementComponent} from './asset-management.component';
import {ConsequenceParametersComponent} from "./settings/consequence-parameters/consequence-parameters.component";
import {SharedModule} from "../../../components/shared.module";
import {FormsModule} from "@angular/forms";
import {
  ModalParameterSelectorComponent,
  ParametersSelectorDialogComponent
} from "./settings/consequence-parameters/parameters-selector-dialog/parameters-selector-dialog.component";
import {ConsequenceParametersTypeSelectorComponent} from "./settings/consequence-parameters/consequence-parameters-type-selector/consequence-parameters-type-selector.component";
import {ConsequenceParametersTypeComponent} from "./settings/consequence-parameters/consequence-parameters-type/consequence-parameters-type.component";



@NgModule({
  declarations: [
    AssetManagementComponent,
    ConsequenceParametersComponent,
    ConsequenceParametersTypeComponent,
    ConsequenceParametersTypeSelectorComponent,
    ModalParameterSelectorComponent,
    ParametersSelectorDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AssetManagementRoutingModule
  ]
})
export class AssetManagementModule { }
