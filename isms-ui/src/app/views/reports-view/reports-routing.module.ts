import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsViewComponent} from "./reports-view.component";
import {GeneralLedgerComponent} from "./general-ledger/general-ledger.component";
import {SubsidiaryLedgerComponent} from "./subsidiary-ledger/subsidiary-ledger.component";
import {DetailLedgerComponent} from "./detail-ledger/detail-ledger.component";
import {AuthGuard} from "../../guards/auth.guard";
import {GeneralBalanceComponent} from "./general-balance/general-balance.component";
import {SubsidiaryBalanceComponent} from "./subsidiary-balance/subsidiary-balance.component";
import {CommonSearchComponent} from "../../components/common-search/common-search.component";

const routes: Routes = [
  {
    path: '', component: ReportsViewComponent, children: [
      // { path: '', redirectTo: '/tile/shop/products-gallery/default', pathMatch: 'full' },
      { path: 'general-ledger', component: GeneralLedgerComponent, canActivate: [AuthGuard] },
      { path: 'subsidiary-ledger', component: SubsidiaryLedgerComponent, canActivate: [AuthGuard] },
      { path: 'detail-ledger', component: DetailLedgerComponent, canActivate: [AuthGuard] },
      { path: 'general-balance', component: GeneralBalanceComponent, canActivate: [AuthGuard] },
      { path: 'subsidiary-balance', component: SubsidiaryBalanceComponent, canActivate: [AuthGuard] },
      { path: 'common-search/:url', component: CommonSearchComponent, canActivate: [AuthGuard] },
      // { path: 'products-gallery/:routerLink', component: ProductsGalleryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
