import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AjaxCallService} from "../../../services/ajax-call.service";
import * as moment from 'jalali-moment';
import {SearchBoxConfigModel, SearchBoxFieldModel} from "../../../components/search-box/search-box.component";
import {BehaviorSubject} from "rxjs";
import {GeneralStateService} from "../../../services/general-state.service";

@Component({
  selector: 'app-general-ledger',
  templateUrl: './general-ledger.component.html',
  styleUrls: ['./general-ledger.component.css'],
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
export class GeneralLedgerComponent implements OnInit {
  // dataSource = ELEMENT_DATA;
  // columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  // fromDateObject = moment('1400-11-22','jYYYY,jMM,jDD');
  // toDateObject = moment('1400-11-22','jYYYY,jMM,jDD');

  expandedElement: null;
  // expandedElement: GeneralLedger | null;

  columnsToDisplay = ['voucherId', 'voucherLineId', 'voucherDate', 'debitAmount', 'creditAmount'];
  dataSource: {}[] = [];
  dataSourceSubject: BehaviorSubject<any> = new BehaviorSubject(this.dataSource);
  // dataSource: GeneralLedger[] = [];

  openFilter: boolean = false;

  config: SearchBoxConfigModel = new SearchBoxConfigModel([
    new SearchBoxFieldModel('empty', 6),
    { type: 'date', title: 'تاریخ از', name: 'fromDate', default: '1400/01/01', size: 3, selectables: null, injectable: null },
    { type: 'date', title: 'تاریخ تا', name: 'toDate', default: '1400/01/01', size: 3, selectables: null, injectable: null },
    { type: 'multi-select', title: 'شعبه', name: 'branches', default: '', size: 6,
      selectables: 'rest:api/modules/general/branch/list', injectable: null },
    { type: 'string', title: 'کل از', name: 'fromGl', default: '', size: 3,
      selectables: null, injectable: 'app-general-code' },
    { type: 'string', title: 'کل تا', name: 'toGl', default: '', size: 3,
      selectables: null, injectable: 'app-general-code' },
    { type: 'select', title: 'ماهیت سطر سند', name: 'docNatureId', default: '', size: 3,
      selectables: 'rest:api/modules/general/nature/list', injectable: null },
    new SearchBoxFieldModel('empty', 3),
    { type: 'textarea', title: 'توضیحات', name: 'description', default: '', size: 6,
      selectables: 'rest:api/modules/general/nature/list', injectable: null },
    { type: 'checkbox', title: 'اسناد قطعی', name: 'definitiveDocuments', default: '', size: 3,
      selectables: null, injectable: null },
    { type: 'checkbox', title: 'با نقل افتتاحیه', name: 'withOpeningQuote', default: '', size: 3,
      selectables: null, injectable: null },
    { type: 'checkbox', title: 'با سند اختتامیه', name: 'withClosingDocument', default: '', size: 3,
      selectables: null, injectable: null },
    { type: 'checkbox', title: 'با بستن عملکرد', name: 'byCloseFunction', default: '', size: 3,
      selectables: null, injectable: null }
  ], 'دفتر کل');

  constructor(private ajaxCallService: AjaxCallService,
              private generalStateService: GeneralStateService) {
    this.generalStateService.title = "دفتر کل"; }

  ngOnInit(): void {
    this.ajaxCallService.read("api/modules/report/general/report/list").then(res => {
      this.dataSource = res['data'];
      this.dataSourceSubject.next(this.dataSource);
      console.log(res['data']);
    }, err => {
      console.log(err)
    })
  }

  search() {
  }

  searchClick(obj) {
    console.log(obj)
    this.ajaxCallService.post("api/modules/report/general/report/list", obj).then(res => {
      this.dataSource = res['data'];
      this.dataSourceSubject.next(this.dataSource);
      console.log(res['data']);
    }, err => {
      console.log(err)
    })
  }
}

export interface GeneralLedger {
  voucherId: number;
  voucherLineId: number;
  voucherDate: string;
  debitAmount: number;
  creditAmount: number;
}
