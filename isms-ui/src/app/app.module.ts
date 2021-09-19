import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {RootComponent} from "./views/root/root.component";
import {PageNotFoundComponent} from "./views/page-not-found/page-not-found.component";
import {TileComponent} from "./views/tile/tile.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationService} from "./services/authentication-service.service";
import {InitializerService} from "./services/initializer.service";
import {SharedModule} from "./components/shared.module";
import {LoginComponent} from "./views/login/login.component";
import {DataEditorComponent} from "./views/data-editor/data-editor.component";
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {HomeComponent} from "./views/home/home.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxMaskModule} from "ngx-mask";

@NgModule({
  declarations: [
    RootComponent,
    DataEditorComponent,
    PageNotFoundComponent,
    TileComponent,
    LoginComponent,
    HomeComponent,
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    NgxMaskModule,
    SharedModule,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SharedModule,
    MatInputModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatAutocompleteModule,
    NgbModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    AuthenticationService,
    InitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: (initializerService: InitializerService) => () => initializerService.load(),
      deps: [InitializerService],
      multi: true
    }],
  bootstrap: [RootComponent]
})
export class AppModule { }
