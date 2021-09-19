import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ColumnStructure, QueryCreatorService, QueryStructure, SimpleColumnStructure} from "../../query-creator.service";

@Component({
  selector: 'app-option-query-creator',
  templateUrl: './option-query-creator.component.html',
  styleUrls: ['./option-query-creator.component.css']
})
export class OptionQueryCreatorComponent implements OnInit {
  query: string = "";
  queryStructure: QueryStructure = null;

  constructor(public dialog: MatDialog, public qcService: QueryCreatorService) { }

  ngOnInit(): void {
    this.queryStructure = this.qcService.createQuery('template', null);
    console.log(this.queryStructure)
    this.queryStructure.addColumn(new SimpleColumnStructure("-", 'title'));
    this.queryStructure.addColumn(new SimpleColumnStructure("-", 'value'));
  }

  createQuery(type) {

  }
}
