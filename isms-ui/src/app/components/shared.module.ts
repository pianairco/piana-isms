import {NgModule} from '@angular/core';

import {TopbarComponent} from "./topbar/topbar.component";
import {FooterComponent} from "./footer/footer.component";
import {NotificationComponent} from "./notification/notification.component";
import {LoadingComponent} from "./loading/loading.component";
// import {GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from "angularx-social-login";
import {PictureBoxComponent} from './picture-box/picture-box.component';
import {HeaderComponent} from './header/header.component';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TipComponent} from "./tip/tip.component";
import {InfoBoxComponent} from "./info-box/info-box.component";
import { SearchBoxComponent } from './search-box/search-box.component';
import {InjectableDialogComponent} from "./search-box/injectable-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {SearchViewComponent} from "./search-view/search-view.component";
import {MatTableModule} from "@angular/material/table";
import {DpDatePickerModule} from "ng2-jalali-date-picker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {InputMaskDirective} from "../directives/input-mask.directive";
import {CommonDialogComponent} from "./common-dialog/common-dialog.component";
import {FormElementComponent} from "./form-element/form-element.component";
import {NgxMaskModule} from "ngx-mask";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {SelectableIdsPipe} from "./pipes/SelectableIds";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {DataGridComponent} from "./data-grid/data-grid.component";
import {FormComponent} from "./form/form.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {CommonSearchComponent} from "./common-search/common-search.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SpinnerDialogComponent} from "./spinner-dialog/spinner-dialog.component";
import { ThousandSeparatorPipe } from '../pipes/thousand-separator.pipe';
import {MatTooltipModule} from "@angular/material/tooltip";
import {CommonFormComponent} from "./common-form/common-form.component";
import {MatFileUploadModule} from "mat-file-upload";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatSidenavModule} from "@angular/material/sidenav";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTabsModule} from "@angular/material/tabs";
import {MatRippleModule} from "@angular/material/core";
import {SelectableArrayTextPipe} from "./pipes/SelectableArrayText";
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import { QueryCreatorComponent } from './query-creator/query-creator.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {QueryCreatorDialogComponent} from "./query-creator/query-creator-dialog/query-creator-dialog.component";
import { SelectQueryComponent } from './query-creator/select-query/select-query.component';
import {QueryCreatorService} from "./query-creator/query-creator.service";
import {OptionQueryCreatorComponent} from "./query-creator/template/option-query-creator/option-query-creator.component";
import {PianaDropdownComponent} from "./piana-dropdown/piana-dropdown.component";
import {PianaSidebarComponent} from "./piana-sidebar/piana-sidebar.component";

@NgModule({
  declarations: [
    PianaDropdownComponent,
    PianaSidebarComponent,
    DataGridComponent,
    InputMaskDirective,
    TopbarComponent,
    FooterComponent,
    HeaderComponent,
    TipComponent,
    InfoBoxComponent,
    NotificationComponent,
    LoadingComponent,
    PictureBoxComponent,
    SearchViewComponent,
    SearchBoxComponent,
    InjectableDialogComponent,
    SidebarComponent,
    CommonDialogComponent,
    FormElementComponent,
    FormComponent,
    SelectableIdsPipe,
    SelectableArrayTextPipe,
    CommonSearchComponent,
    CommonFormComponent,
    SpinnerDialogComponent,
    ThousandSeparatorPipe,
    QueryCreatorComponent,
    OptionQueryCreatorComponent,
    QueryCreatorDialogComponent,
    SelectQueryComponent
  ],
  exports: [
    PianaDropdownComponent,
    PianaSidebarComponent,
    DragDropModule,
    MatSidenavModule,
    MatFileUploadModule,
    CommonSearchComponent,
    CommonFormComponent,
    DataGridComponent,
    SelectableIdsPipe,
    SelectableArrayTextPipe,
    FormElementComponent,
    FormComponent,
    CommonDialogComponent,
    InputMaskDirective,
    TopbarComponent,
    FooterComponent,
    HeaderComponent,
    TipComponent,
    InfoBoxComponent,
    NotificationComponent,
    LoadingComponent,
    PictureBoxComponent,
    SearchBoxComponent,
    SearchViewComponent,
    MatTableModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    DpDatePickerModule,
    SidebarComponent,
    NgbModule,
    MatListModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    SpinnerDialogComponent,
    ThousandSeparatorPipe,
    MatRippleModule,
    MatRadioModule,
    CKEditorModule,
    QueryCreatorComponent,
    MatButtonToggleModule,
    OptionQueryCreatorComponent,
  ],
  imports: [
    MatButtonToggleModule,
    CKEditorModule,
    MatRadioModule,
    MatRippleModule,
    MatSidenavModule,
    DragDropModule,
    MatFileUploadModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterModule,
    FormsModule,
    DpDatePickerModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatExpansionModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    PerfectScrollbarModule,
    NgbModule,
    NgxMaskModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatButtonModule
  ],
  providers: [
    QueryCreatorService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule { }
