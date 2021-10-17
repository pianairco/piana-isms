import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AjaxCallService} from "../../../../../services/ajax-call.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-consequence-parameters-type-selector',
  templateUrl: './consequence-parameters-type-selector.component.html',
  styleUrls: ['./consequence-parameters-type-selector.component.css']
})
export class ConsequenceParametersTypeSelectorComponent implements OnInit {

  parameterId;
  _parameters = null;
  parameters$ = new BehaviorSubject(this._parameters);
  type = null;

  toString(obj) {
    console.log(JSON.stringify(obj))
    return JSON.stringify(obj);
  }

  constructor(private ajaxCall: AjaxCallService,
              private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => this.parameterId = params['parameterId']);
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
