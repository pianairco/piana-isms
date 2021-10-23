import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AjaxCallService} from "../../../../../../services/ajax-call.service";
import {ReloadForceService} from "../../../../../../services/reload-force.service";
import {MatDialog} from "@angular/material/dialog";
import {MessagingService} from "../../../../../../services/messaging.service";
import {MessageType} from "../../../../../../components/dialog/message-dialog/message-dialog.component";
import {stat} from "fs";

@Component({
  selector: 'app-consequence-parameters-detail',
  templateUrl: './consequence-parameters-detail.component.html',
  styleUrls: ['./consequence-parameters-detail.component.css']
})
export class ConsequenceParametersDetailComponent implements OnInit {
  @Input() parameterId : number;
  _typeId = null;
  _attributes = null;
  attributes$ = new BehaviorSubject(this._attributes);
  type = null;

  toString(obj) {
    console.log(JSON.stringify(obj))
    return JSON.stringify(obj);
  }

  constructor(private ajaxCall: AjaxCallService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private messagingService: MessagingService,
              private reloadForceService: ReloadForceService) { }

  ngOnInit(): void {
    this.reloadForceService.subscribeReloadObject('consequence-parameters-type')
      .subscribe(res => {
        console.log("reload received", res);
        if(!res)
          return;
        console.log('type', this.parameterId)
        this.reload();
      });

    this.route.paramMap.subscribe(m => {
      this.parameterId = +m.get('parameterId');
      this.reloadForceService.reload('consequence-parameters-type');
    })
  }

  reload() {
    this.ajaxCall.read(
      "api/modules/riskmanagement/asset-management/settings/consequence-parameters/name-alias-coefficient-type-attributes/" + this.parameterId)
      .then(res => {
        if(res.status == 200 && res.data['code'] == 0) {
          console.log(res.data)
          this.attributes = res.data['data']['attributes'];
          this._typeId = res.data['data']['parameterTypeId'];
          this._coefficient = res.data['data']['coefficient'];
          this._paramName = res.data['data']['name'];
          this._paramAlias = res.data['data']['alias'];
        }
      });
  }

  set attributes(_attributes) {
    this._attributes = _attributes;
    this.attributes$.next(this._attributes);
  }

  navigateToChangeTypeAttribute(parameterId, parameterTypeId) {
    console.log("navigate to select", parameterId, parameterTypeId)
    this.router.navigate(['select', parameterId, parameterTypeId], { relativeTo: this.route });
  }

  //#region parameterCoefficient
  _coefficient = null;
  _coefficientTemp = null;
  editCoefficient$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  gotoEditCoefficient() {
    this._coefficientTemp = this._coefficient;
    this.editCoefficient$.next(true);
  }

  cancelEditCoefficient() {
    this._coefficient = this._coefficientTemp
    this.editCoefficient$.next(false);
  }

  async saveEditCoefficient() {
    if(this._coefficient > 1 || this._coefficient < 0) {
      this.messagingService.showMessage(
        MessageType.ERROR,
        'اعلام خطا',
        'مقدار فیلد باید بزرگتر از 0 و کوچکتر یا مساوی 1 باشد').then(res => {
          console.log("close message success")
      }, err => {
        console.log("close message by error")
      })
      /*const dialogRef = this.dialog.open(CommonDialogComponent, {
        disableClose: true,
        width: '600px',
        data: {
          title: 'اعلام خطا',
          message: 'مقدار فیلد باید بزرگتر از 0 و کوچکتر یا مساوی 1 باشد'
        },
        maxHeight: '100vh'
      });*/
    } else {
      this.messagingService.confirm('تایید', 'تغییر مقدار ضریب را تایید میکنید؟').then(async status => {
        console.log(status)
        if(status) {
          let res = await this.ajaxCall.updateAsync(
            "api/modules/riskmanagement/asset-management/settings/consequence-parameters/update-coefficient",
            {
              parameterId: this.parameterId,
              coefficient: this._coefficient
            });
          console.log(res, res.data['code'])
          if(res.status == 200 && res.data['code'] == 0) {
            this.editCoefficient$.next(false);
          }
        } else {
          this.cancelEditCoefficient();
        }
      }, err => {

      });
    }
  }
  //endregion

  //#region parameterName
  _paramName = null;
  _paramNameEdit = null;
  _paramAlias = null;
  editName$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  async deleteParam() {
    let res = await this.ajaxCall.deleteAsync(
      "api/modules/riskmanagement/asset-management/settings/consequence-parameters/delete", this.parameterId);
    if(res.status == 200 && res.data['code'] == 0) {
      this.reloadForceService.reload("consequence-parameters-id-name");
      this.router.navigate(['../../'], { relativeTo: this.route })
    }
  }

  gotoEditName() {
    this._paramNameEdit = this._paramName;
    this.editName$.next(true);
  }

  cancelEditName() {
    this.editName$.next(false);
  }

  async saveEditName() {
    let res = await this.ajaxCall.updateAsync(
      "api/modules/riskmanagement/asset-management/settings/consequence-parameters/update-name",
      {
        parameterId: this.parameterId,
        name: this._paramNameEdit
      });
    console.log(res, res.data['code'])
    if(res.status == 200 && res.data['code'] == 0) {
      this._paramName = this._paramNameEdit
      this.editName$.next(false);
      this.reloadForceService.reload("consequence-parameters-id-name");
    }
  }
  //#endregion
}
