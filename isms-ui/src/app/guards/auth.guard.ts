import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs';
import {PianaStorageService} from "../services/piana-storage.service";
import {AppInfo, AuthenticationService} from "../services/authentication-service.service";
import axios from "axios";
import {ConstantService} from "../services/constant.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  appInfo: AppInfo;

  constructor(
    private authenticationService: AuthenticationService,
    private pianaStorageService: PianaStorageService,
    private constantService: ConstantService,
    private router: Router,
    private route: ActivatedRoute) {
    authenticationService.authSubject.subscribe(res => {
      this.appInfo = res;
    })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log(route)
    // console.log(route['routeConfig']['path'])
    // console.log(state['url'])
    // console.log(state['url'].startsWith('/login'))
    // console.log(localStorage.getItem('currentUser'))
    // console.log(((state['url'].startsWith('login') || state['url'].startsWith('/login')) && localStorage.getItem('currentUser') != null))
    // console.log(state)
    // console.log(route)
    // console.log(localStorage.getItem('currentUser'));
    // let appInfo = this.pianaStorageService.getObject('appInfo');
    // console.log(appInfo);
    console.log("subdomain0", state['url']);
    // return false;
    if(state['url'].startsWith('login') || state['url'].startsWith('/login')) {
      console.log("subdomain00", state.root.queryParams['subDomain']);
      if(this.appInfo === null || this.appInfo['isLoggedIn'] === false) {
        console.log("subdomain01", state['url']);
        // if((route['routeConfig']['path'].startsWith('login') || route['routeConfig']['path'].startsWith('/login')) && localStorage.getItem('currentUser')) {
        // this.router.navigate(['/home'], { queryParams: { returnUrl: state.url }});
        return true;
      } else {
        let subDomain = state.root.queryParams['sub-domain'];
        if(subDomain) {
          console.log("has sub-domain", subDomain);
          axios.post(this.constantService.getRemoteServer() + '/api/sign-in/sub-domain/set-principal',
            { uuid: subDomain},
            { headers: { 'Content-Type': 'APPLICATION/JSON', 'auth-type': 'principal' } }).then(
              res => {
                if(res.status == 200) {
                  window.close();
                  return true;
                }
              }, err => {

            });
        }
        this.router.navigate(['/tile/home']);
        return false;
      }
    } else if(state['url'].startsWith('logout') || state['url'].startsWith('/logout')) {
      // console.log("gaurd => logout", appInfo)
      if(this.appInfo === null || this.appInfo['isLoggedIn'] === false) {
        // if((route['routeConfig']['path'].startsWith('login') || route['routeConfig']['path'].startsWith('/login')) && localStorage.getItem('currentUser')) {
        // this.router.navigate(['/home'], { queryParams: { returnUrl: state.url }});
        return false;
      } else {
        try {
          this.authenticationService.logout();
          return true;
        } catch (err) {
          return false;
        }
      }
    } else {
      if (this.appInfo['isLoggedIn'] === true) {
        return true;
        // if (this.appInfo['isFormPassword'] === false) {
        //   if(state['url'].startsWith('tile/password-setting') || state['url'].startsWith('/tile/password-setting')) {
        //     return true;
        //   } else {
        //     this.router.navigate(['/tile/password-setting'], { queryParams: { returnUrl: state.url }});
        //     return false;
        //   }
        // } else {
        //   // logged in so return true
        //   // console.log(localStorage.getItem('currentUser'))
        //   return true;
        // }
      } else {
        // not logged in so redirect to login page with the return url
        // console.log(state.url)
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
      }
    }
  }

}
