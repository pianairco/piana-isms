import {Component, Inject, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import { Overlay } from '@angular/cdk/overlay';
import {LoadingService} from "../../../../../services/loading.service";
import {AjaxCallService} from "../../../../../services/ajax-call.service";
import {ReloadForceService} from "../reload-force.service";

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

  onSelectParameterType(parameterTypeId) {
    this.dialogRef.close({
      status: 0,
      parameterTypeId: parameterTypeId
    });
  }
}

@Component({
  template: ''
})
export class ModalParameterSelectorComponent implements OnInit {
  parameterId;
  parameterTypeId;

  constructor(
    private reloadForceService: ReloadForceService,
    private _location: Location,
    private ajaxService: AjaxCallService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private overlay: Overlay,
    private router: Router,
    private route: ActivatedRoute) {
    console.log("ModalParameterSelectorComponent cons")
  }

  ngOnInit() {
    console.log("ModalParameterSelectorComponent init")
    this.parameterId = +this.route.snapshot.paramMap.get('parameterId');
    this.parameterTypeId = +this.route.snapshot.paramMap.get('parameterTypeId');
    /*this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.parameterId = params.get('parameterId')
        this.parameterTypeId = params.get('parameterTypeId')
        console.log(params, this.parameterId, this.parameterTypeId)
      });*/
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const dialogRef = this.dialog.open(ParametersSelectorDialogComponent, {
      disableClose: true,
      width: '600px',
      data: {
        title: 'انتخاب یا ایجاد الگو',
        selectedTypeId: this.parameterTypeId,
        message: 'message'
      },
      maxHeight: '90vh',
      scrollStrategy: scrollStrategy
    });
    dialogRef.afterClosed().subscribe(async result => {
      console.log('The dialog was closed => ', result);
      if(result['status'] == 0) {
        let res = await this.ajaxService.updateAsync('api/modules/riskmanagement/asset-management/settings/consequence-parameters/update-type',
          { parameterId: this.parameterId, parameterTypeId: result['parameterTypeId']});
        this.reloadForceService.reload('consequence-parameters-type');
        console.log(res);
        /*promise.then(res => {
          console.log(res);
        });*/
        // this.loadingService.changeState(true);
      }
      // this.router.navigate(['../../../..' + this.parameterId], { relativeTo: this.route });
      this._location.back();

      /*if(isSuccess && btn.hasOwnProperty('navigateOnSuccess')) {
        this.router.navigateByUrl(btn['navigateOnSuccess']);
      }*/
    });
  }
}
