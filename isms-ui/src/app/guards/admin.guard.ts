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
import {AuthenticationService} from "../services/authentication-service.service";
import {ShareStateService} from "../services/share-state.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private shareStateService: ShareStateService,
    private router: Router,
    private route: ActivatedRoute) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticationService.isAdmin();
    // console.log(route)
    // console.log(route['routeConfig']['path'])
    // console.log(state['url'])
    // console.log(state['url'].startsWith('/login'))
    // console.log(localStorage.getItem('currentUser'))
    // console.log(((state['url'].startsWith('login') || state['url'].startsWith('/login')) && localStorage.getItem('currentUser') != null))
    // console.log(state)
    // console.log(route)
    // console.log(localStorage.getItem('currentUser'));
    // let appInfo = this.authenticationService.getAppInfo();
    // console.log(appInfo);
    /*if (appInfo['isLoggedIn'] === true && appInfo['isAdmin'] === true) {
      return true;
    } else {
      // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }*/
  }

}
