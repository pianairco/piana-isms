import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  remoteServer: string = "";

  constructor() { }

  getRemoteServer() {
    return this.remoteServer;
  }
}
