import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable(
)
export class QueryCreatorService {
  _counter = 0;

  getQueryName(): string {
    return "sub_" + (++this._counter);
  }

  queryStructureContainer: { root: QueryStructure } = {
    root : null
  };

  createQuery(type, parentQuerySpec): QueryStructure {
    let querySpec: QuerySpec = null;
    if(!parentQuerySpec)
      querySpec = new QuerySpec(this.getQueryName(), null)
    else
      querySpec = new QuerySpec(this.getQueryName(), parentQuerySpec);
    // console.log(JSON.stringify(querySpec))
    switch (type) {
      case 'select':
        this.queryStructureContainer[querySpec.queryName] = new SelectQueryStructure(this, querySpec);
        this._queryString = "select * from";
        this._queryStringSubject.next(this._queryString);
        this._queryType = "select";
        this._queryTypeSubject.next(this._queryType);
        return this.queryStructureContainer[querySpec.queryName];
      case 'insert':
        break;
      case 'update':
        break;
      case 'delete':
        break;
      case 'template':
        this.queryStructureContainer[querySpec.queryName] = new SelectTemplateQueryStructure(this, querySpec);
        this._queryString = "select * from";
        this._queryStringSubject.next(this._queryString);
        this._queryType = "select";
        this._queryTypeSubject.next(this._queryType);
        return this.queryStructureContainer[querySpec.queryName];
        break;
      default:
        break;
    }
    return null;
  }

  //region hovered, selected
  private _selectedQuery: string = null;
  private _selectedQuerySubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._selectedQuery);

  get selectedQuery() {
    return this._selectedQuery;
  }

  get selectedQuerySubject(): Observable<string> {
    return this._selectedQuerySubject.asObservable();
  }

  selectQuery(queryName) {
    if(this._selectedQuery == queryName)
      this._selectedQuery = null;
    else
      this._selectedQuery = queryName;
    this._hovered = queryName;
    this._hoveredSubject.next(this._hovered);
    this._selectedQuerySubject.next(this._selectedQuery);
  }

  private _hovered: string = null;
  private _hoveredSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._hovered);

  get hovered() {
    return this._hovered;
  }

  get hoveredSubject(): Observable<string> {
    return this._hoveredSubject.asObservable();
  }

  setHovered(queryName) {
    if(!this._selectedQuery) {
      this._hovered = queryName;
      this._hoveredSubject.next(this.hovered);
    }
  }
  //endregion

  // region queryType
  _queryType: string = null;
  _queryTypeSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._queryType);

  get queryType(): string {
    return this._queryType;
  }

  get queryTypeSubject(): Observable<string> {
    return this._queryTypeSubject.asObservable();
  }
  // endregion

  // region queryString
  _queryString: string = null;
  _queryStringSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._queryString);

  get queryString(): string {
    return this._queryString;
  }

  get queryStringSubject(): Observable<string> {
    return this._queryStringSubject.asObservable();
  }

  refreshQueryString() {
    this._queryString = "";
    if(this.queryStructureContainer.root) {
      this._queryString += this.queryStructureContainer.root.toQueryString();
    }
    this._queryStringSubject.next(this._queryString);
  }
  // endregion

  getSelectQueryStructure(querySpec): SelectQueryStructure {
    console.log(JSON.stringify(querySpec))
    return this.queryStructureContainer[querySpec['queryName']];
  }
}

export abstract class ColumnStructure {
  type: string;
  as: string;

  constructor(type: string) {
    this.type = type;
  }

  abstract toString(): string;
}

export class SimpleColumnStructure extends ColumnStructure {
  field: string;

  constructor(field, as) {
    super('simple');
    this.field = field;
    this.as = as;
  }

  toString(): string {
    return this.field + (this.as ? ' ' + this.as : '');
  }
}

export class CaseWhenColumnStructure extends ColumnStructure {
  clause: string;
  then: string;
  else: string;

  constructor() {
    super('case-when');
  }

  toString(): string {
    return "case when " + this.clause + " then " + this.then + ' else ' + this.else;
  }
}

export abstract class TableStructure {
  queryCreatorService: QueryCreatorService;
  type: string;
  as: string;

  constructor(queryCreatorService: QueryCreatorService, type: string) {
    this.type = type;
    this.queryCreatorService = queryCreatorService;
  }

  abstract toString(): string;

  abstract getQuerySpec(): QuerySpec;
}

export class SimpleTableStructure extends TableStructure {
  name: string;

  constructor(queryCreatorService: QueryCreatorService) {
    super(queryCreatorService, 'simple');
  }

  toString(): string {
    return this.name + (this.as ? ' ' + this.as : '');
  }

  getQuerySpec() {
    return null;
  }
}

export class JoinTableStructure extends TableStructure {
  leftTable: TableStructure;
  joinType: string;
  rightTable: TableStructure;
  on: string;

  constructor(queryCreatorService: QueryCreatorService) {
    super(queryCreatorService, 'join');
  }

  toString(): string {
    return this.leftTable.toString() + this.joinType + this.rightTable.toString() + ' on ' + this.on + this.as ? this.as + ' ' : ' ';
  }

  getQuerySpec() {
    return null;
  }
}

export class InnerSelectTableStructure extends TableStructure {
  selectQueryStructure: SelectQueryStructure;

  constructor(queryCreatorService: QueryCreatorService, selectQueryStructure) {
    super(queryCreatorService, 'inner');
    this.selectQueryStructure = selectQueryStructure;
  }

  getSelectQueryStructure() {
    return this.selectQueryStructure;
  }

  toString(): string {
    return "( " + this.selectQueryStructure.toQueryString() + ")" + (this.as ? ' ' + this.as + ' ' : ' ');
  }

  getQuerySpec() {
    return this.selectQueryStructure.querySpec;
  }
}

export abstract class QueryStructure {
  queryCreatorService: QueryCreatorService;
  _querySpec: QuerySpec;

  constructor(queryCreatorService: QueryCreatorService, querySpec: QuerySpec) {
    this.queryCreatorService = queryCreatorService;
    this._querySpec = querySpec;
  }

  get querySpec() {
    return this._querySpec;
  }

  abstract getType(): string;
  abstract addColumn(col: ColumnStructure);
  abstract toQueryString(): string;
}

export class SelectQueryStructure extends QueryStructure {

  toQueryString(): string {
    let query = "select ";
    if(this._columns.length == 0)
      query += '* '
    for(let i = 1; i <= this._columns.length; i++) {
      query += this._columns[i - 1].toString();
      if (i < this._columns.length)
        query += ', '
      else
        query += ' ';
    }
    query += 'from ';
    for(let i = 1; i <= this.tables.length; i++) {
      query += this.tables[i - 1].toString();
      if (i < this._tables.length)
        query += ', '
      else
        query += '';
    }
    return query;
  }

  // region column
  private _columns: ColumnStructure[] = [];
  private _columnsSubject: BehaviorSubject<ColumnStructure[]> = new BehaviorSubject<ColumnStructure[]>(this._columns);

  get columns() {
    return this._columns;
  }

  get columnsSubject(): Observable<ColumnStructure[]> {
    return this._columnsSubject.asObservable();
  }

  getType(): string {
    return 'select';
  }

  addColumn(col: ColumnStructure) {
    this._columns.push(col);
    this._columnsSubject.next(this._columns);
    this.queryCreatorService.refreshQueryString();
  }

  removeColumn(col): number {
    let idx = -1;
    for(let i = 0; i < this._columns.length; i++) {
      if(this._columns[i] == col) {
        idx = i;
        break;
      }
    }
    if(idx != -1)
      this._columns.splice(idx, 1);
    this._columnsSubject.next(this._columns);
    this.queryCreatorService.refreshQueryString();
    return idx;
  }

  _newColumn: ColumnStructure = null;
  _newColumnSubject: BehaviorSubject<ColumnStructure> = new BehaviorSubject<ColumnStructure>(this._newColumn);
  private _editedColumnIndex = -1;

  get editedColumnIndex(): number {
    return this._editedColumnIndex;
  }

  get newColumn(): ColumnStructure {
    return this._newColumn;
  }

  get newColumnSubject(): Observable<ColumnStructure> {
    return this._newColumnSubject.asObservable();
  }

  addNewColumn(type) {
    switch (type) {
      case 'simple':
        this._newColumn = new SimpleColumnStructure(null, null);
        this._newColumnSubject.next(this._newColumn);
        break;
      case 'case-when':
        this._newColumn = new CaseWhenColumnStructure();
        this._newColumnSubject.next(this._newColumn);
        break;
    }
  }

  commitNewColumn() {
    if(this._editedColumnIndex > -1) {
      this._columns.splice(this._editedColumnIndex, 0, this._newColumn);
      this._editedColumnIndex = -1;
    } else {
      this._columns.push(this._newColumn);
    }
    // this.addColumn(this._newColumn);
    this._newColumn = null;
    this._newColumnSubject.next(this._newColumn);
    this.queryCreatorService.refreshQueryString();
  }

  editColumn(col) {
    this._editedColumnIndex = this.removeColumn(col);
    this._newColumn = col;
    this._newColumnSubject.next(this._newColumn);
  }

  //endregion

  // region table
  private _tables: TableStructure[] = [];
  private _tablesSubject: BehaviorSubject<TableStructure[]> = new BehaviorSubject<TableStructure[]>(this._tables);
  private editedTableIndex = -1;

  get tables() {
    return this._tables;
  }

  get tablesSubject(): Observable<TableStructure[]> {
    return this._tablesSubject.asObservable();
  }

  addTable(table: TableStructure) {
    if(this.editedTableIndex > -1) {
      this._tables.splice(this.editedTableIndex, 0, table);
      this.editedTableIndex = -1;
    } else {
      this._tables.push(table);
    }
    this._tablesSubject.next(this._tables);
    this.queryCreatorService.refreshQueryString();
  }

  editTable(tab) {
    this.editedTableIndex = this.removeTable(tab);
    this._newSource = tab;
    this._newSourceSubject.next(this._newSource);
  }

  commitInnerTableAs() {
    this.queryCreatorService.refreshQueryString();
  }

  removeTable(tab): number {
    let idx = -1;
    for(let i = 0; i < this._tables.length; i++) {
      if(this._tables[i] == tab) {
        idx = i;
        break;
      }
    }
    if(idx != -1)
      this._tables.splice(idx, 1);
    this._tablesSubject.next(this._tables);
    this.queryCreatorService.refreshQueryString();
    return idx;
  }

  _newSource: TableStructure = null;
  _newSourceSubject: BehaviorSubject<TableStructure> = new BehaviorSubject<TableStructure>(this._newSource);

  get newSource(): TableStructure {
    return this._newSource;
  }

  get newSourceSubject(): Observable<TableStructure> {
    return this._newSourceSubject.asObservable();
  }

  addNewSource(type, queryName) {
    switch (type) {
      case 'simple':
        this._newSource = new SimpleTableStructure(this.queryCreatorService);
        this._newSourceSubject.next(this._newSource);
        break;
      case 'join':
        this._newSource = new JoinTableStructure(this.queryCreatorService);
        this._newSourceSubject.next(this._newSource);
        break;
      case 'inner':
        let queryStructure = this.queryCreatorService.createQuery('select', this.querySpec);
        this.addTable(new InnerSelectTableStructure(this.queryCreatorService, queryStructure));
        // this._newSource = new InnerSelectTableStructure(this.queryCreatorService, queryStructure);
        // this._newSourceSubject.next(this._newSource);
        break;
    }
  }

  commitNewSource() {
    this.addTable(this._newSource);
    this._newSource = null;
    this._newSourceSubject.next(this._newSource);
  }
  //endregion

  //region clause
  private _clauses: TableStructure[] = [];
  private _clausesSubject: BehaviorSubject<ClauseStructure[]> = new BehaviorSubject<ClauseStructure[]>(this._clauses);

  //endregion

  //region hovered
  selfOrChild(queryName): boolean {
    if(this._querySpec.queryName == queryName) {
      return true;
    } else {
      let p = this._querySpec.parent;

      while (p) {
        if (p.queryName == queryName)
          return true;
        else
          p = p.parent;
      }
    }
    return false;
  }
  //endregion
}

export class SelectTemplateQueryStructure extends SelectQueryStructure {
  getType(): string {
    return 'template';
  }
}

export interface ClauseStructure {

}

export class SimpleClauseStructure implements ClauseStructure {
  left: string;
  operand: string;
  right: string;
}

export class InSelectClauseStructure implements ClauseStructure {
  left: string;
  right: SelectQueryStructure;
}

export class UnionStructure {
  type: string;
  selectStructure: SelectQueryStructure;
}

export class QuerySpec {
  queryName: string;
  parent: QuerySpec;

  constructor(queryName: string, parent: QuerySpec) {
    this.queryName = queryName;
    this.parent = parent;
  }
}
