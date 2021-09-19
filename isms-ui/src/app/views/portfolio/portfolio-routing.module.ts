import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PortfolioComponent} from "./portfolio.component";
import {AuthGuard} from "../../guards/auth.guard";
import {PortfolioCalcComponent} from "./portfolio-calc/portfolio-calc.component";

const routes: Routes = [
  {
    path: '', component: PortfolioComponent, children: [
      // { path: '', redirectTo: '/tile/shop/products-gallery/default', pathMatch: 'full' },
      { path: 'portfolio-calc', component: PortfolioCalcComponent, canActivate: [AuthGuard] }
      // { path: 'products-gallery/:routerLink', component: ProductsGalleryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioRoutingModule { }
