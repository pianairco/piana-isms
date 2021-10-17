import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CommonDialogComponent} from "../../../../../components/common-dialog/common-dialog.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './parameters-selector-dialog.component.html',
  styleUrls: ['./parameters-selector-dialog.component.css']
})
export class ParametersSelectorDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ParametersSelectorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: object) { }

  ngOnInit(): void {
    console.log(JSON.stringify(this.data))
  }

  closeClick () {
    this.dialogRef.close({
      status: 1
    });
  }

}

@Component({
  template: ''
})
export class ModalParameterSelectorComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const dialogRef = this.dialog.open(ParametersSelectorDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        title: 'انتخاب یا ایجاد الگو',
        message: 'message'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed => ', result);
      this.router.navigate(['../../'], { relativeTo: this.route })
      /*if(isSuccess && btn.hasOwnProperty('navigateOnSuccess')) {
        this.router.navigateByUrl(btn['navigateOnSuccess']);
      }*/
    });
  }
}
