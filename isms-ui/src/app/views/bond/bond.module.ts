import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../components/shared.module";
import {BondRoutingModule} from "./bond-routing.module";
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {BondComponent} from "./bond.component";
import {BondCalcComponent} from "./bond-calc/bond-calc.component";

@NgModule({
  declarations: [
    BondComponent,
    BondCalcComponent
  ],
  exports: [
    BondComponent,
    BondCalcComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatTableModule,
    BondRoutingModule,
    MatCheckboxModule
  ]
})
export class BondModule { }
