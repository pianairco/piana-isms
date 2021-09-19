import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {LoadingService} from "../../services/loading.service";
import {MatListOption, MatSelectionList} from "@angular/material/list";
import {AjaxCallService} from "../../services/ajax-call.service";
import {BehaviorSubject} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {SpinnerDialogComponent} from "../spinner-dialog/spinner-dialog.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";

declare var $: any;

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class DataGridComponent implements OnInit {
  @Input() columnDefs: ColumnDef[];
  @Input() public selectable: boolean;
  @Input() public selectableField: string;
  @Input() loadOnInit: boolean;
  @Input() model: object;
  @Input() pageSizeOptions: number[];
  @Input() dataUrl: string;

  expandedElement: object | null = null;
  selectedRowIndex = -1;

  currentPageIndex = 0;
  currentPageSize = 0;

  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("endPaginator") endPaginator: MatPaginator;

  allRows: number = 0;
  lastParam: object = null;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  dataSourceSubject: BehaviorSubject<any> = new BehaviorSubject(this.dataSource);

  constructor(private route: ActivatedRoute,
              public dialog: MatDialog,
              private loadingService: LoadingService,
              private notificationService: NotificationService,
              private changeDetectorRefs: ChangeDetectorRef,
              private ajaxCallService: AjaxCallService) {
    this.dataSourceSubject.subscribe(e => {
      console.log(e)
      if(e.length >= 0) {
        setTimeout(() => {
          $('.mat-paginator-page-size-label').text('تعداد رکورد در صفحه : ');
          $('.mat-paginator-range-label').text(this.model['x_from_row']  + '-' + this.model['x_to_row'] + ' از ' + this.allRows);
        }, 1);
      }
    });
  }

  ngOnInit(): void {
    // console.log(this.columnDefs);
    this.displayedColumns.length = 0;
    this.columnDefs.forEach(c => {
      this.displayedColumns.push(c.name);
    });
    this.displayedColumns.push("select");
    // console.log(this.displayedColumns);

    this.currentPageSize = this.pageSizeOptions[0]
  }

  ngAfterViewInit() {
    this.setPage(this.paginator.pageIndex, this.paginator.pageSize);
    if(this.loadOnInit) {
      this.fetch(this.model);
    }

    $('.mat-paginator-page-size-label').text('تعداد رکورد در صفحه : ');
    $('.mat-paginator-range-label').text('0-0 از 0');

  }

  highlight(row){
    console.log(row, row.id)
    if(this.selectedRowIndex)
      this.selectedRowIndex = 0;
    else {
      this.selectedRowIndex = row['ROW_NUM'];
    }
    this.expandedElement = this.expandedElement === row ? null : row;
    // console.log(this.expandedElement)
    // this.selectedRowIndex = row['ROW_NUM'];
  }

  public reset() {
    this.dataSource.data = [];
    this.dataSourceSubject.next(this.dataSource);
    // this.changeDetectorRefs.detectChanges();
  }

  change(e, src: MatPaginator, dst: MatPaginator) {
    console.log(e, e.pageSize)
    this.setPage(e.pageIndex, e.pageSize);
    if(dst) {
      dst.pageSize = src.pageSize;
      dst.pageIndex = src.pageIndex;
    }
    if(e.pageIndex != this.currentPageIndex) {
      this.fetch(this.model);
      this.currentPageIndex =e.pageIndex;
    }
  }

  setPage(pageIndex, pageSize) {
    this.model['x_page_size'] = pageSize;
    this.model['x_from_row'] = pageIndex * pageSize + 1;
    this.model['x_to_row'] = (pageIndex + 1) * pageSize;
  }

  public fetch(params: object) {
    // console.log(this.model)
    params['x_from_row'] = this.model['x_from_row'];
    params['x_to_row'] = this.model['x_to_row'];
    if(this.sort.direction != 'none') {
      console.log(this.sort['columnName'], this.sort['direction'])
      params['x_sort_name'] = this.sort['columnName'];
      params['x_sort_direction'] = this.sort['direction'];
    } else {
      delete params['x_sort_name']
      delete params['x_sort_direction']
    }
    const dialogRef = this.dialog.open(SpinnerDialogComponent, { disableClose: true, panelClass: 'spinner-panel', backdropClass: 'spinner-backdrop' });
    this.ajaxCallService.post(this.dataUrl, params).then(res => {
      dialogRef.close();
      this.lastParam = params;
      if(res['data']['code'] == 0) {
        this.dataSource.data = res['data']['data'].records;
        this.allRows = res['data']['data'].count
        this.dataSourceSubject.next(this.dataSource.data);
        $('.mat-paginator-range-label').text(this.model['x_from_row']  + '-' + this.model['x_to_row'] + ' از ' + this.allRows);
        console.log(res['data']['data']);
      }
    }, err => {
      dialogRef.close();
      console.log(err)
    })
  }

  sort: {
    columnName: string;
    direction: string;
  } = {
    columnName: null,
    direction: 'none'
  }

  toggleSort(columnName: string) : string {
    if (this.sort.columnName != columnName) {
      this.sort.columnName = columnName;
      this.sort.direction = 'asc';
    } else {
      if(this.sort.direction == 'none')
        this.sort.direction = 'asc';
      else if(this.sort.direction == 'asc')
        this.sort.direction = 'desc';
      else if(this.sort.direction == 'desc')
        this.sort.direction = 'none';
    }
    return this.sort.direction;
  }

  fetchBySort(columnDef: ColumnDef) {
    let direction: string = this.toggleSort(columnDef.name);
    this.fetch(this.model);
  }

  selection = new SelectionModel<any>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    console.log("xxxxxx")
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}

export class SearchModel {
  records: [];
  count: number;
}

export class ColumnDef {
  name: string;
  pipe: string;
  title: string;
  sortable: boolean;

  constructor(name: string, title: string, sortable: boolean) {
    this.name = name;
    this.title = title;
    this.sortable = sortable;
  }
}

