import {Component, Input, OnInit} from '@angular/core';
import {AjaxCallService} from "../../../../../services/ajax-call.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-consequence-parameters-type',
  templateUrl: './consequence-parameters-type.component.html',
  styleUrls: ['./consequence-parameters-type.component.css']
})
export class ConsequenceParametersTypeComponent implements OnInit {
  @Input() parameterId : number;
  _parameters = null;
  parameters$ = new BehaviorSubject(this._parameters);
  type = null;

  toString(obj) {
    console.log(JSON.stringify(obj))
    return JSON.stringify(obj);
  }

  constructor(private ajaxCall: AjaxCallService) { }

  ngOnInit(): void {
    console.log(this.parameterId)
    this.ajaxCall.read("api/modules/riskmanagement/asset-management/settings/consequence-parameters-type/list-attributes")
      .then(res => {
        if(res.status == 200 && res.data['code'] == 0) {
          console.log(res.data)
          this.parameters = res.data['data'];
        }
      });
  }

  set parameters(_parameters) {
    this._parameters = _parameters;
    this.parameters$.next(this._parameters);
  }
}
