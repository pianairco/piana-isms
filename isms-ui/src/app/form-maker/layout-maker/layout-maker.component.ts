import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Layout} from "../../components/form-element/form-element.component";
import {FormMakerService} from "../form-maker.service";
import {ColumnSettingDialogComponent} from "../column-setting-dialog/column-setting-dialog.component";
import {ControlSettingDialogComponent} from "../control-setting-dialog/control-setting-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-layout-maker',
  templateUrl: './layout-maker.component.html',
  styleUrls: ['./layout-maker.component.css']
})
export class LayoutMakerComponent implements OnInit {
  @Input() layoutName: string = null;
  layoutObservable: Observable<Layout>;
  layout: Layout = null;
  layoutSubject: BehaviorSubject<Layout> = new BehaviorSubject<Layout>(this.layout);
  initialized = false;
  @Input() hasParent: boolean = true;
  showButtons = {};
  showModal = false;

  objToJson(obj) {
    return JSON.stringify(obj);
  }
  constructor(public formMakerService: FormMakerService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    // console.log(this.layoutName)
    console.log(this.layoutName)
    this.layoutObservable = this.formMakerService.getLayout(this.layoutName);
    this.layoutObservable.subscribe(res => {
      console.log('res', res)
      this.layout = res;
      this.layoutSubject.next(this.layout)
      if(!this.initialized) {
        this.initialized = true
        this.layoutName = res['layoutName'];
        // console.log(this.layoutName)
      }

      // console.log(res);
    })
  }

  appFormClick(e) {
    e.stopPropagation();
  }

  newRow(event, layout) {
    // this.formMakerService.selectColumn(layout);
    this.formMakerService.createNewRow(layout['parentLayoutName'] ? layout['parentLayoutName'] : layout['layoutName']);
    event.stopPropagation();
  }

  newColumn(event, rowName) {
    // console.log(event.target)
    // console.log(JSON.stringify(this.layout), this.layoutName, rowName)
    this.formMakerService.createNewColumn(
      this.layout['parentLayoutName'] ? this.layout['parentLayoutName'] : this.layoutName, rowName);
    event.stopPropagation();
  }

  getColumnSizeClasses(column) {
    if(!column['layoutSize'])
      return 'col';
    else
      return 'col col-md-' + column['layoutSize'];
  }

  selectColumn(event, col) {
    // console.log(event.target)
    // console.log(col)
    if(this.formMakerService.isDragMode && !this.formMakerService.selectedColumn) {
      console.log(this.formMakerService.isDragMode())
      this.formMakerService.selectColumn(col);
    } else if(this.formMakerService.isDragMode() && this.formMakerService.selectedColumn) {
      console.log(this.formMakerService.isDragMode())
      this.formMakerService.translocateColumns(col);
    } else {
      console.log("3")
      this.formMakerService.selectColumn(col);
    }

    event.stopPropagation();
  }

  highlightLayout(layout) {
    this.formMakerService.addHighlight(layout['layoutName']);
    // this.formMakerService.addHighlight(this.formMakerService.getLayoutFromRow(row['rowName']));
  }

  unhighlightLayout() {
    // console.log('leave')
    this.formMakerService.removeHighlight();
  }

  highlightRow(row) {
    // console.log(row['rowName'])
    this.formMakerService.addHighlightRow(row['rowName']);
    // this.formMakerService.addHighlight(this.formMakerService.getLayoutFromRow(row['rowName']));
  }

  unhighlightRow() {
    this.formMakerService.removeHighlightRow();
  }

  highlightColumn(column) {
    this.formMakerService.addHighlightColumn(column);
    // this.formMakerService.addHighlight(this.formMakerService.getLayoutFromRow(row['rowName']));
  }

  unhighlightColumn() {
    this.formMakerService.removeHighlightColumn();
  }

  showSettingButton(column) {
    if(!this.showButtons.hasOwnProperty(column['columnName']))
      this.showButtons[column['columnName']] = true;
    else {
      this.showButtons[column['columnName']] = !this.showButtons[column['columnName']];
    }
  }

  columnSettings(column) {
    this.showModal = true;
    const dialogRef = this.dialog.open(ColumnSettingDialogComponent, {
      width: '500px',
      data: {
        column: column
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      let c = JSON.parse(JSON.stringify(result['data']));
      for(let k in column) {
        delete column[k];
      }
      for(let k in c) {
        column[k] = c[k];
      }
      this.showModal = false;
    });
  }

  controlSettings(row, column) {
    // console.log(JSON.stringify(column))
    this.showModal = true;
    const dialogRef = this.dialog.open(ControlSettingDialogComponent, {
      width: '80%',
      data: {
        layoutName: this.layoutName,
        rowName: row['rowName'],
        columnName: column['columnName']
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      let c = JSON.parse(JSON.stringify(result['data']));
      console.log(c);
      this.formMakerService.changeColumn(this.layoutName, row['rowName'], column['columnName'], c);
      this.showModal = false;
    });
  }

 /* drop(event) {
    console.log(event)
  }


  onDragStart(e) {
    console.log(e);
    console.log(this.formMakerService.highlightColumn);
    // e.dataTransfer.setData('text', e.target.id);
  }

  onDrop(e) {
    e.preventDefault();
    console.log(e.target.id);
    console.log(e.target);
    /!*let data = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(data));*!/
  }*/
}
