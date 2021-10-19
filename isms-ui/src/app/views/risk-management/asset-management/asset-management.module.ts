import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AssetManagementRoutingModule} from './asset-management-routing.module';
import {AssetManagementComponent} from './asset-management.component';
import {ConsequenceParametersComponent} from "./settings/consequence-parameters/consequence-parameters.component";
import {ConsequenceParametersTypeComponent} from "./settings/consequence-parameters-type/consequence-parameters-type.component";
import {SharedModule} from "../../../components/shared.module";
import { ConsequenceParametersTypeSelectorComponent } from './settings/consequence-parameters-type-selector/consequence-parameters-type-selector.component';
import {
  ModalParameterSelectorComponent,
  ParametersSelectorDialogComponent
} from "./settings/parameters-selector-dialog/parameters-selector-dialog.component";
import {FormsModule} from "@angular/forms";



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
