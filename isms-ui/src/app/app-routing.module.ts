import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TileComponent} from "./views/tile/tile.component";
import {PageNotFoundComponent} from "./views/page-not-found/page-not-found.component";
import {LoginComponent} from "./views/login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {HomeComponent} from "./views/home/home.component";
import {OptionQueryCreatorComponent} from "./components/query-creator/template/option-query-creator/option-query-creator.component";

const routes: Routes = [
  {
    path: '', canActivate:[AuthGuard], children: [
      { path: '', children: [
          { path: 'common-form-maker',
            loadChildren: () => import('./form-maker/form-maker.module').then((m) => { return m.FormMakerModule }).catch( err => console.log('Oh no!') )
          },
          { path: 'option-query-maker', component: OptionQueryCreatorComponent },
          { path: '', redirectTo: '/tile', pathMatch: 'full' },
          // { path: 'tile', component: TileComponent, children:[
          { path: 'tile', component: HomeComponent, children:[
              // { path: '', redirectTo: '/home', pathMatch: 'full' },
              { path: 'login', component: LoginComponent },
              { path: 'sejam',
                loadChildren: () => import('./views/sejam/sejam.module').then((m) => { return m.SejamModule }).catch( err => console.log('Oh no!') )
              },
              { path: 'basic-info',
                loadChildren: () => import('./views/basic-info/basic-info.module').then((m) => { return m.BasicInfoModule }).catch( err => console.log('Oh no!') )
              },
              {
                path: 'risk-management', loadChildren: () => import('./views/risk-management/risk-management.module').then(m => m.RiskManagementModule)
              },
              { path: 'reports',
                loadChildren: () => import('./views/reports-view/reports.module').then((m) => { return m.ReportsModule }).catch( err => console.log('Oh no!') )
              },
              { path: 'accounting',
                loadChildren: () => import('./views/accounting-view/accounting.module').then((m) => { return m.AccountingModule }).catch( err => console.log('Oh no!') )
              },
              { path: 'portfolio',
                loadChildren: () => import('./views/portfolio/portfolio.module').then((m) => { return m.PortfolioModule }).catch( err => console.log('Oh no!') )
              },
              { path: 'bond',
                loadChildren: () => import('./views/bond/bond.module').then((m) => { return m.BondModule }).catch( err => console.log('Oh no!') )
              }
            ]
          },
        ]
      },
      { path: 'login', component: LoginComponent, canActivate:[AuthGuard] },
      { path: 'logout', component: LoginComponent, canActivate:[AuthGuard] },
    ]
  },
  { path: 'form-maker', loadChildren: () => import('./form-maker/form-maker.module').then(m => m.FormMakerModule) },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
