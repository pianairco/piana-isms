import {Injectable, Injector} from '@angular/core';
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {AjaxCallService} from "./ajax-call.service";

export class InstrumentSelectable {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class InstrumentSelectableService {
  private _instrumentsSubject: any;
  private _instruments: InstrumentSelectable[] = [];

  constructor(private injector: Injector,
              private router: Router,
              private ajaxCallService: AjaxCallService) {
    this._instrumentsSubject = new BehaviorSubject<any>(this._instruments);
  }

  get instrumentsSubject(): Observable<InstrumentSelectable[]> {
    return this._instrumentsSubject.asObservable();
  }

  set instruments(_instruments) {
    this._instruments = _instruments;
    this._instrumentsSubject.next(this._instruments);
  }

  get instruments(): InstrumentSelectable[] {
    return this._instruments;
  }

  fetch() {
    this.ajaxCallService.read("api/modules/general/instrument/list").then(
      res => {
        this.instruments = res['data'];
      }, err => {

      });
  }
}
