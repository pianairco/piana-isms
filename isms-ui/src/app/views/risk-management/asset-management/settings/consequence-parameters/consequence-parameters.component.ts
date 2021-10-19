import { Component, OnInit } from '@angular/core';
import {AjaxCallService} from "../../../../../services/ajax-call.service";
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-consequence-parameters',
  templateUrl: './consequence-parameters.component.html',
  styleUrls: ['./consequence-parameters.component.css']
})
export class ConsequenceParametersComponent implements OnInit {
  _parameters = null;
  parameters$ = new BehaviorSubject(this._parameters);

  constructor(private ajaxCall: AjaxCallService,
              private router: Router,
              private route: ActivatedRoute) {
    console.log("ConsequenceParametersComponent construct")
  }

  async ngOnInit() {
    console.log("ConsequenceParametersComponent init")
    /*let res = await this.ajaxCall.readAsync("api/modules/riskmanagement/asset-management/settings/consequence-parameters/list");
    if(res.status == 200 && res.data['code'] == 0) {
      console.log(res.data['data'])
      this.parameters = res.data['data'];
    }*/

    let res = await this.ajaxCall.readAsync("api/modules/riskmanagement/asset-management/settings/consequence-parameters/id-and-names");
    if(res.status == 200 && res.data['code'] == 0) {
      console.log(res.data['data'])
      this.parameters = res.data['data'];
    }


/*    d.then(res => {
        if(res.status == 200 && res.data['code'] == 0) {
          this.parameters = res.data['data'];
        }
      });*/
  }

  set parameters(_parameters) {
    this._parameters = _parameters;
    this.parameters$.next(this._parameters);
  }

  paramOpened = new BehaviorSubject(0);
  open(parameterId) {
    console.log("opened", parameterId);
    this.paramOpened.next(parameterId);
    this.router.navigate(['values', parameterId], { relativeTo: this.route });
    // console.log(parameterId);
  }
}
