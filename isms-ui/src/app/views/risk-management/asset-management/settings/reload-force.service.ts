import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReloadForceService {

  subjects: {[key: string]: BehaviorSubject<any>} = {};

  constructor() { }

  subscribeReloadObject(subjectName: string): BehaviorSubject<any> {
    console.log('createNew');
    return this.subjects[subjectName] = new BehaviorSubject(false);
  }

  reload(subjectName: string) {
    console.log('reload command');
    return this.subjects[subjectName].next(true);
  }
}
