import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public editDataDetails: any = {};
  public subject = new Subject<any>();
  private messageSource = new  BehaviorSubject(this.editDataDetails);

  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(type: string, message: string) {
    this.messageSource.next(new NotificationModel(type, message, true));
  }

  clear() {
    this.messageSource.next(new NotificationModel(null, null, false));
  }
}

export class NotificationModel {
  isShow: boolean;
  type: string;
  message: string;

  constructor(type: string, message: string, isShow: boolean) {
    this.isShow = isShow;
    this.type = type;
    this.message = message;
  }
}
