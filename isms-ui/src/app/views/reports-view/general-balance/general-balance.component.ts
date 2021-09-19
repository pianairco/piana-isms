import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AjaxCallService} from "../../../services/ajax-call.service";
import * as moment from 'jalali-moment';
import {SearchBoxConfigModel, SearchBoxFieldModel} from "../../../components/search-box/search-box.component";
import {BehaviorSubject} from "rxjs";
import {FormElementType, SelectableItem} from "../../../components/form-element/form-element.component";
import {ColumnDef} from "../../../components/data-grid/data-grid.component";
import {GeneralStateService} from "../../../services/general-state.service";

@Component({
  selector: 'app-general-balance',
  templateUrl: './general-balance.component.html',
  styleUrls: ['./general-balance.component.css'],
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
export class GeneralBalanceComponent implements OnInit, AfterViewInit {
  expandedElement: null;
  formElementTypes = FormElementType;
  // expandedElement: GeneralLedger | null;

  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;
  // dataSourceSubject: BehaviorSubject<any> = new BehaviorSubject(this.dataSource);
  // dataSource: GeneralLedger[] = [];

  layout: [
    {
      layoutSize: '12'
      type: 'layout',
      class: 'align-items-center'
      children: [
        { layoutSize: '6', type: 'MULTI_SELECT', field: 'x_branches', title: 'شعبه', listApi: 'branches', height: '200' },
        {
          layoutSize: '6', type: 'layout',
          children: [
            { layoutSize: '6', type: 'JALALI_DATE', field: 'x_from_date', title: 'تاریخ از', required: true },
            { layoutSize: '6', type: 'JALALI_DATE', field: 'x_to_date', title: 'تاریخ تا', required: true },
            { layoutSize: '6', type: 'TEXT', numeric: true, field: 'x_from_voucher_no', title: 'شماره سند از', required: false },
            { layoutSize: '6', type: 'TEXT', numeric: true, field: 'x_to_voucher_no', title: 'شماره سند تا', required: false }
          ]
        },
        { layoutSize: '3', type: 'TEXT', numeric: true, field: 'x_from_gl_number', title: 'کل از', required: false, minLength:1, maxLength: 4 },
        { layoutSize: '3', type: 'TEXT', numeric: true, field: 'x_to_gl_number', title: 'کل تا', required: false, minLength:1, maxLength: 4 },
        { layoutSize: '3', type: 'TEXT', numeric: true, field: 'x_from_voucher_temp_num', title: 'شماره موقت از', required: false, minLength:1, maxLength: 10 },
        { layoutSize: '3', type: 'TEXT', numeric: true, field: 'x_to_voucher_temp_num', title: 'شماره موقت تا', required: false, minLength:1, maxLength: 10 },
        { layoutSize: '3', type: 'TEXT', numeric: true, field: 'x_from_remainder', title: 'مانده از', required: false, minLength: 1, maxLength: 18 },
        { layoutSize: '3', type: 'TEXT', numeric: true, field: 'x_to_remainder', title: 'مانده تا', required: false, minLength: 1, maxLength: 18 },
        { layoutSize: '6', type: 'SELECT', field: 'x_remainder', title: 'مانده', required: true, hasAll: true, hasNone: true },
        { layoutSize: '12', type: 'CHECKBOX', field: 'x_options', title: 'انتخاب ویژگی', listApi: 'voucher-options', height: '200' },
        { layoutSize: '12', type: 'CHECKBOX', field: 'x_fiscal_years', title: 'سال مالی', listApi: 'fiscal-years-options', height: '200' },
        { layoutSize: '3', left: '9', type: 'TEXT', numeric: true, field: 'x_page_size', title: 'سال مالی', required: true },
      ]
    },
    {
      layoutSize: '12',
      type: 'layout',
      class: 'justify-content-between align-items-center'
      children: [
        { layoutSize: '2', left:' 10', type: 'btn', title: 'جستجو' },
      ]
    }
  ];

  requiredControls = [
    'x_from_date', 'x_to_date', 'x_page_size'
  ];

  columnDefs: ColumnDef[] = [
    new ColumnDef('REF_NUMBER', 'کل', false),
    new ColumnDef('ACCOUNT_NAME', 'عنوان حساب', false),
    new ColumnDef('PERIOD_DEBIT', 'گردش بدهکار', false),
    new ColumnDef('PERIOD_CREDIT', 'گردش بستانکار', true),
    new ColumnDef('TOTAL_DEBIT', 'مانده بدهکار', false),
    new ColumnDef('TOTAL_CREDIT', 'مانده بستانکار', false)
  ];

  openFilter: boolean = false;

  branches = [
    new SelectableItem('اینترنتی', -17)
  ]

  options = [
    new SelectableItem('بدون معاملات آخر', "x_without_last_purchases"),
    new SelectableItem('بدون انتقالی تعدیلی', "x_without_regulated_transfer"),
    new SelectableItem('شش ستونی', "x_six_column_mode")
  ]

  fiscalYears = [
    new SelectableItem('با نقل افتتاحیه', "x_with_opening_year_voucher"),
    new SelectableItem('با بستن عملکرد', "x_with_closing_account_voucher"),
    new SelectableItem('با سند اختتامیه', "x_with_closing_year_voucher")
  ]

  model = {
    "x_page_size": 30
  };

  remainders = [
    new SelectableItem('مانده دار', 'x_has_remain'),
    new SelectableItem('بدهکار', 'x_debit'),
    new SelectableItem('بستانکار', 'x_credit')
  ];

  /*elementMap = {
    'fromDate': { 'title': 'تاریخ از', 'type': FormElementType.JALALI_DATE, 'value': 'fromDate', 'placeholder': 'تاریخ از' },
    'toDate': { 'title': 'تاریخ تا', 'type': FormElementType.JALALI_DATE, 'value': 'toDate', 'placeholder': 'تاریخ تا' },
    'startGlNumber': { 'title': 'کل از', 'type': FormElementType.NUMBER, 'value': 'fromGL' },
    'endGlNumber': { 'title': 'کل از', 'type': FormElementType.NUMBER, 'value': 'fromGL' },
    'branch': { 'title': 'شعبه', 'type': FormElementType.TEXT, 'value': 'branch' },
  }*/

  constructor(private cdr: ChangeDetectorRef,
              private ajaxCallService: AjaxCallService,
              private generalStateService: GeneralStateService) {
    this.generalStateService.title = "تراز آزمایشی کل";
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    // this.ajaxCallService.read("api/modules/report/general/report/list").then(res => {
    //   this.dataSource = res['data'];
    //   this.dataSourceSubject.next(this.dataSource);
    //   console.log(res['data']);
    // }, err => {
    //   console.log(err)
    // })
  }

  search() {
  }

  ok() {
    console.log(JSON.stringify(this.model))
  }

  searchClick(obj) {
    console.log(obj)
    this.ajaxCallService.post("api/modules/report/general/balance/report/list", obj).then(res => {
      // this.dataSource = res['data'];
      // this.dataSourceSubject.next(this.dataSource);
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
