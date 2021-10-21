import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AjaxCallService} from "../../../../../../services/ajax-call.service";
import {ReloadForceService} from "../../../../../../services/reload-force.service";

@Component({
  selector: 'app-consequence-parameters-type',
  templateUrl: './consequence-parameters-type.component.html',
  styleUrls: ['./consequence-parameters-type.component.css']
})
export class ConsequenceParametersTypeComponent implements OnInit {
  @Input() parameterId : number;
  _typeId = null;
  _coefficient = null;
  _paramName = null;
  _paramAlias = null;
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

  /*navigateToChange() {
   this.router.navigate(['select', this.parameterId], { relativeTo: this.route });
  }*/

  navigateToChange(parameterId, parameterTypeId) {
    console.log("navigate to select", parameterId, parameterTypeId)
    this.router.navigate(['select', parameterId, parameterTypeId], { relativeTo: this.route });
  }

  save() {
    console.log("save")
  }
}
