import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BondComponent} from "./bond.component";
import {AuthGuard} from "../../guards/auth.guard";
import {BondCalcComponent} from "./bond-calc/bond-calc.component";
import {CommonFormComponent} from "../../components/common-form/common-form.component";

const routes: Routes = [
  {
    path: '', component: BondComponent, children: [
      // { path: '', redirectTo: '/tile/shop/products-gallery/default', pathMatch: 'full' },
      { path: 'bond-calc', component: BondCalcComponent, canActivate: [AuthGuard] },
      { path: 'common-form/:url', component: CommonFormComponent, canActivate: [AuthGuard] }
      // { path: 'products-gallery/:routerLink', component: ProductsGalleryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BondRoutingModule { }
