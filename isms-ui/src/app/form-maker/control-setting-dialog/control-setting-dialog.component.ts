import {Component, Inject, OnInit} from '@angular/core';
import {FormElementType, formElementTypes, Layout} from "../../components/form-element/form-element.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CommonDialogComponent} from "../../components/common-dialog/common-dialog.component";
import {FormMakerService} from "../form-maker.service";

@Component({
  styleUrls: ['./control-setting-dialog.component.css'],
  selector: 'app-control-setting-dialog',
  templateUrl: './control-setting-dialog.component.html'
})
export class ControlSettingDialogComponent implements OnInit {

  formElementTypes = formElementTypes;
  column: Layout;

  constructor(
    private formMakerService: FormMakerService,
    public dialogRef: MatDialogRef<CommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object) {
  }

  ngOnInit(): void {
    this.column = JSON.parse(JSON.stringify(
      this.formMakerService.getColumn(this.data['layoutName'], this.data['rowName'], this.data['columnName'])));
  }

  formElementToString(fet) {
    return FormElementType.toString(fet);
  }

  onSelectChange(e) {
    this.column['type'] = e.value;
    if(e.value === 'layout') {
      // @ts-ignore
      this.column['children'] = [];
      // @ts-ignore
      // this.column['layoutSize'] = 12;
    }
  }

  onTextChange(e) {
    this.column['title'] = e.target.value;
  }

  closeClick () {
    this.dialogRef.close({
      data: this.column
    });
  }

}
