import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

import * as moment from 'jalali-moment';
import {BehaviorSubject} from "rxjs";
import {ColumnDef, DataGridComponent} from "../data-grid/data-grid.component";
import {AjaxCallService} from "../../services/ajax-call.service";
import {GeneralStateService} from "../../services/general-state.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-common-form',
  templateUrl: './common-form.component.html',
  styleUrls: ['./common-form.component.css'],
  animations: [],
})
export class CommonFormComponent implements OnInit, AfterViewInit {
  @Input() url: string;
  processedUrl: string;

  config: object = null;
  configSubject: BehaviorSubject<object> = new BehaviorSubject<object>(this.config);

  values: object = null;
  valuesSubject: BehaviorSubject<object> = new BehaviorSubject<object>(this.values);

  model = {
  };

  constructor(private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private ajaxCallService: AjaxCallService,
              private generalStateService: GeneralStateService) {
    this.generalStateService.title = "";
  }

  ngAfterViewInit(): void {

  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.url = params['url'];
      for (let k in this.model) {
          delete this.model[k];
      }

      /*try {
        this.processedUrl = this.url.replace(/\*!/g, "/");
        /!*this.config = null;
        this.configSubject.next(this.config);*!/
        this.ajaxCallService.post(this.processedUrl + '/values', {}).then(res => {
          console.log(res);
          if(res['data']['code'] == 0) {
            if(res['data']['data']) {
              this.values = res['data']['data'];
              this.valuesSubject.next(this.values);
            }
          }
        }, err => {

        });
      } catch (e) {
        console.log(e);
      }*/
      try {
        this.processedUrl = this.url.replace(/\*/g, "/");
        this.config = null;
        this.configSubject.next(this.config);
        this.ajaxCallService.post(this.processedUrl + '/config', {}).then(res => {
          console.log(res);
          if(res['data']['code'] == 0) {
            this.config = res['data']['data'];

            // this.model = this.config['layoutValues'];
            // console.log(this.model)
            this.setValue(this.config['layout']);
            console.log(this.model)
            this.configSubject.next(this.config);
            this.generalStateService.title = this.config['title'];
          }
        }, err => {

        });
      } catch (e) {
        console.log(e);
      }
    });
  }

  setValue(layout) {
    console.log(layout)
    for (let c of layout) {
      console.log(c)
      if (!c.hasOwnProperty('type') || c['type'] == 'layout') {
        if (c.hasOwnProperty('children'))
          this.setValue(c['children']);
        else if (c.hasOwnProperty('layout'))
          this.setValue(c['layout']);
      } else {
        if(c.hasOwnProperty('field') && c.hasOwnProperty('value')) {
          this.model[c['field']] = c['value'];
        }
      }
    }
  }

  btnClick(e) {
  }

  search() {
  }
}
