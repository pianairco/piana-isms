import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SejamRoutingModule} from "./sejam-routing.module";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../components/shared.module";
import { SejamCustomerComponent } from './sejam-customer/sejam-customer.component';
import {SejamComponent} from "./sejam.component";
import {SiteSejamComponent} from "./site-sejam/site-sejam.component";
import {NgxMaskModule} from "ngx-mask";



@NgModule({
  declarations: [
    SejamComponent,
    SejamCustomerComponent,
    SiteSejamComponent
  ],
  exports: [
  ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        SejamRoutingModule,
        NgxMaskModule
    ]
})
export class SejamModule { }
