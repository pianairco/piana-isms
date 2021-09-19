import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../guards/auth.guard";
import {SejamComponent} from "./sejam.component";
import {SejamCustomerComponent} from "./sejam-customer/sejam-customer.component";
import {SiteSejamComponent} from "./site-sejam/site-sejam.component";

const routes: Routes = [
  {
    path: '', component: SejamComponent, children: [
      // { path: '', redirectTo: '/tile/shop/products-gallery/default', pathMatch: 'full' },
      { path: 'sejam-customer', component: SejamCustomerComponent, canActivate: [AuthGuard] },
      { path: 'site-sejam', component: SiteSejamComponent, canActivate: [AuthGuard] },
      // { path: 'products-gallery/:routerLink', component: ProductsGalleryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SejamRoutingModule { }
