import {Injectable} from '@angular/core';
import axios from "axios";
import {PianaStorageService} from "./piana-storage.service";
import {LoadingService} from "./loading.service";
import {ConstantService} from "./constant.service";
import {BehaviorSubject, Observable} from "rxjs";
import {EditModeObject} from "./share-state.service";
import {GeneralStateService} from "./general-state.service";
// import {GoogleLoginProvider, SocialAuthService} from "angularx-social-login";

const googleLoginOptions = {
  scope: 'profile email',
  prompt: 'select_account'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  uuid = null;
  private _authSubject: any;
  private _appInfo: AppInfo = null;

  setAppInfo(appInfo: AppInfo) {
    this._appInfo = appInfo;
    console.log(this._appInfo)
    this._authSubject.next(this._appInfo)
  }

  constructor(
    /*private authService: SocialAuthService,*/
    private constantService: ConstantService,
    private loadingService: LoadingService,
    private generalStateService: GeneralStateService,
    private pianaStorageService: PianaStorageService) {
    this._appInfo = new AppInfo(
      false, null, null, false, false);
    this._authSubject = new BehaviorSubject<any>(this._appInfo);
  }

  get authSubject(): Observable<AppInfo> {
    return this._authSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return this._appInfo.isLoggedIn;
  }

  isAdmin(): boolean {
    return this._appInfo.isAdmin;
  }

  async initialToSignIn() {
    try {
      let res = await axios.post('api/sign-in/sub-domain', {}, {headers: {"content-type": "application/json"}});
      this.uuid = res.data['uuid'];
      return res.data['redirect'];
    } catch(err) {
      console.log(err)
    }
  }

  async getAppInfo() {
    let res = await axios.post('api/app-info', {}, {headers: {}});
    if (res.status === 200) {
      this.setAppInfo(res['data']);
      // console.log(appInfo);
      // console.log(JSON.stringify(appInfo));
      // console.log(localStorage.getItem('appInfo'));

      // this.pianaStorageService.putObject('appInfo', this.appInfo);
      // localStorage.setItem('currentUser', JSON.stringify(appInfo))
      // console.log(this.pianaStorageService.getObject('appInfo')['username'])
      // console.log(this.pianaStorageService.getFieldValue('appInfo', 'username'))
      // console.log(JSON.parse(localStorage.getItem('appInfo'))['username'])
    }
  }

/*  getSiteInfo(siteInfo): Promise<SiteInfo> {
    return new Promise((resolve, reject) => {
      axios.put('/api/modules/site/info', siteInfo, {headers: {}}).then(
        res => {
          if (res.status === 200) {
            // this._appInfo.siteInfo.title = res['data']['data']['title'];
            // this._appInfo.siteInfo.description = res['data']['data']['description'];
            // this.setAppInfo(this._appInfo);
          }
        }, err => {
        }
      );

    });
  }*/

  async updateSiteInfoTip(siteInfo) {
    let res = await axios.put('/api/modules/site/site-info/tip', {
      'tipTitle': siteInfo.tipTitle,
      'tipDescription': siteInfo.tipDescription
    }, {headers: {}});
    if (res.status === 200) {
      this._appInfo.siteInfo.tipTitle = res['data']['data']['tipTitle'];
      this._appInfo.siteInfo.tipDescription = res['data']['data']['tipDescription'];
      this.setAppInfo(this._appInfo);
      // console.log(appInfo);
      // console.log(JSON.stringify(appInfo));
      // console.log(localStorage.getItem('appInfo'));

      // this.pianaStorageService.putObject('appInfo', this.appInfo);
      // localStorage.setItem('currentUser', JSON.stringify(appInfo))
      // console.log(this.pianaStorageService.getObject('appInfo')['username'])
      // console.log(this.pianaStorageService.getFieldValue('appInfo', 'username'))
      // console.log(JSON.parse(localStorage.getItem('appInfo'))['username'])
    }
  }

  async updateSiteInfoHeaderText(siteInfo) {
    let res = await axios.put('/api/modules/site/site-info/header-text', {
      'title': siteInfo.title,
      'description': siteInfo.description
    }, {headers: {}});
    if (res.status === 200) {
      this._appInfo.siteInfo.title = res['data']['data']['title'];
      this._appInfo.siteInfo.description = res['data']['data']['description'];
      this.setAppInfo(this._appInfo);
      // console.log(appInfo);
      // console.log(JSON.stringify(appInfo));
      // console.log(localStorage.getItem('appInfo'));

      // this.pianaStorageService.putObject('appInfo', this.appInfo);
      // localStorage.setItem('currentUser', JSON.stringify(appInfo))
      // console.log(this.pianaStorageService.getObject('appInfo')['username'])
      // console.log(this.pianaStorageService.getFieldValue('appInfo', 'username'))
      // console.log(JSON.parse(localStorage.getItem('appInfo'))['username'])
    }
  }

  async updateSiteInfoHeaderImage(image) {
    let res = await axios.put('/api/modules/site/site-info/header-image', {
      'headerImage': image
    }, {headers: {}});
    if (res.status === 200) {
      this._appInfo.siteInfo.headerImage = res['data']['data']['headerImage'];
      this.setAppInfo(this._appInfo);
      // console.log(appInfo);
      // console.log(JSON.stringify(appInfo));
      // console.log(localStorage.getItem('appInfo'));

      // this.pianaStorageService.putObject('appInfo', this.appInfo);
      // localStorage.setItem('currentUser', JSON.stringify(appInfo))
      // console.log(this.pianaStorageService.getObject('appInfo')['username'])
      // console.log(this.pianaStorageService.getFieldValue('appInfo', 'username'))
      // console.log(JSON.parse(localStorage.getItem('appInfo'))['username'])
    }
  }

  async login(loginInfo) {
    try {
      let res = await axios.post(this.constantService.getRemoteServer() + '/api/sign-in',
        loginInfo,
        { headers: { 'Content-Type': 'APPLICATION/JSON', tenant: 'support' } });
      console.log(res);
      this.setAppInfo(res['data']);
      // this.pianaStorageService.putObject('appInfo', this._appInfo);
      // return this.appInfo;
      return this._appInfo;
    } catch (err) {
      throw err;
    }
  }

  async logout() {
    console.log("auth service logout")
    // remove user from local storage to log user out
    try {
      // let appInfo = this.pianaStorageService.getObject('appInfo');
      if(!this._appInfo.isLoggedIn)
        return;
      let res = await axios.post('api/sign-out', {headers: {}});
      console.log(res);
      if(res.status == 200) {
        this.setAppInfo(res['data']);
        this.generalStateService.title = '';
        // this.setAppInfo(new AppInfo(null, null, null, false, false));
        // this.pianaStorageService.putObject('appInfo', res['data']);
        // localStorage.removeItem('currentUser');
      }
    } catch (err) {
      // this.timeStamp = this.timeStamp + 1;
      throw err;
    }
  }
}

export class SiteInfo {
  title: string;
  description: string;
  tipTitle: string;
  tipDescription: string;
  headerImage: string;
  instagramLink: string;
  whatsappLink: string;
  facebookLink: string;
  telNumber: string;
}

export class AppInfo {
  username: string;
  email: string;
  pictureUrl: string;
  isLoggedIn: boolean;
  isFormPassword: boolean;
  isAdmin: boolean;
  siteInfo: SiteInfo;

  constructor(username, email, pictureUrl, isLoggedIn, isAdmin) {
    this.username = username;
    this.email = email;
    this.pictureUrl = pictureUrl;
    this.isLoggedIn = isLoggedIn;
    this.isAdmin = isAdmin;
  }
}
