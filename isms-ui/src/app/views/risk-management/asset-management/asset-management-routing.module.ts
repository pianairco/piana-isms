import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetManagementComponent } from './asset-management.component';
import {ConsequenceParametersComponent} from "./settings/consequence-parameters/consequence-parameters.component";
import {ModalParameterSelectorComponent} from "./settings/consequence-parameters/parameters-selector-dialog/parameters-selector-dialog.component";
import {ConsequenceParametersDetailComponent} from "./settings/consequence-parameters/consequence-parameters-detail/consequence-parameters-detail.component";
import {TypeSelectorComponent} from "./settings/consequence-parameters/parameters-selector-dialog/type-selector/type-selector.component";
import {TypeCreatorComponent} from "./settings/consequence-parameters/parameters-selector-dialog/type-creator/type-creator.component";

const routes: Routes = [
  { path: '', component: AssetManagementComponent, children: [
      { path: 'settings', children: [
          { path: 'consequence-parameters', component: ConsequenceParametersComponent, children:[
              { path: 'values/:parameterId', component: ConsequenceParametersDetailComponent, children: [
                  { path: 'select/:parameterId/:assignedParameterTypeId', component: ModalParameterSelectorComponent, children: [
                      { path: 'create', component: TypeCreatorComponent }
                    ]
                  }
                ]
              },
            ]
          },
          { path: 'asset-grouped', component: ConsequenceParametersComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetManagementRoutingModule { }
