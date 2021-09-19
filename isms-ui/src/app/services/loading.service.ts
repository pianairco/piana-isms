import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public editState: any = false;
  public subject = new Subject<any>();
  private stateSource = new  BehaviorSubject(this.editState);

  currentState = this.stateSource.asObservable();

  constructor() { }

  changeState(state: boolean) {
    this.stateSource.next(state);
  }
}
