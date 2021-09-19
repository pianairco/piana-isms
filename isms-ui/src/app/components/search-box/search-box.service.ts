import {Injectable, Injector} from '@angular/core';
import axios from "axios";
import {ConstantService} from "../../services/constant.service";
import {BehaviorSubject, Observable} from "rxjs";
import {EditModeObject} from "../../services/share-state.service";

@Injectable({
  providedIn: 'root'
})
export class SearchBoxService {
  _selectableSubjects = {};

  constructor(private constantService: ConstantService,
              private injector: Injector) { }

  getSelectableSubject(name): Observable<SelectableModel[]> {
    if(this._selectableSubjects[name] == null) {
      this._selectableSubjects[name] = new BehaviorSubject<SelectableModel[]>([]);
    }
    return this._selectableSubjects[name].asObservable();
  }

  call(name, url) {
    return axios.get(this.constantService.getRemoteServer() + "/" + url, { headers: {} }).then(res => {
        this._selectableSubjects[name].next(res['data']);
    }, err => {

    });
  }
}

export class SelectableModel {
  name: string;
  value: string;
}
