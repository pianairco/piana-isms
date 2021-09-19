import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-spinner-dialog',
  templateUrl: './spinner-dialog.component.html',
  styleUrls: ['./spinner-dialog.component.css']
})
export class SpinnerDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SpinnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object) {
  }

  ngOnInit(): void {
    console.log(JSON.stringify(this.data))
  }

  closeClick () {
    this.dialogRef.close({
      status: 1
    });
  }

}
