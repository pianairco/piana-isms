import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SelectionModel} from "@angular/cdk/collections";
import {SearchBoxConfigModel} from "../search-box/search-box.component";
import {AjaxCallService} from "../../services/ajax-call.service";

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css'],
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
export class SearchViewComponent implements OnInit {
  // dataSource = ELEMENT_DATA;
  // columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  // fromDateObject = moment('1400-11-22','jYYYY,jMM,jDD');
  // toDateObject = moment('1400-11-22','jYYYY,jMM,jDD');
  // @ts-ignore
  @Output()
  selectEvent = new EventEmitter<ResponseData>();

  // @Input()
  expandedElement: object = null;

  @Input()
  columnsDef: TableColumnDefModel[];

  @Input()
  columnsToDisplay: string[] = null;

  // @Input()
  dataSource: {}[] = [];

  selection = new SelectionModel<any>(true, []);

  openFilter: boolean = false;

  @Input()
  config: SearchBoxConfigModel = null;

  // searchBoxConfig: SearchBoxConfigModel = null;

  @Input()
  serviceUrl: string;
  constructor(private ajaxCallService: AjaxCallService) { }

  ngOnInit(): void {
    // this.searchBoxConfig = JSON.parse(JSON.stringify(this.config));
    this.ajaxCallService.read(this.serviceUrl).then(res => {
      this.dataSource = res['data'];
      console.log(res['data']);
    }, err => {
      console.log(err)
    })
  }

  selectItem(value: any) {
    // console.log(value);
    this.selectEvent.emit({data: value});
  }

  getColumnTitle(name) {
    for (let def of this.columnsDef) {
      if(def.name == name)
        return def.title;
    }
    return 'unknown';
  }

  getColumnType(name) {
    for (let def of this.columnsDef) {
      if(def.name == name)
        return def.type;
    }
    return 'unknown';
  }
}

export interface ResponseData {
  data: any;
}

export class TableColumnDefModel {
  name: string;
  title: string;
  type: string;
}
