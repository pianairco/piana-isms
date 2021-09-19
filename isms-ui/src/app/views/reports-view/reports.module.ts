import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralLedgerComponent } from './general-ledger/general-ledger.component';
import { SubsidiaryLedgerComponent } from './subsidiary-ledger/subsidiary-ledger.component';
import { DetailLedgerComponent } from './detail-ledger/detail-ledger.component';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../components/shared.module";
import {ReportsRoutingModule} from "./reports-routing.module";
import {MatTableModule} from '@angular/material/table';
import {DpDatePickerModule} from "ng2-jalali-date-picker";
import {GeneralCodeComponent} from "./general-code/general-code.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReportsViewComponent} from "./reports-view.component";
import {GeneralBalanceComponent} from "./general-balance/general-balance.component";
import {SubsidiaryBalanceComponent} from "./subsidiary-balance/subsidiary-balance.component";

@NgModule({
  declarations: [
    ReportsViewComponent,
    GeneralLedgerComponent,
    SubsidiaryLedgerComponent,
    DetailLedgerComponent,
    GeneralCodeComponent,
    GeneralBalanceComponent,
    SubsidiaryBalanceComponent
  ],
  exports: [
    ReportsViewComponent,
    GeneralLedgerComponent,
    SubsidiaryLedgerComponent,
    DetailLedgerComponent,
    GeneralBalanceComponent,
    SubsidiaryBalanceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatTableModule,
    ReportsRoutingModule,
    DpDatePickerModule,
    MatCheckboxModule
  ]
})
export class ReportsModule { }
