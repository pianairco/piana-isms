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
    console.log(this.parameterId)
    this.ajaxCall.read("api/modules/riskmanagement/asset-management/settings/consequence-parameters-type/type-attributes/" + this.parameterId)
      .then(res => {
        if(res.status == 200 && res.data['code'] == 0) {
          console.log(res.data)
          this.attributes = res.data['data'];
        }
      });
  }

  set attributes(_attributes) {
    this._attributes = _attributes;
    this.attributes$.next(this._attributes);
  }

  navigateToChange() {
   this.router.navigate(['select', this.parameterId], { relativeTo: this.route });
  }

}
