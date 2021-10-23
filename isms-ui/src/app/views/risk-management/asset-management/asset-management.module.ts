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
import {ConsequenceParametersDetailComponent} from "./settings/consequence-parameters/consequence-parameters-detail/consequence-parameters-detail.component";
import {TypeSelectorComponent} from "./settings/consequence-parameters/parameters-selector-dialog/type-selector/type-selector.component";
import {TypeCreatorComponent} from "./settings/consequence-parameters/parameters-selector-dialog/type-creator/type-creator.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    AssetManagementComponent,
    ConsequenceParametersComponent,
    ConsequenceParametersDetailComponent,
    ModalParameterSelectorComponent,
    ParametersSelectorDialogComponent,
    TypeSelectorComponent,
    TypeCreatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AssetManagementRoutingModule
  ]
})
export class AssetManagementModule { }
