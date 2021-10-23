import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AjaxCallService} from "../../../../../../../services/ajax-call.service";

@Component({
  selector: 'app-type-selector',
  templateUrl: './type-selector.component.html',
  styleUrls: ['./type-selector.component.css']
})
export class TypeSelectorComponent implements OnInit {
  @Input() parameterTypeId: number;
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRequestToCreate: EventEmitter<any> = new EventEmitter<any>();
  _parameters = null;
  parameters$ = new BehaviorSubject(this._parameters);

  constructor(private ajaxCall: AjaxCallService) { }

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

  requestToCreate(parameterTypeId) {
    this.onRequestToCreate.emit(+parameterTypeId);
  }
}
