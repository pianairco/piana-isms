import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import * as moment from "jalali-moment";
import {AjaxCallService} from "../../services/ajax-call.service";
import {SearchBoxService} from "./search-box.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GeneralCodeComponent} from "../../views/reports-view/general-code/general-code.component";

@Component({
  selector: 'app-injectable-dialog',
  templateUrl: './injectable-dialog.component.html',
  styleUrls: ['./injectable-dialog.component.css']
})
export class InjectableDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('injectorContainer', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(
    private resolver: ComponentFactoryResolver,
    public dialogRef: MatDialogRef<InjectableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InjectableDialogData) {
  }

  ngOnInit() {
    console.log(this.data['component']);
  }

  ngAfterViewInit() {
    console.log(this.entry);
    this.createComponent(this.data['component']);
  }

  createComponent(component) {
    this.entry.clear();
    if(component === 'app-general-code') {
      const factory = this.resolver.resolveComponentFactory(GeneralCodeComponent);
      const componentRef = this.entry.createComponent(factory);
      componentRef.instance.selectEvent.subscribe(res => {
        console.log(res)
        this.dialogRef.close(res);
      });
    }
  }

  okClick() {
  }

  // closeClick(): void {
  //   this.dialogRef.close();
  // }
}

export interface InjectableDialogData {
  data: {};
}
