import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CommonDialogComponent} from "../../components/dialog/common-dialog/common-dialog.component";
import {Layout} from "../../components/form-element/form-element.component";

@Component({
  selector: 'app-column-setting-dialog',
  templateUrl: './column-setting-dialog.component.html',
  styleUrls: ['./column-setting-dialog.component.css']
})
export class ColumnSettingDialogComponent implements OnInit {

  colSizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(
    public dialogRef: MatDialogRef<CommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object) {
  }

  column: Layout;

  ngOnInit(): void {
    // console.log(JSON.stringify(this.data))
    this.column = JSON.parse(JSON.stringify(this.data['column']))
  }

  onSelectChange(e) {
    this.column['layoutSize'] = e.value;
  }

  onNumberChange(e) {
    this.column['height'] = e.value;
  }

  closeClick () {
    this.dialogRef.close({
      data: this.column
    });
  }
}
