import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilService {

  constructor() { }

  hasStringValue(checkable: string) {
    if (checkable == null ||
      checkable == '' ||
      checkable == undefined) return false;
    return true;
  }

  hasNumberValue(checkable: number) {
    if (checkable == null ||
      checkable == undefined) return false;
    return true;
  }
}
