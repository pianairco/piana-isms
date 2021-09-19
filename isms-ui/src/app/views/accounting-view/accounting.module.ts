import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../components/shared.module";
import {MatTableModule} from '@angular/material/table';
import {DpDatePickerModule} from "ng2-jalali-date-picker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AccountingViewComponent} from "./accounting-view.component";
import {AccountingRoutingModule} from "./accounting-routing.module";

@NgModule({
  declarations: [
    AccountingViewComponent,
  ],
  exports: [
    AccountingViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatTableModule,
    AccountingRoutingModule,
    DpDatePickerModule,
    MatCheckboxModule
  ]
})
export class AccountingModule { }
