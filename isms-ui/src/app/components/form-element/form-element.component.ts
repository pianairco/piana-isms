import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {LoadingService} from "../../services/loading.service";
import {MatListOption, MatSelectionList} from "@angular/material/list";
import * as moment from 'jalali-moment';
import {MatInput} from "@angular/material/input";
import {FormControl, Validators} from "@angular/forms";
import {AjaxCallService} from "../../services/ajax-call.service";
import {BehaviorSubject} from "rxjs";
import {MatExpansionPanel} from "@angular/material/expansion";
import {MatDialog} from "@angular/material/dialog";
import {MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styleUrls: ['./form-element.component.css']
})
export class FormElementComponent implements OnInit {
  formElementTypes = FormElementType;
  @Input() public type: any;
  @Input() public layout: Layout;
  @Input() public numeric: boolean;
  @Input() title: string;
  @Input() list: SelectableItem[];
  listSubject: BehaviorSubject<any> = new BehaviorSubject<SelectableItem[]>(null);
  @Input() flat: boolean;
  @Input() hasAll: boolean;
  @Input() hasNone: boolean;
  @Input() height: string;
  @Input() maxLength: string;
  @Input() minLength: string;
  @Input() required: boolean;
  @Input() mask: string;
  @Input() placeholder: string;
  @Input() value: any;
  @Input() uploaderFormats: any;
  @Input() maxWidth: any;
  @Input() maxHeight: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  temp: any;
  datePickerConfig: {
    drops: string,
    format: string,
    locale: string
  } = {
    drops: 'down',
    format: 'YYYY/MM/DD-HH:mm:ss',
    locale: 'fa'
  };
  objValue: any = null;
  imgSubject = new BehaviorSubject(this.objValue);
  initialized = false;
  // public customPatterns = { '0': { pattern: new RegExp('\[0-9\]')} };
  @ViewChild('matSelectionListCtrl') ctrl: MatSelectionList;
  @ViewChild('mep') mep: MatExpansionPanel;
  @ViewChild('matSelectionCtrl') selectCtrl: MatSelectionList;
  // @ViewChild('txtCtrl') txtCtrl: MatInput;
  @ViewChild(MatInput) matInput: MatInput;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private notificationService: NotificationService,
              private ajaxCallService: AjaxCallService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.listSubject.subscribe(res => {
      if(this.type == 8) {
        this.initSelect()
      } else if(this.type == 6) {
        console.log(this.value)
        this.initCheckbox();
      }
    });
    if (this.value) {
      this.objValue = this.value;
    }
    if(this.list) {
      this.listSubject.next(this.list);
    }
    if(this.layout) {
      this.type = this.layout.type;
      this.required = this.layout.required;
      this.maxLength = '' + this.layout.maxLength;
      this.minLength = '' + this.layout.minLength;
      this.numeric = this.layout.numeric;
      this.hasAll = this.layout.hasAll;
      this.hasNone = this.layout.hasNone;
      this.mask = this.layout.mask;
      this.placeholder = this.layout.placeholder;
      this.title = this.layout.title;

      if (this.layout.list) {
        console.log(this.layout.list)
        this.list = this.layout.list;
        this.listSubject.next(this.list);
      } else if (this.layout.listApi) {
        console.log(this.layout.listApi)
        this.ajaxCallService.read(this.layout.listApi).then(res => {
          console.log(res)
          this.list = res.data;
          this.listSubject.next(this.list);
        }, err => {
          console.log(err)
        })
      }
      if(this.layout.type == 'UPLOADER') {
        this.uploaderFormats = this.layout['formats'];
        this.maxWidth = this.layout['max-width'];
        this.maxHeight = this.layout['max-height'];
      }
    }

    /*if (this.list)
      console.log(JSON.stringify(this.list))*/
    if(typeof this.type === 'string') {
      this.type = FormElementType.parse(this.type);
    }
    if (this.type == FormElementType.CHECKBOX ||
      this.type == FormElementType.SELECT) {
      this.objValue = [];
    }
  }

  ngAfterViewInit() {
    // console.log(this.matInput)
    // if(this.matInput) {
    //   this.matInput.required = true
    // }
  }

  _toggleImageExpand(e) {
    console.log("a1")
    if(this.objValue) {
      this.menuTrigger.openMenu();
      this.mep.toggle();
    } else {
      e.stopPropagation();
    }
  }

  onSelectedFileDelete() {
    console.log("a2")
    this.objValue = null;
    this.imgSubject.next(this.objValue);
  }

  onUploadClicked(file) {
  }

  onSelectedFilesChanged(event) {
    console.log(event, event[0])
    if (event && event[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        console.log(event, event.target.result)
        this.objValue = event.target.result;
        this.valueChange.emit(this.objValue);
        this.imgSubject.next(this.objValue);
        this.mep.close();
        console.log(this.objValue)
      }
    }
  }

  isRequired() {
    if(this.required && !this.objValue) {
      return true;
    }
    return false;
  }

  numberOnly(event): boolean {
    if(!this.numeric)
      return true;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getModeOfDate(type) {
    if(type == this.formElementTypes.JALALI_DATE || type == this.formElementTypes.MILADI_DATE)
      return 'day';
    else
      return 'daytime'
  }

  onTextChange(e) {
    console.log(e.target.value)
    if(this.numeric)
      this.valueChange.emit(parseInt(e.target.value));
    else
      this.valueChange.emit(e.target.value);
  }

  onNumberChange(e) {
    console.log(e.target.value)
    this.valueChange.emit(e.target.value);
  }

  change(e) {
    console.log('e', e)
    for(let v of this.list) {
      this.objValue.push(v);
    }
  }

  initCheckbox() {
    console.log(this.value)
    this.objValue.length = 0;
    if (Array.isArray(this.value)) {
      this.value.forEach(v => {
        this.objValue.push(v);
      });
    }
  }

  onCheckboxChange(change) {
    console.log(change, change.checked, change.source.value);
    if(change.checked) {
      this.objValue.push(change.source.value);
    } else {
      let index: number = this.objValue.indexOf(change.source.value);
      if (index !== -1) {
        this.objValue.splice(index, 1);
      }
    }
    this.valueChange.emit(this.objValue);
  }

  initSelect() {
    this.objValue = [];
    if(this.value == -1) {
      this.objValue.length = 0;
      this.temp = -1;
      for(let item of this.list)
        this.objValue.push(item.value);
    } else if(this.value == -2) {
      this.temp = -2;
      this.objValue.length = 0;
    } else if(Array.isArray(this.value)) {
      this.objValue.length = 0;
      let i = 0;
      this.value.forEach(v => {
        i++;
        this.objValue.push(v);
      });
      if(i == 0)
        this.temp = -2;
      else if(i == this.list.length)
        this.temp = -1;
      else {
        this.temp = this.objValue[0];
      }
    } else {
      this.objValue.length = 0;
      this.objValue.push(this.value);
    }
  }

  onSelectChange(e) {
    // console.log(e, e.value)
    // console.log(this.selectCtrl.options);
    // this.selectCtrl.options.forEach((item) => console.log(item));
    this.objValue = [];
    if(e.value == -1) {
      this.objValue.length = 0;
      for(let item of this.list)
        this.objValue.push(item.value);
    } else if(e.value == -2) {
      this.objValue.length = 0;
    } else {
      this.objValue.length = 0;
      this.objValue.push(e.value);
    }
    // console.log(this.list, this.temp, this.objValue, this.value)
    this.valueChange.emit(this.objValue);
  }

  onMultiSelectOptionChange(change) {
    // console.log(change.option.value, change.option.selected);
    if(change.option.value == -1) {
      if(change.option.selected == true) {
        this.ctrl.options.forEach((item: MatListOption) => item.selected = true);
        this.objValue.length = 0;
        for(let item of this.list)
          this.objValue.push(item.value);
      } else {
        this.ctrl.options.forEach((item: MatListOption) => item.selected = false);
        this.objValue.length = 0;
      }
    } else {
      this.objValue.length = 0;
      let i = 0;
      this.ctrl.options.forEach((item: MatListOption) =>  {
        if(item.value != -1 && item.selected == true) {
          i++;
          this.objValue.push(item.value);
        }
      });
      // console.log(this.ctrl.options.length)
      if(i < this.ctrl.options.length - 1) {
        this.ctrl.options.forEach((item: MatListOption) =>  {
          if(item.value == -1)
            item.selected = false;
        });
      } else if(i == this.ctrl.options.length - 1) {
        this.ctrl.options.forEach((item: MatListOption) =>  {
          if(item.value == -1)
            item.selected = true;
        });
      }
    }
    this.valueChange.emit(this.objValue);
  }

  onChangeDate(event) {
    // console.log(event, typeof event, this.objValue)
    if(!this.objValue) {
      this.temp = null
      this.valueChange.emit(this.objValue);
    } else {
      let m = moment(this.objValue, 'jYYYY/jMM/jDD');
      let t = m.format('jYYYY/jMM/jDD');
      if(m.format('jYYYY/jMM/jDD') != "Invalid date") {
        this.changeDate(this.formElementTypes.JALALI_DATE, m);
      }
    }
  }

  onPasteDate(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    let m = moment(pastedText, 'jYYYY/jMM/jDD');
    // console.log(m.format('jYYYY/jMM/jDD'))
    // console.log(m.format('jYYYY/jMM/jDD [is] YYYY/MM/DD'))
    this.temp = m;
  }

  changeDate(type, e) {
    if (e) {
      let date = null;
      if (type == this.formElementTypes.JALALI_DATE) {
        date = e.locale('fa').format('yyyy/MM/DD')
      } else if (type == this.formElementTypes.JALALI_DATE_TIME) {
        date = e.locale('fa').format('yyyy/MM/DD-HH:mm:ss')
      } else if (type == this.formElementTypes.MILADI_DATE) {
        date = e.locale('en').format('yyyy/MM/DD')
      } else if (type == this.formElementTypes.MILADI_DATE_TIME) {
        date = e.locale('en').format('yyyy/MM/DD-HH:mm:ss')
      }
      this.objValue = date;
      this.temp = e;
      this.valueChange.emit(date);
    }
  }
}

export class SelectableItem {
  title: string;
  value: any;

  constructor(title, value) {
    this.title = title;
    this.value = value;
  }
}

export enum FormElementType {
  NONE,
  TEXT,
  NUMBER,
  MILADI_DATE,
  MILADI_DATE_TIME,
  JALALI_DATE,
  JALALI_DATE_TIME,
  CHECKBOX,
  RADIO,
  SELECT,
  MULTI_SELECT,
  TEXTAREA,
  UPLOADER,
  BUTTON,
  LAYOUT
}

export namespace FormElementType {
  export function parse(aType: string): FormElementType {
    console.log(typeof aType, aType);
    let type = aType;
    if(typeof aType == 'object')
      type = aType[0];
    console.log(typeof type, type, aType)
    if(type.toUpperCase() == 'NONE')
      return FormElementType.NONE;
    if(type.toUpperCase() == 'TEXT')
      return FormElementType.TEXT;
    if(type.toUpperCase() == 'NUMBER')
      return FormElementType.NUMBER;
    if(type.toUpperCase() == 'MILADI_DATE')
      return FormElementType.MILADI_DATE;
    if(type.toUpperCase() == 'MILADI_DATE_TIME')
      return FormElementType.MILADI_DATE_TIME;
    if(type.toUpperCase() == 'JALALI_DATE')
      return FormElementType.JALALI_DATE;
    if(type.toUpperCase() == 'JALALI_DATE_TIME')
      return FormElementType.JALALI_DATE_TIME;
    if(type.toUpperCase() == 'CHECKBOX')
      return FormElementType.CHECKBOX;
    if(type.toUpperCase() == 'RADIO')
      return FormElementType.RADIO;
    if(type.toUpperCase() == 'SELECT')
      return FormElementType.SELECT;
    if(type.toUpperCase() == 'MULTI_SELECT')
      return FormElementType.MULTI_SELECT;
    if(type.toUpperCase() == 'TEXTAREA')
      return FormElementType.TEXTAREA;
    if(type.toUpperCase() == 'UPLOADER')
      return FormElementType.UPLOADER;
    if(type.toUpperCase() == 'BUTTON')
      return FormElementType.BUTTON;
    if(type.toUpperCase() == 'LAYOUT')
      return FormElementType.LAYOUT;
  }

  export function toString(type: FormElementType): string {
    if(type == FormElementType.NONE)
      return 'NONE';
    if(type == FormElementType.TEXT)
      return 'TEXT';
    if(type == FormElementType.NUMBER)
      return 'NUMBER';
    if(type == FormElementType.MILADI_DATE)
      return 'MILADI_DATE';
    if(type == FormElementType.MILADI_DATE_TIME)
      return 'MILADI_DATE_TIME';
    if(type == FormElementType.JALALI_DATE)
      return 'JALALI_DATE';
    if(type == FormElementType.JALALI_DATE_TIME)
      return 'JALALI_DATE_TIME';
    if(type == FormElementType.CHECKBOX)
      return 'CHECKBOX';
    if(type == FormElementType.RADIO)
      return 'RADIO';
    if(type == FormElementType.SELECT)
      return 'SELECT';
    if(type == FormElementType.MULTI_SELECT)
      return 'MULTI_SELECT';
    if(type == FormElementType.TEXTAREA)
      return 'TEXTAREA';
    if(type == FormElementType.UPLOADER)
      return 'UPLOADER';
    if(type == FormElementType.BUTTON)
      return 'BUTTON';
    if(type == FormElementType.LAYOUT)
      return 'LAYOUT';
  }
}

export const formElementTypes: FormElementType[] = [
  FormElementType.NONE,
  FormElementType.TEXT,
  FormElementType.NUMBER,
  FormElementType.MILADI_DATE,
  FormElementType.MILADI_DATE_TIME,
  FormElementType.JALALI_DATE,
  FormElementType.JALALI_DATE_TIME,
  FormElementType.CHECKBOX,
  FormElementType.RADIO,
  FormElementType.SELECT,
  FormElementType.MULTI_SELECT,
  FormElementType.TEXTAREA,
  FormElementType.UPLOADER,
  FormElementType.BUTTON,
  FormElementType.LAYOUT
];

export class Layout {
  layoutSize: string;
  type: string;
  value: any;
  class: string;
  layout: Layout[];
  children: Layout[];
  field: string;
  title: string;
  numeric: boolean;
  list: [];
  listApi: string;
  height: string;
  required: boolean;
  hasAll: boolean;
  hasNone: boolean;
  left: string;
  minLength: number;
  maxLength: number;
  mask: string;
  placeholder: string;
}
