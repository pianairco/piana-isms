import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CommonDialogComponent} from "../../components/common-dialog/common-dialog.component";
import {Layout} from "../../components/form-element/form-element.component";
import {QueryStructure} from "../../components/query-creator/query-creator.service";

@Component({
  selector: 'app-option-load-from-query-dialog',
  templateUrl: './option-load-from-query-dialog.component.html',
  styleUrls: ['./option-load-from-query-dialog.component.css']
})
export class OptionLoadFromQueryDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object) {
  }

  ngOnInit(): void {
  }

  closeClick (queryStructure: QueryStructure) {
    console.log(queryStructure.toQueryString());
    this.dialogRef.close({
      queryStructure: queryStructure
    });
  }
}
