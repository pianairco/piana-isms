import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormMakerRoutingModule } from './form-maker-routing.module';
import { FormMakerComponent } from './form-maker.component';
import { ControlSettingDialogComponent } from './control-setting-dialog/control-setting-dialog.component';
import { ColumnSettingDialogComponent } from './column-setting-dialog/column-setting-dialog.component';
import {SharedModule} from "../components/shared.module";
import {FormsModule} from "@angular/forms";
import {FormMakerService} from "./form-maker.service";
import { LayoutMakerComponent } from './layout-maker/layout-maker.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {OptionLoadFromQueryDialogComponent} from "./option-load-from-query-dialog/option-load-from-query-dialog.component";


@NgModule({
  declarations: [
    FormMakerComponent,
    ControlSettingDialogComponent,
    ColumnSettingDialogComponent,
    LayoutMakerComponent,
    OptionLoadFromQueryDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormMakerRoutingModule,
    SharedModule,
    MatButtonModule,
  ],
  providers: [
    FormMakerService
  ]
})
export class FormMakerModule { }
