import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-query-creator-dialog',
  templateUrl: './query-creator-dialog.component.html',
  styleUrls: ['./query-creator-dialog.component.css']
})
export class QueryCreatorDialogComponent implements OnInit {
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<QueryCreatorDialogComponent>,
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
