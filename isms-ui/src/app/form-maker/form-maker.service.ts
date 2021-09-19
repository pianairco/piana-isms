import { Injectable } from '@angular/core';
import {FormMakerModule} from "./form-maker.module";
import {BehaviorSubject, Observable} from "rxjs";
import {FormElementType, formElementTypes, Layout} from "../components/form-element/form-element.component";
import {AjaxCallService} from "../services/ajax-call.service";

@Injectable(
)
export class FormMakerService {
  formElementTypes = FormElementType;
  private _layouts = [];
  private _layoutObject: object = {};
  private _layoutSubjectObject: object = {};
  private layoutCounter = 0;
  private rowCounter = 0;
  private columnCounter = 0;
  private _selectedColumn = null;
  private _selectedColumnSubject = new BehaviorSubject(this._selectedColumn);

  constructor(private ajaxCall: AjaxCallService) { }

  downLoadFile(url: string) {
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert( 'Please disable your Pop-up blocker and try again.');
    }
  }

  downloadAsComponent() {
    this.ajaxCall.post("api/modules/general/form-maker/download-as-component", this._layoutObject).then(res => {
      console.log(res)
      this.downLoadFile("api/modules/general/form-maker/download-as-component?uuid=" + res.data['uuid']);
    }, err => {
      console.log(err);
    });
  }

  downloadAsJson() {
    this.ajaxCall.post("api/modules/general/form-maker/download-as-json", this._layoutObject).then(res => {
      console.log(res)
      this.downLoadFile("api/modules/general/form-maker/download-as-json?uuid=" + res.data['uuid']);
    }, err => {
      console.log(err);
    });
  }

  getTypeOf(e) {
    return typeof e;
  }

  get selectedColumn(): object {
    return this._selectedColumn;
  }

  get selectedColumnSubject(): Observable<object> {
    return this._selectedColumnSubject.asObservable();
  }

  selectColumn(_selectedColumn) {
    if(this._selectedColumn && this._selectedColumn['columnName'] == _selectedColumn['columnName'])
      this._selectedColumn = null;
    else
      this._selectedColumn = _selectedColumn;
    this._selectedColumnSubject.next(this._selectedColumn);
  }

  deselectColumn() {
    this.selectColumn(this._selectedColumn);
  }

  deleteSelectedColumn() {
    if(!this.selectedColumn)
      return;
    let layout = this._layoutObject[this.selectedColumn['parentLayoutName']];
    let row = null;
    for(let tempRow of layout.children) {
      if(tempRow['rowName'] == this.selectedColumn['parentRowName']) {
        row = tempRow;
        break;
      }
    }
    let idx = -1;
    for(let i = 0; i < row.children.length; i++) {
      if (row.children[i]['columnName'] == this.selectedColumn['columnName']) {
        idx = i;
        break;
      }
    }
    if(idx > -1) {
      row.children.splice(idx, 1);
      this._selectedColumn = null;
      this._selectedColumnSubject.next(this._selectedColumn);
      this._layoutSubjectObject[row['parentLayoutName']].next(this._layoutObject[row['parentLayoutName']]);
    }
  }

  deleteColumn(col) {
    if(!col || !col['columnName'])
      return;
    let isSelected = false;
    if(this.selectedColumn && this.selectedColumn['columnName'] == col['columnName'])
      isSelected = true;
    let layout = this._layoutObject[col['parentLayoutName']];
    let row = null;
    for(let tempRow of layout.children) {
      if(tempRow['rowName'] == col['parentRowName']) {
        row = tempRow;
        break;
      }
    }
    let idx = -1;
    for(let i = 0; i < row.children.length; i++) {
      if (row.children[i]['columnName'] == col['columnName']) {
        idx = i;
        break;
      }
    }
    if(idx > -1) {
      row.children.splice(idx, 1);
      if(isSelected) {
        this._selectedColumn = null;
        this._selectedColumnSubject.next(this._selectedColumn);
      }
      this._layoutSubjectObject[row['parentLayoutName']].next(this._layoutObject[row['parentLayoutName']]);
    }
  }

  deleteRow(row) {
    if(!row || !row['rowName'])
      return;
    let parentLayoutName = row['parentLayoutName'];
    let layout = this._layoutObject[parentLayoutName];
    let idx = -1;
    for(let i = 0; i < layout.children.length; i++) {
      if(row['rowName'] == layout.children[i]['rowName']) {
        idx = i;
        break;
      }
    }
    if(idx > -1) {
      layout.children.splice(idx, 1);
      this._selectedColumn = null;
      this._selectedColumnSubject.next(this._selectedColumn);
      this._layoutSubjectObject[parentLayoutName].next(this._layoutObject[parentLayoutName]);
    }
  }

  deleteLayout(layout) {
    if(!layout || !layout['layoutName'] || !layout['parentLayoutName'])
      return;
  }

  //#region Layout highlight
  /**
   *
   * @private
   */
  private _highlights: string[] = [];
  private _highlightSubject: BehaviorSubject<string> = new BehaviorSubject(null);

  get highlight(): Observable<string> {
    return this._highlightSubject.asObservable();
  }

  addHighlight(layoutName: string) {
    if(this._highlights.length == 0) {
      this._highlights.push(layoutName);
      this._highlightSubject.next(layoutName);
    } else {
      for (let l of this._highlights) {
        if(l == layoutName)
          return;
      }
      this._highlights.push(layoutName);
      this._highlightSubject.next(layoutName);
    }
    // console.log(this._highlights)
    // console.log(this._layoutObject)
  }

  removeHighlight() {
    // console.log(this._highlights, this._highlights.length)
    this._highlights.splice(this._highlights.length - 1, 1);
    this._highlightSubject.next(this._highlights[this._highlights.length - 1]);
    // console.log(this._highlights)
  }

  //#endregion

  //#region Row highlight
  /**
   * Row highlight
   * @private
   */
  private _highlightRows: string[] = [];
  private _highlightRowSubject: BehaviorSubject<string> = new BehaviorSubject(null);

  get highlightRow(): Observable<string> {
    return this._highlightRowSubject.asObservable();
  }

  addHighlightRow(rowName: string) {
    if(this._highlightRows.length == 0) {
      this._highlightRows.push(rowName);
      this._highlightRowSubject.next(rowName);
    } else {
      for (let r of this._highlightRows) {
        if(r == rowName)
          return;
      }
      this._highlightRows.push(rowName);
      this._highlightRowSubject.next(rowName);
    }
  }

  removeHighlightRow() {
    this._highlightRows.splice(this._highlightRows.length - 1, 1);
    this._highlightRowSubject.next(this._highlightRows[this._highlightRows.length - 1]);
    // console.log(this._highlightColumns)
  }

  //#endregion

  //#region Column highlight
  /**
   *
   * @private
   */
  private _highlightColumns: any[] = [];
  private _highlightColumnSubject: BehaviorSubject<string> = new BehaviorSubject(null);

  get highlightColumn(): any {
    if(this._highlightColumns.length == 0)
      return null;
    return this._highlightColumns[this._highlightColumns.length - 1];
  }

  get highlightColumnSubject(): Observable<string> {
    return this._highlightColumnSubject.asObservable();
  }

  addHighlightColumn(column: any) {
    if(this._highlightColumns.length == 0) {
      this._highlightColumns.push(column);
      this._highlightColumnSubject.next(column);
    } else {
      for (let c of this._highlightColumns) {
        if(c['columnName'] == column['columnName']) {
          return;
        }
      }
      this._highlightColumns.push(column);
      this._highlightColumnSubject.next(column);
    }
  }

  removeHighlightColumn() {
    this._highlightColumns.splice(this._highlightColumns.length - 1, 1);
    this._highlightColumnSubject.next(this._highlightColumns[this._highlightColumns.length - 1]);
    // console.log(this._highlightColumns)
  }

  //#endregion

  //#region The current column that the mouse entered

  private _currentColumnMouseEntered = null;
  private _currentColumnMouseEnteredSubject = new BehaviorSubject(this._currentColumnMouseEntered);

  get currentColumnMouseEntered(): Observable<any> {
    return this._currentColumnMouseEnteredSubject.asObservable();
  }

  setCurrentColumnMouseEntered(_currentColumnMouseEntered) {
    this._currentColumnMouseEntered = _currentColumnMouseEntered;
    this._currentColumnMouseEnteredSubject.next(this._currentColumnMouseEntered);
  }

  //#endregion

  //#region IsDragAndDropMode

  private _isDragAndDropMode = false;
  private _isDragAndDropModeSubject = new BehaviorSubject(this._isDragAndDropMode);

  isDragMode(): boolean {
    return this._isDragAndDropMode;
  }

  get isDragAndDropMode(): Observable<boolean> {
    return this._isDragAndDropModeSubject.asObservable();
  }

  toggleIsDragAndDropMode() {
    this._isDragAndDropMode = !this._isDragAndDropMode;
    this._isDragAndDropModeSubject.next(this._isDragAndDropMode);
    this.deselectColumn();
  }

  //#endregion

  //#region IsMakeMode

  private _isMakeMode = true;
  private _isMakeModeSubject = new BehaviorSubject(this._isMakeMode);

  get isMakeMode(): Observable<boolean> {
    return this._isMakeModeSubject.asObservable();
  }

  toggleIsMakeMode() {
    this._isMakeMode = !this._isMakeMode;
    this._isMakeModeSubject.next(this._isMakeMode);
  }

  //#endregion

  getLayout(layoutName): Observable<Layout> {
    // console.log(2, this._layoutSubjectObject.hasOwnProperty(layoutName), JSON.stringify(this._layoutObject))
    if(this._layoutSubjectObject.hasOwnProperty(layoutName)) {
      // console.log(3)
      return this._layoutSubjectObject[layoutName];
    } else {
      return this.createNewLayout(layoutName);
    }
  }

  getColumn(layoutName, rowName, columnName) {
    console.log(layoutName, this._layoutObject[layoutName]);
    for(let row of this._layoutObject[layoutName].children) {
      if (row['rowName'] === rowName) {
        for (let col of row.children) {
          if (col['columnName'] === columnName) {
            return col;
          }
        }
      }
    }
  }

  getLayoutFromRow(rowName) {
    for(let layout in this._layoutObject) {
      console.log(this._layoutObject[layout])
      for (let row of this._layoutObject[layout].children) {
        if (row['rowName'] === rowName) {
          return layout;
        }
      }
    }
  }

  createNewLayout(parentLayoutName: string|null): Observable<Layout> {
    console.log("1")
    let name = 'layout-' + (this.layoutCounter++);
    this._layoutObject[parentLayoutName == null ? name : parentLayoutName] = {
      "layoutName": name,
      "parentLayoutName": parentLayoutName,
      "layoutSize": "12",
      "type": "layout",
      "class": "align-items-center",
      "children": []
    };

    this._layoutSubjectObject[parentLayoutName == null ? name : parentLayoutName] = new BehaviorSubject(this._layoutObject[parentLayoutName == null ? name : parentLayoutName]);
    // console.log(this._layoutObject)
    // console.log(this._layoutObject[name])
    return this._layoutSubjectObject[parentLayoutName == null ? name : parentLayoutName].asObservable();
  }

  createNewRow(layoutName) {
    /*console.log(layoutName, this.selectedColumn['column-name'], this.selectedColumn['columnName'])
    // console.log(this._layoutObject.hasOwnProperty(layoutName), layoutName, this.selectedColumn)
    if(!this._layoutObject.hasOwnProperty(layoutName) && this.selectedColumn) {
      this._layoutObject[layoutName]['parentLayout'] = this.selectedColumn['column-name'];
    }*/
    this._layoutObject[layoutName].children.push({
      "parentLayoutName": layoutName,
      "rowName": "row-" + (this.rowCounter++),
      "class": "row",
      "children": []
    });

    // console.log(this._layoutObject, layoutName)
    this._layoutSubjectObject[layoutName].next(this._layoutObject[layoutName]);
  }

  createNewColumn(layoutName, rowName) {
    console.log(layoutName, rowName)
    for(let row of this._layoutObject[layoutName].children) {
      if (row['rowName'] === rowName) {
        row['children'].push({
          "parentLayoutName": layoutName,
          "parentRowName": rowName,
          "columnName": "column-" + (this.columnCounter++),
          "layoutSize": undefined,
          "type": "none"
        });
      }
    }

    console.log(layoutName, this._layoutObject[layoutName])
    this._layoutSubjectObject[layoutName].next(this._layoutObject[layoutName]);
  }

  changeColumn(layoutName, rowName, columnName, columnDef) {
    for(let row of this._layoutObject[layoutName].children) {
      // console.log(row, row['rowName'], rowName)
      if (row['rowName'] === rowName) {
        for(let col of row.children) {
          if (col['columnName'] === columnName) {
            for(let k in col) {
              delete col[k];
            }
            for(let k in columnDef) {
              col[k] = columnDef[k];
            }
          }
        }
      }
    }

    this._layoutSubjectObject[layoutName].next(this._layoutObject[layoutName]);
  }

  changeSelectedColumnField(fieldName, value) {
    console.log(this.selectedColumn, fieldName, value)

    for(let row of this._layoutObject[this._selectedColumn['parentLayoutName']].children) {
      if (row['rowName'] === this._selectedColumn['parentRowName']) {
        for (let col of row.children) {
          if (col['columnName'] === this._selectedColumn['columnName']) {
            console.log(col['columnName'])
            let lastFieldValue = col[fieldName];
            delete col[fieldName];
            col[fieldName] = value;
            if (fieldName == 'type') {
              if (value == 'layout' || value == FormElementType.LAYOUT) {
                console.log(JSON.stringify(this._layoutObject));
                this.createNewLayout(col['columnName']);
                console.log(JSON.stringify(this._layoutObject));
              } else if (lastFieldValue == 'layout' || lastFieldValue == FormElementType.LAYOUT) {
                delete this._layoutObject[col['columnName']];
              }
            }
          }
        }
      }
    }

    if(!this._selectedColumn.hasOwnProperty('parentLayoutName') || this.selectedColumn['parentLayoutName'] == null) {
      this._layoutSubjectObject[this._selectedColumn['layoutName']].next(
        JSON.parse(JSON.stringify(this._layoutObject[this._selectedColumn['layoutName']])));
    } else {
      this._layoutSubjectObject[this._selectedColumn['parentLayoutName']].next(
        JSON.parse(JSON.stringify(this._layoutObject[this._selectedColumn['parentLayoutName']])));
    }
  }

  /*translocateColumns(col1, col2) {
    if(!col1 || !col2 || !col1['columnName'] || !col2['columnName'])
      return;
    let copy1 = JSON.parse(JSON.stringify(col1));
    let copy2 = JSON.parse(JSON.stringify(col2));
    console.log(copy1, this._layoutObject[copy1['parentLayoutName']])
    let row1 = null;
    let index1 = -1;
    let row2 = null;
    let index2 = -1;
    for(let row of this._layoutObject[copy1['parentLayoutName']].children) {
      if(row['rowName'] == copy1['parentRowName']) {
        for(let i = 0; i< row.children.length; i++) {
          if(row.children[i]['columnName'] == copy1['columnName']) {
            index1 = i;
            row1 = row;
            /!*row.children[i] = JSON.parse(JSON.stringify(copy2));
            row.children[i]['parentLayoutName'] = row['parentLayoutName'];
            row.children[i]['parentRowName'] = row['rowName'];*!/
          }
        }
      }
    }

    for(let row of this._layoutObject[copy2['parentLayoutName']].children) {
      if(row['rowName'] == copy2['parentRowName']) {
        for(let i = 0; i< row.children.length; i++) {
          if(row.children[i]['columnName'] == copy2['columnName']) {
            index2 = i;
            row2 = row;
            /!*row.children[i] = JSON.parse(JSON.stringify(copy1));
            row.children[i]['parentLayoutName'] = row['parentLayoutName'];
            row.children[i]['parentRowName'] = row['rowName'];*!/
          }
        }
      }
    }

    row1.children[index1] = JSON.parse(JSON.stringify(copy2));
    row1.children[index1]['parentLayoutName'] = row1['parentLayoutName'];
    row1.children[index1]['parentRowName'] = row1['rowName'];

    row2.children[index2] = JSON.parse(JSON.stringify(copy1));
    row2.children[index2]['parentLayoutName'] = row2['parentLayoutName'];
    row2.children[index2]['parentRowName'] = row2['rowName'];

    this._layoutSubjectObject[row1['parentLayoutName']].next(this._layoutObject[row1['parentLayoutName']]);
    if(row2['parentLayoutName'] != row1['parentLayoutName'])
      this._layoutSubjectObject[row2['parentLayoutName']].next(this._layoutObject[row2['parentLayoutName']]);
  }*/

  translocateColumns(col1) {
    let col2 = this.selectedColumn;
    if(!col1 || !col2 || !col1['columnName'] || !col2['columnName'])
      return;
    let copy1 = JSON.parse(JSON.stringify(col1));
    let copy2 = JSON.parse(JSON.stringify(col2));
    console.log(copy1, this._layoutObject[copy1['parentLayoutName']])
    let row1 = null;
    let index1 = -1;
    let row2 = null;
    let index2 = -1;
    for(let row of this._layoutObject[copy1['parentLayoutName']].children) {
      if(row['rowName'] == copy1['parentRowName']) {
        for(let i = 0; i< row.children.length; i++) {
          if(row.children[i]['columnName'] == copy1['columnName']) {
            index1 = i;
            row1 = row;
            /*row.children[i] = JSON.parse(JSON.stringify(copy2));
            row.children[i]['parentLayoutName'] = row['parentLayoutName'];
            row.children[i]['parentRowName'] = row['rowName'];*/
          }
        }
      }
    }

    for(let row of this._layoutObject[copy2['parentLayoutName']].children) {
      if(row['rowName'] == copy2['parentRowName']) {
        for(let i = 0; i< row.children.length; i++) {
          if(row.children[i]['columnName'] == copy2['columnName']) {
            index2 = i;
            row2 = row;
            /*row.children[i] = JSON.parse(JSON.stringify(copy1));
            row.children[i]['parentLayoutName'] = row['parentLayoutName'];
            row.children[i]['parentRowName'] = row['rowName'];*/
          }
        }
      }
    }

    row1.children[index1] = JSON.parse(JSON.stringify(copy2));
    row1.children[index1]['parentLayoutName'] = row1['parentLayoutName'];
    row1.children[index1]['parentRowName'] = row1['rowName'];

    row2.children[index2] = JSON.parse(JSON.stringify(copy1));
    row2.children[index2]['parentLayoutName'] = row2['parentLayoutName'];
    row2.children[index2]['parentRowName'] = row2['rowName'];

    this.deselectColumn();
    this._layoutSubjectObject[row1['parentLayoutName']].next(this._layoutObject[row1['parentLayoutName']]);
    if(row2['parentLayoutName'] != row1['parentLayoutName'])
      this._layoutSubjectObject[row2['parentLayoutName']].next(this._layoutObject[row2['parentLayoutName']]);
  }
}
