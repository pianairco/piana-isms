import {ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
  FormElementType,
  formElementTypes,
  Layout,
  SelectableItem
} from "../components/form-element/form-element.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {BehaviorSubject, Observable} from "rxjs";
import {ControlSettingDialogComponent} from "./control-setting-dialog/control-setting-dialog.component";
import {ColumnSettingDialogComponent} from "./column-setting-dialog/column-setting-dialog.component";
import {AjaxCallService} from "../services/ajax-call.service";
import {LoadingService} from "../services/loading.service";
import {NotificationService} from "../services/notification.service";
import {CommonDialogComponent} from "../components/dialog/common-dialog/common-dialog.component";
import {FormMakerModule} from "./form-maker.module";
import {FormMakerService} from "./form-maker.service";
import {CdkDrag} from "@angular/cdk/drag-drop";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {OptionLoadFromQueryDialogComponent} from "./option-load-from-query-dialog/option-load-from-query-dialog.component";

@Component({
  selector: 'app-form-maker',
  templateUrl: './form-maker.component.html',
  styleUrls: ['./form-maker.component.css']
})
export class FormMakerComponent implements OnInit {
  public layoutSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  @Input() layoutName: string;

  layout: Observable<Layout>;
  @Input() value: object;
  @Input() hasParent: boolean = true;
  @Output() valueChange: EventEmitter<object> = new EventEmitter<object>();
  @Output() onBtnClick: EventEmitter<object> = new EventEmitter<object>();
  @Input() model: any = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() layoutChange: EventEmitter<any> = new EventEmitter<any>();
  list = {};
  initialized = false;
  @Input() isMaster = true;

  constructor(public formMakerService: FormMakerService,
              private route: ActivatedRoute,
              private router: Router,
              private ajaxCall: AjaxCallService,
              private loadingService: LoadingService,
              public dialog: MatDialog,
              private notificationService: NotificationService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // console.log("FormComponent", this.model, this.layout)
    this.layout = this.formMakerService.createNewLayout(null);
    // console.log(this.layout)
    this.layout.subscribe(res => {
      if(!this.initialized) {
        this.initialized = true
        res['isMaster'] = true;
        this.layoutName = res['layoutName'];
        // console.log(this.layoutName)
      }

      console.log(res);
    })

    this.formMakerService.selectedColumnSubject.subscribe(res => {
      if(res && res['type']) {
        // console.log(typeof res['type']);
        if(typeof res['type'] == 'number') {
          this.selectedType = [FormElementType.toString(res['type'])];
          // console.log(this.selectedType);
          // this.selectedType = res['type'];
        } else {
          this.selectedType = [res['type'].toUpperCase()];
          // console.log(this.selectedType);
        }
      }
      /*if(res && res['type'] != 'none') {
        console.log(1,res['type'])
        this.selectedType = res['type'];
      } else {
        console.log(2)
        this.selectedType = null;
      }*/
      // this.formMakerService.changeSelectedColumnField('type', FormElementType.parse(this.selectedType));
      // this.formElementTypesSubject.next(JSON.parse(JSON.stringify(this.formElementTypes)))
    });
  }

  ngAfterViewInit() {
  }

  newRow(event, column) {
    this.formMakerService.createNewRow(column['layoutName']);
    event.stopPropagation();
  }

  // newRow() {
  //   // console.log(JSON.stringify(this.layout))
  //   this.showModal=  false;
  //   this.formMakerService.createNewRow(this.layoutName)
  //   // @ts-ignore
  //   /*    this.layout.push({
  //         "layoutSize": "12",
  //         "type": "layout",
  //         "class": "align-items-center",
  //         "children": []
  //       });*/
  // }

  counter = 0;
  showModal = true;
  showButtons = {};

  onLayoutChange(layout) {

  }

  showSettingButton(column) {
    if(!this.showButtons.hasOwnProperty(column['field']))
      this.showButtons[column.field] = true;
    else {
      this.showButtons[column.field] = !this.showButtons[column.field];
    }
  }

  columnSettings(column) {
    this.showModal = true;
    const dialogRef = this.dialog.open(ColumnSettingDialogComponent, {
      width: '500px',
      data: {
        column: column
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      let c = JSON.parse(JSON.stringify(result['data']));
      for(let k in column) {
        delete column[k];
      }
      for(let k in c) {
        column[k] = c[k];
      }
      if(this.isMaster) {
        this.layoutSubject.next(this.layout);
      } else {
        this.layoutChange.emit(this.layout)
      }
      this.showModal = false;
    });
  }

  controlSettings(column) {
    this.showModal = true;
    const dialogRef = this.dialog.open(ControlSettingDialogComponent, {
      width: '80%',
      data: {
        layoutName: column['layoutName'],
        rowName: column['rowName'],
        columnName: column['columnName']
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      let c = JSON.parse(JSON.stringify(result['data']));
      // console.log(c);
      this.formMakerService.changeColumn(column['layoutName'], column['rowName'], column['columnName'], c);
      this.showModal = false;
      /*let c = JSON.parse(JSON.stringify(result['data']));
      console.log(c);
      for(let k in column) {
        delete column[k];
      }
      for(let k in c) {
        column[k] = c[k];
      }
      if(this.isMaster) {
        this.layoutSubject.next(this.layout);
      } else {
        this.layoutChange.emit(this.layout)
      }
      this.showModal = false;*/
    });
  }

  newColumn(layout) {
    console.log(layout.children)
    // @ts-ignore
    layout.children.push({
      class: "",
      field: "field" + (++this.counter),
      hasAll: false,
      hasNone: false,
      height: "",
      layoutSize: "",
      left: "",
      list: [],
      listApi: "",
      mask: "",
      maxLength: 0,
      minLength: 0,
      numeric: false,
      placeholder: "",
      required: false,
      title: "",
      value: undefined,
      type: 'none'});
    console.log(layout.children)
  }

  checkForRequired(layouts: Layout[]): string[] {
    let requiredFields: string[] = [];
    for(let l of layouts) {
      if(l['type'] == 'layout' && !l['layout']) {
        requiredFields.push(...this.checkForRequired(l['children']));
      } else if(l['type'] == 'layout' && l['layout']) {
        requiredFields.push(...this.checkForRequired(l['layout']));
      } else if(!l['type'] && l['children']) {
        requiredFields.push(...this.checkForRequired(l['children']));
      } else if(l['type']) {
        // console.log(l['title'], this.model[l['field']], Array.isArray(this.model[l['field']]));
        if(l['required'] && (!this.model[l['field']] || (Array.isArray(this.model[l['field']]) && this.model[l['field']].length == 0))) {
          requiredFields.push(l['title']);
          // console.log(l['field'] + " is required!");
        }
      }
    }
    return requiredFields;
  }

  btnClick(btn) {
    // console.log(this.layout, this.layout[0])
    let strings = '';
    // strings = this.checkForRequired(this.layout);
    if(strings && strings.length > 0) {
      alert(strings)
    } else {
      let resultModel = this.createModel();
      // console.log(resultModel);
      if(btn['action'] == 'emit') {
        this.onBtnClick.emit({ button: btn, model: resultModel });
      } else if(btn['action'] == 'get') {
        this.ajaxCall.read(btn['url']).then(res => {
          this.showMessage('پیام سیستم', 'با موفقیت انجام شد', true, btn);
        }, err => {
          this.showMessage('پیام سیستم', 'با خطا مواجه شد', false, btn);
        });
      } else if(btn['action'] == 'post') {
        this.ajaxCall.post(btn['url'], resultModel).then(res => {
          this.showMessage('پیام سیستم', 'با موفقیت انجام شد', true, btn);
        }, err => {
          this.showMessage('پیام سیستم', 'با خطا مواجه شد', false, btn);
        });
      } else if(btn['action'] == 'put') {
        this.ajaxCall.update(btn['url'], resultModel).then(res => {
          this.showMessage('پیام سیستم', 'با موفقیت انجام شد', true, btn);
        }, err => {
          this.showMessage('پیام سیستم', 'با خطا مواجه شد', false, btn);
        });
      } else if(btn['action'] == 'delete') {
        this.ajaxCall.delete(btn['url'], resultModel[btn['fieldForDelete']]).then(res => {
          this.showMessage('پیام سیستم', 'با موفقیت انجام شد', true, btn);
        }, err => {
          this.showMessage('پیام سیستم', 'با خطا مواجه شد', false, btn);
        });
      }
    }
  }

  showMessage(title: string, message: string, isSuccess: boolean, btn: object) {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '500px',
      data: {
        title: title,
        message: message
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed => ', result);
      if(isSuccess && btn.hasOwnProperty('navigateOnSuccess')) {
        this.router.navigateByUrl(btn['navigateOnSuccess']);
      }
    });
  }

  createModel() {
    let resultModel = {};
    this.setDataToEmit(this.layout, resultModel);
    return resultModel;
  }

  setDataToEmit(layout, resultModel) {
    console.log(layout)
    for (let c of layout) {
      if (!c.hasOwnProperty('type') || c['type'] == 'layout') {
        if (c.hasOwnProperty('children'))
          this.setDataToEmit(c['children'], resultModel);
        else if (c.hasOwnProperty('layout'))
          this.setDataToEmit(c['layout'], resultModel);
      } else {
        if(c.hasOwnProperty('field')) {
          if(c['type'] != 'SELECT' && c['type'] != 'CHECKBOX' && c['type'] != 'MULTI_SELECT') {
            if(this.model[c['field']])
              resultModel[c['field']] = this.model[c['field']];
          } else {
            if(!c.hasOwnProperty('flat') || !c['flat']) {
              resultModel[c['field']] = this.model[c['field']];
            } else {
              if( c['type'] == 'MULTI_SELECT') {
                if(this.model[c['field']] && Array.isArray(this.model[c['field']])) {
                  resultModel[c['field']] = '';
                  for (let k of this.model[c['field']])
                    resultModel[c['field']] += k + ','
                  if(resultModel[c['field']].length > 0) {
                    resultModel[c['field']] = resultModel[c['field']].substr(0, resultModel[c['field']].length - 1);
                  }
                }
              } else {
                if(this.model[c['field']] && Array.isArray(this.model[c['field']]))
                  for (let k of this.model[c['field']])
                    resultModel[k] = 1;
              }
            }
          }
        }
      }
    }
  }

  objectToString(obj) {
    return JSON.stringify(obj);
  }

  childClicked(e) {
    // for(var k in e.model)
    //   this.model[k]=e.model[k];
    this.onBtnClick.emit({ button: e.button, model: this.model });
  }

  formElementTypes = formElementTypes;
  formElementTypesSubject = new BehaviorSubject(formElementTypes);

  formElementToString(fet) {
    return FormElementType.toString(fet);
  }

  listControls: {} = {};
  listControlsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.listControls);
  regex = /^.+:.+$/;

  multiSelectListChange(e, type, value) {
    console.log(this.listControls[this.formMakerService.selectedColumn['columnName']], type, value)
    if(type == 'edit') {
      let str = value;
      let arr = str.split("\n");
      console.log(arr)
      this.listControls[this.formMakerService.selectedColumn['columnName']] = [];
      for (let a of arr) {
        console.log(a, this.regex.test(a))
        if(a.length >= 1 && this.regex.test(a)) {
          let temp = a.split(":")
          console.log(temp)
          this.listControls[this.formMakerService.selectedColumn['columnName']]
            .push(new SelectableItem(temp[0], temp[1]));
        }
      }
      this.formMakerService.changeSelectedColumnField('list',
        this.listControls[this.formMakerService.selectedColumn['columnName']]);
      this.listControlsSubject.next(this.listControls);
      console.log(this.listControls[this.formMakerService.selectedColumn['columnName']]);
    }
    /*if(type == 'edit') {
      let str = e.target.value;
      let arr = str.split("\n");
      let selectedColumnElements = this.formMakerService.selectedColumn['list'];
      if(!selectedColumnElements) {
        selectedColumnElements = [];
      }
      for (let a of arr) {
        if(a.length >= 1) {
          let temp = a.split("=")
          selectedColumnElements.push(new SelectableItem(temp[0], temp[1]));
        }
      }
      this.formMakerService.changeSelectedColumnField('list', selectedColumnElements);
      console.log(selectedColumnElements)
    }*/
  }

  loadOptionFromQuery(e) {
    console.log(this.listControls[this.formMakerService.selectedColumn['columnName']])
    const dialogRef = this.dialog.open(OptionLoadFromQueryDialogComponent, {
      width: '800px',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed => ', JSON.stringify(result['queryStructure']));
      this.formMakerService.changeSelectedColumnField('list',
        this.listControls[this.formMakerService.selectedColumn['columnName']]);
    });
  }

  selectedType: any;

  selectTypeForSelectedColumn(e) {
    console.log(e, this.selectedType, FormElementType.parse(this.selectedType));
    if(FormElementType.parse(this.selectedType) == FormElementType.MULTI_SELECT ||
      FormElementType.parse(this.selectedType) == FormElementType.CHECKBOX ||
      FormElementType.parse(this.selectedType) == FormElementType.RADIO ||
      FormElementType.parse(this.selectedType) == FormElementType.SELECT) {
      if(this.formMakerService.selectedColumn['list'])
        this.listControls[this.formMakerService.selectedColumn['columnName']] = this.formMakerService.selectedColumn['list'];
      else
        this.listControls[this.formMakerService.selectedColumn['columnName']] = [];
      this.listControlsSubject.next(this.listControls);
    } else {
      // console.log(this.formMakerService.selectedColumn['type'], this.selectedType)
      if(this.formMakerService.selectedColumn['type'] == FormElementType.MULTI_SELECT ||
        this.formMakerService.selectedColumn['type'] == FormElementType.CHECKBOX ||
        this.formMakerService.selectedColumn['type'] == FormElementType.RADIO ||
        this.formMakerService.selectedColumn['type'] == FormElementType.SELECT) {
        delete this.listControls[this.formMakerService.selectedColumn['columnName']];
        this.listControlsSubject.next(this.listControls);
      }
    }
    this.formMakerService.changeSelectedColumnField('type', FormElementType.parse(this.selectedType));
    // if(this.selectedType == 'LAYOUT') {
    //   this.formMakerService.changeSelectedColumnField('children', []);
    // }
  }

  setAttrForSelectedColumn(e, fieldName) {
    console.log(e.target.value)
    this.formMakerService.changeSelectedColumnField(fieldName, e.target.value);
  }

  onControlSelectChange(e, selectedColumn) {
    selectedColumn['type'] = e.value;
    if(e.value === 'layout') {
      // @ts-ignore
      this.column['layout'] = [ {layoutSize: '12', children: []} ];
    }
  }

}
