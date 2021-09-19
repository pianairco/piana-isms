import { Component, OnInit } from '@angular/core';
import {SearchBoxConfigModel, SearchBoxFieldModel} from "../../../components/search-box/search-box.component";
import {TableColumnDefModel} from "../../../components/search-view/search-view.component";
import {GeneralStateService} from "../../../services/general-state.service";

@Component({
  selector: 'app-subsidiary-ledger',
  templateUrl: './subsidiary-ledger.component.html',
  styleUrls: ['./subsidiary-ledger.component.css']
})
export class SubsidiaryLedgerComponent implements OnInit {


  columnsToDisplay = ['voucherId', 'voucherLineId', 'voucherDate', 'debitAmount', 'creditAmount'];

  columnsDef: TableColumnDefModel[] = [
    { name: 'id', title: 'شناسه', type: 'number' },
    { name:'number', title: 'شماره', type: 'number' },
    { name: 'name', title: 'نام', type: 'number' },
    { name: 'active', title: 'فعال بودن', type: 'boolean' }
  ];

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
  ], 'دفتر معین');

  constructor(private generalStateService: GeneralStateService) {
    this.generalStateService.title = "دفتر معین";
  }

  ngOnInit(): void {
  }

}
