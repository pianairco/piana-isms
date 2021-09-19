import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

import * as moment from 'jalali-moment';
import {BehaviorSubject} from "rxjs";
import {ColumnDef, DataGridComponent} from "../data-grid/data-grid.component";
import {AjaxCallService} from "../../services/ajax-call.service";
import {GeneralStateService} from "../../services/general-state.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-common-search',
  templateUrl: './common-search.component.html',
  styleUrls: ['./common-search.component.css'],
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
export class CommonSearchComponent implements OnInit, AfterViewInit {
  @Input() url: string;
  processedUrl: string;

  expandedElement: null;

  @ViewChild('dataGrid') dataGrid: DataGridComponent;

  config: object = null;
  configSubject: BehaviorSubject<object> = new BehaviorSubject<object>(this.config);

  openFilter: boolean = false;

  model = {
    "x_page_size": 30
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
        if(k != 'x_page_size' && k != 'x_from_row' && k != 'x_to_row')
          delete this.model[k];
      }

      console.log(this.dataGrid)
      if(this.dataGrid)
        this.dataGrid.reset();

      try {
        this.processedUrl = this.url.replace(/\*/g, "/");
        this.config = null;
        this.configSubject.next(this.config);
        this.ajaxCallService.post(this.processedUrl + '/config', {}).then(res => {
          console.log(res);
          if(res['data']['code'] == 0) {
            this.config = res['data']['data'];

            // this.setValue(this.config['layout']);
            this.model = this.config['layoutValues'];

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
    console.log(e.button, e.model, this.model);
    this.dataGrid.fetch(e.model);
    this.openFilter = false;
  }

  search() {
  }
}
