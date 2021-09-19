import {Injectable} from '@angular/core';
import {AuthenticationService} from "./authentication-service.service";
import {PianaStorageService} from "./piana-storage.service";
import {MenuService} from "./menu-service.service";

@Injectable({
  providedIn: 'root'
})
export class InitializerService {

  constructor(
    private pianaStorageService: PianaStorageService,
    private menuService: MenuService,
    private authenticationService: AuthenticationService) { }

  load(): Promise<any> {
    this.menuService.getMenu();
    return this.authenticationService.getAppInfo();
    /*return new Promise((resolve, reject) => {
      // let appInfo = {
      //   username: "anonymousUser",
      //   email: null,
      //   pictureUrl: null,
      //   isLoggedIn: false,
      //   isFormPassword: false,
      //   isAdmin: false
      // };
      // this.pianaStorageService.putObject('appInfo', appInfo);
      // resolve.apply(appInfo);
      axios.post('api/app-info', {}, {headers: {}}).then(res => {
        if(res.status === 200) {
          let appInfo = res['data'];
          // console.log(appInfo);
          // console.log(JSON.stringify(appInfo));
          // console.log(localStorage.getItem('appInfo'));

          this.pianaStorageService.putObject('appInfo', appInfo);
          // localStorage.setItem('currentUser', JSON.stringify(appInfo))
          // console.log(this.pianaStorageService.getObject('appInfo')['username'])
          // console.log(this.pianaStorageService.getFieldValue('appInfo', 'username'))
          // console.log(JSON.parse(localStorage.getItem('appInfo'))['username'])

          resolve.apply(appInfo);
        } else {
          reject()
        }
      }, err => {
        reject(err);
      });
    });*/
    // try {
    //   let res = await axios.post('api/app-info', {}, {headers: {}});
    // } catch (err) {
    //
    // }
  }
}
