import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {QueryCreatorDialogComponent} from "./query-creator-dialog/query-creator-dialog.component";
import {QueryCreatorService, QueryStructure, SelectQueryStructure} from "./query-creator.service";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'app-query-creator',
  templateUrl: './query-creator.component.html',
  styleUrls: ['./query-creator.component.css']
})
export class QueryCreatorComponent implements OnInit {
  query: string = "";
  protected queryStructure: QueryStructure = null;

  constructor(public dialog: MatDialog, public qcService: QueryCreatorService) { }

  ngOnInit(): void {
  }

  createQuery(type) {
    this.queryStructure = this.qcService.createQuery(type, null);
  }

  logged() {
    console.log(this.queryStructure.toQueryString())
  }

  addSelect() {
    const dialogRef = this.dialog.open(QueryCreatorDialogComponent, {
      width: '800px',
      data: {
        title: 'select query creator',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed => ', result);
    });
  }



}
