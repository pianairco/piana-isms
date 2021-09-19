import { Component, OnInit } from '@angular/core';
import {AjaxCallService} from "../../../services/ajax-call.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CommonDialogComponent} from "../../../components/common-dialog/common-dialog.component";

@Component({
  selector: 'app-sejam-customer',
  templateUrl: './sejam-customer.component.html',
  styleUrls: ['./sejam-customer.component.css']
})
export class SejamCustomerComponent implements OnInit {
  wait = false;
  step = 'requestOtp';

  model: {
    nationalCode: string;
    otp: string;
  } = {
    nationalCode: '',
    otp: ''
  }

  constructor(private ajaxCall: AjaxCallService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  showMessage(title: string, message: string) {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '500px',
      data: {
        title: title,
        message: message
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed => ', result);
    });
  }

  toRequestOtp() {
    console.log(JSON.stringify(this.model))
    this.model.nationalCode = '';
    this.model.otp = '';
    this.step = 'requestOtp';
  }

  requestOtp() {
    try {
      this.wait = true;
      this.ajaxCall.post("api/modules/sejam/request-otp", this.model).then(res => {
        console.log(res)
        this.step = 'complete';
      }, err => {
        console.log(err.response, err.response.status)
        this.showMessage('خطا', this.processSejamErrors(err));
      });
    } finally {
      this.wait = false;
    }
  }

  complete() {
    try {
      this.wait = true;
      this.ajaxCall.post("api/modules/sejam/confirm-otp", this.model).then(res => {
        console.log(res)
        this.step = 'complete';
      }, err => {
        console.log(err.response, err.response.status)
        this.showMessage('خطا', this.processSejamErrors(err));
      });
    } finally {
      this.wait = false;
    }
  }

  processSejamErrors(err): string {
    if(err.response.status == 404) {
      return 'شماره ملی وارد شده در سجام ثبت نام نشده است';
    } else if(err.response.status == 400) {
      return 'خطا رخ داده است';
    } else if(err.response.status == 429) {
      return 'لطفا پس از دو دقیقه مجددا امتحان کنید.';
    } else {
      return 'در سیستم خطا رخ داده است';
    }
  }
}
