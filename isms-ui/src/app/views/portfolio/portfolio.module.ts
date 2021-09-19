import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../components/shared.module";
import {PortfolioRoutingModule} from "./portfolio-routing.module";
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {PortfolioComponent} from "./portfolio.component";
import {PortfolioCalcComponent} from "./portfolio-calc/portfolio-calc.component";

@NgModule({
  declarations: [
    PortfolioComponent,
    PortfolioCalcComponent
  ],
  exports: [
    PortfolioComponent,
    PortfolioCalcComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatTableModule,
    PortfolioRoutingModule,
    MatCheckboxModule
  ]
})
export class PortfolioModule { }
