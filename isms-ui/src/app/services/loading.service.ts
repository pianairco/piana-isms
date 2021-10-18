import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public editState: any = false;
  public subject = new Subject<any>();
  private stateSource = new  BehaviorSubject(this.editState);
  private counter = 0;

  currentState = this.stateSource.asObservable();

  constructor() { }

  changeState(state: boolean) {
    if(state) {
      if(this.counter == 0) {
        this.stateSource.next(true);
      }
      this.counter++;
    } else {
      this.counter--;
      if(this.counter == 0) {
        this.stateSource.next(false);
      }
    }
  }
}
