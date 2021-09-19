import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../components/shared.module";
import {BasicInfoRoutingModule} from "./basic-info-routing.module";
import {MatTableModule} from '@angular/material/table';
import {DpDatePickerModule} from "ng2-jalali-date-picker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {BasicInfoViewComponent} from "./basic-info-view.component";

@NgModule({
  declarations: [
    BasicInfoViewComponent
  ],
  exports: [
    BasicInfoViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatTableModule,
    BasicInfoRoutingModule,
    DpDatePickerModule,
    MatCheckboxModule
  ]
})
export class BasicInfoModule { }
