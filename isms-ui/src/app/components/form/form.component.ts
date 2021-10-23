import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {LoadingService} from "../../services/loading.service";
import {MatListOption, MatSelectionList} from "@angular/material/list";
import * as moment from 'jalali-moment';
import {MatInput} from "@angular/material/input";
import {FormControl, Validators} from "@angular/forms";
import {Layout} from "../form-element/form-element.component";
import axios from "axios";
import {AjaxCallService} from "../../services/ajax-call.service";
import {MatDialog} from "@angular/material/dialog";
import {CommonDialogComponent} from "../dialog/common-dialog/common-dialog.component";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Input() public layout: Layout[];
  @Input() value: object;
  @Input() hasParent: boolean;
  @Output() valueChange: EventEmitter<object> = new EventEmitter<object>();
  @Output() onBtnClick: EventEmitter<object> = new EventEmitter<object>();
  @Input() model: any;
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  list = {};
  initialized = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ajaxCall: AjaxCallService,
              private loadingService: LoadingService,
              public dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    console.log("FormComponent", this.model)
  }

  ngAfterViewInit() {
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
    let strings = this.checkForRequired(this.layout);
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

  childClicked(e) {
    // for(var k in e.model)
    //   this.model[k]=e.model[k];
    this.onBtnClick.emit({ button: e.button, model: this.model });
  }
}
