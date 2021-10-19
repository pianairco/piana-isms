import {Injectable, Injector} from '@angular/core';
import {ConstantService} from "./constant.service";
import axios from "axios";
import {LoadingService} from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class AjaxCallService {
  remoteServer: string = "";

  constructor(private constantService: ConstantService,
              private loadingService: LoadingService,
              private injector: Injector) {

  }

  resolve(resolve: (value: unknown) => void, value: unknown) {
    this.loadingService.changeState(false);
    return resolve(value);
  }

  reject(reject: (value: unknown) => void, value: unknown) {
    this.loadingService.changeState(false);
    return reject(value);
  }

  requestByConfig(config: any): Promise<any> {
    this.loadingService.changeState(true);
    return new Promise((resolve, reject) => {
      axios(config).then(res => {
        this.resolve(resolve, res);
      }, err => {
        this.reject(reject, err);
      });
    });
  }

  request(method: any, url: string, headers: any = null, data: any = null): Promise<any> {
    let config = {
      method: method,
      url: this.constantService.getRemoteServer() + "/" + url,
    };
    if((method == 'post' || method == 'put') && data)
      config['data'] = data;
    if(headers)
      config['headers'] = headers;
    return this.requestByConfig(config);
  }

  read(url) {
    return this.request('get', url);
    /*return new Promise((resolve, reject) => {
      this.loadingService.changeState(true);
      return axios.get(this.constantService.getRemoteServer() + "/" + url, { headers: {} })
        .then(res => {
          this.resolve(resolve, res);
        }, err => {
          this.reject(reject, err);
        });
    });*/
  }

  post(url, obj) {
    return this.request('post', url, { headers: {"content-type": "application/json"} }, obj);
    // return this.save(url, obj);
  }

  save(url, obj) {
    return this.request('post', url, { headers: {"content-type": "application/json"} }, obj);
    /*return axios.post(this.constantService.getRemoteServer() + "/" + url,
      obj,
      { headers: {"content-type": "application/json"} });*/
  }

  update(url, obj) {
    return this.request('put', url, { headers: {"content-type": "application/json"} }, obj);
    /*return axios.put(this.constantService.getRemoteServer() + "/" + url,
      obj,
      { headers: {"content-type": "application/json"} });*/
  }

  delete(url, id) {
    return this.request('delete', url + "/" + id);
    // return axios.delete(this.constantService.getRemoteServer() + "/" + url + "/" + id,
    //   { headers: {"content-type": "application/json"} });
  }

  async readAsync(url) {
    return await this.read(url);
    // return await axios.get(this.constantService.getRemoteServer() + "/" + url,
    //   { headers: {} });
  }

  async saveAsync(url, obj) {
    return await this.save(url, obj);
    /*return await axios.post(this.constantService.getRemoteServer() + "/" + url,
      obj,
      { headers: {"content-type": "application/json"} });*/
  }

  async updateAsync(url, obj) {
    return await this.update(url, obj);
    // return await axios.put(this.constantService.getRemoteServer() + "/" + url,
    //   obj,
    //   { headers: {"content-type": "application/json"} });
  }

  async deleteAsync(url, id) {
    return await this.delete(url, id);
    /*return await axios.delete(this.constantService.getRemoteServer() + "/" + url + "/" + id,
      { headers: {"content-type": "application/json"} });*/
  }
}
