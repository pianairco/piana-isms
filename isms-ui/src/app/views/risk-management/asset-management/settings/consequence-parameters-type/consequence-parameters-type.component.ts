import {Component, Input, OnInit} from '@angular/core';
import {AjaxCallService} from "../../../../../services/ajax-call.service";
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-consequence-parameters-type',
  templateUrl: './consequence-parameters-type.component.html',
  styleUrls: ['./consequence-parameters-type.component.css']
})
export class ConsequenceParametersTypeComponent implements OnInit {
  @Input() parameterId : number;
  _typeId = null;
  _coefficient = null;
  _attributes = null;
  attributes$ = new BehaviorSubject(this._attributes);
  type = null;

  toString(obj) {
    console.log(JSON.stringify(obj))
    return JSON.stringify(obj);
  }

  constructor(private ajaxCall: AjaxCallService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.parameterId = +this.route.snapshot.paramMap.get('parameterId');
    console.log('type', this.parameterId)
    this.ajaxCall.read("api/modules/riskmanagement/asset-management/settings/consequence-parameters/coefficient-and-type-attributes/" + this.parameterId)
      .then(res => {
        if(res.status == 200 && res.data['code'] == 0) {
          console.log(res.data)
          this.attributes = res.data['data']['attributes'];
          this._typeId = res.data['data']['parameterTypeId'];
          this._coefficient = res.data['data']['coefficient'];
        }
      });
    /*this.ajaxCall.read("api/modules/riskmanagement/asset-management/settings/consequence-parameters-type/type-attributes/" + this.parameterId)
      .then(res => {
        if(res.status == 200 && res.data['code'] == 0) {
          console.log(res.data)
          this.attributes = res.data['data'];
        }
      });*/
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
    this.router.navigate(['../../select', parameterId, parameterTypeId], { relativeTo: this.route });
  }
}
