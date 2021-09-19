import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PianaStorageService {

  constructor() { }

  putObject(key: string, obj: object){
    localStorage.setItem(key, JSON.stringify(obj));
  }

  getObject(key: string): object {
    let item = localStorage.getItem(key);
    if(item)
      return JSON.parse(item);
    return null;
  }

  removeObject(key: string) {
    let item = localStorage.removeItem(key);
  }

  getFieldValue(key: string, field: string) {
    let item = this.getObject(key);
    if(item)
      return item[field];
    return null;
  }

  setFieldValue(key: string, field: string, value: any) {
    let item = this.getObject(key);
    if(item) {
      item[field] = value;
      this.putObject(key, item);
    }
  }
}
