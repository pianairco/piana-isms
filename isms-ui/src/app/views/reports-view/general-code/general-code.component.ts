import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AjaxCallService} from "../../../services/ajax-call.service";
import * as moment from 'jalali-moment';
import {SearchBoxConfigModel, SearchBoxFieldModel} from "../../../components/search-box/search-box.component";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'app-general-code',
  templateUrl: './general-code.component.html',
  styleUrls: ['./general-code.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('filterExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', padding: '0px'})),
      state('expanded', style({height: '*', padding: '12px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out',
              style({ height: '*', opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: '*', opacity: 1 }),
            animate('1s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ],
})
export class GeneralCodeComponent implements OnInit {
  // dataSource = ELEMENT_DATA;
  // columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  // fromDateObject = moment('1400-11-22','jYYYY,jMM,jDD');
  // toDateObject = moment('1400-11-22','jYYYY,jMM,jDD');
  // @ts-ignore
  @Output() selectEvent = new EventEmitter<ResponseData>();

  expandedElement: GeneralCode | null;

  columnsDef = {
    'id': { 'title': 'شناسه', 'type': 'number' },
    'number': { 'title': 'شماره', 'type': 'number' },
    'name': { 'title': 'نام', 'type': 'number' },
    'active': { 'title': 'فعال بودن', 'type': 'boolean' }
  };

  columnsToDisplay = ['id', 'number', 'name', 'active'];
  dataSource: GeneralCode[] = [];

  selection = new SelectionModel<GeneralCode>(true, []);

  openFilter: boolean = false;

  config: SearchBoxConfigModel = new SearchBoxConfigModel([
    { type: 'select', title: 'ماهیت سطر سند', name: 'docNatureId', default: '', size: 3,
      selectables: 'rest:api/modules/general/nature/list', injectable: null },
    new SearchBoxFieldModel('empty', 9)
  ], 'دفتر کل');

  constructor(private ajaxCallService: AjaxCallService) {
    console.log(this.columnsDef['id'])
  }

  ngOnInit(): void {
    this.ajaxCallService.read("api/modules/report/general/code/list").then(res => {
      this.dataSource = res['data'];
      console.log(res['data']);
    }, err => {
      console.log(err)
    })
  }

  selectItem(value: GeneralCode) {
    // console.log(value);
    this.selectEvent.emit({data: value});
  }
}

export interface GeneralCode {
  id: number;
  number: number;
  name: string;
  active: boolean;
  natureId: number;
  groupId: number;
}

export interface ResponseData {
  data: any;
}
