import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object) {
  }

  ngOnInit(): void {
    console.log(JSON.stringify(this.data))
  }

  yesClick () {
    this.dialogRef.close({
      status: true
    });
  }

  noClick () {
    this.dialogRef.close({
      status: false
    });
  }
}
