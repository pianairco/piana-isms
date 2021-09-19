import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {PianaStorageService} from "./piana-storage.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "./authentication-service.service";

@Injectable({
  providedIn: 'root'
})
export class GeneralStateService {
  private _title: string = '';
  private _titleSubject = new BehaviorSubject(this._title);

  constructor(
    private router: Router) {
    router.events.subscribe((val) => {
      if (val['routerEvent']) {
        // console.log(val['routerEvent'].url)
      }
    });
  }

  get titleSubject(): Observable<string> {
    return this._titleSubject.asObservable();
  }

  set title(title) {
    this._title = title;
    this._titleSubject.next(this._title);
  }
}
