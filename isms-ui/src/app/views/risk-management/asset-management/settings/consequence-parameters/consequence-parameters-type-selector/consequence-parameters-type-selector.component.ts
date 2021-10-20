import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, ParamMap, Params} from "@angular/router";
import {AjaxCallService} from "../../../../../../services/ajax-call.service";

@Component({
  selector: 'app-consequence-parameters-type-selector',
  templateUrl: './consequence-parameters-type-selector.component.html',
  styleUrls: ['./consequence-parameters-type-selector.component.css']
})
export class ConsequenceParametersTypeSelectorComponent implements OnInit {
  @Input() parameterTypeId;
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  _parameters = null;
  parameters$ = new BehaviorSubject(this._parameters);

  toString(obj) {
    console.log(JSON.stringify(obj))
    return JSON.stringify(obj);
  }

  constructor(private ajaxCall: AjaxCallService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
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

  select(parameterTypeId) {
    this.onSelect.emit(+parameterTypeId);
  }
}
