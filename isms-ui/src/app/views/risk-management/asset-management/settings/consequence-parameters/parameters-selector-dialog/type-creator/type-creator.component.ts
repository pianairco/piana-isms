import {Component, Input, OnInit} from '@angular/core';
import {AjaxCallService} from "../../../../../../../services/ajax-call.service";
import {BehaviorSubject} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-type-creator',
  templateUrl: './type-creator.component.html',
  styleUrls: ['./type-creator.component.css'],
  animations: [
    trigger('openClose', [
      state('close', style({ height: 0, opacity: 0 })),
      state('open', style({ height: '*', opacity: 1 })),
      transition('open <=> close', animate('1s ease-in-out'))
    ])
  ]
})
export class TypeCreatorComponent implements OnInit {
  @Input() parameterTypeId: number;
  _attributes = [];
  attributes$ = new BehaviorSubject(this._attributes);
  selectedAttr = null;

  constructor(private ajaxCall: AjaxCallService) { }

  set attributes(_attributes) {
    this._attributes = _attributes;
    this.attributes$.next(this._attributes);
  }

  async ngOnInit() {
    let res = await this.ajaxCall.read("api/modules/riskmanagement/asset-management/settings/consequence-parameters/request-to-create/" + this.parameterTypeId);
    console.log(res)
    if(res.status == 200 && res.data['code'] == 0) {
      console.log(res.data['data'])
      this.attributes = res.data['data'];
    }
  }

  ifOpen(attr) {
    return attr === this.selectedAttr ? 'open' : 'close';
  }
}
