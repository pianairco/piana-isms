import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PianaStorageService} from "../../services/piana-storage.service";
import {LoadingService} from "../../services/loading.service";
import axios from "axios";
import {ConstantService} from "../../services/constant.service";
import { isDevMode } from '@angular/core';
import {AjaxCallService} from "../../services/ajax-call.service";
import {BehaviorSubject, Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showModal: boolean = true;
  hide = true;
  wait = false;
  selected: Selectable;
  public _funds: Selectable[] = [];
  myControl = new FormControl();

  loginInfo: {
    username: '',
    password: '',
    captcha: '',
    accessToken: ''
  }
  captchaCounter: number = 0;
  returnUrl: string;
  subDomain = null;

  constructor(
    private ajaxCall: AjaxCallService,
    private pianaStorageService: PianaStorageService,
    private loadingService: LoadingService,
    private constantService: ConstantService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    console.log("on login component init", this.subDomain)
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.subDomain = this.route.snapshot.queryParams['sub-domain'];
    //   console.log("--------- param -----------")
    console.log(this.subDomain, this.returnUrl)
    this.loginInfo = {
      username: '',
      password: '',
      captcha: '',
      accessToken: ''
    }

    axios.get('resources/captcha', { headers: { withCredentials: true } })
      .then(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
  }

  renewCaptcha() {
    this.captchaCounter++;
  }

  public displayFn(obj) {
    console.log(obj)
    if(obj)
      return obj['title'];
    return '';
  }

  public getLinkPicture() {
    return 'resources/captcha' + '?' + this.captchaCounter;
  }

  login() {
    let promise = this.authenticationService.login(this.loginInfo);
    promise.then(appInfo => {
      console.log(appInfo);
      this.router.navigate([this.returnUrl]);
    }, err => {
      console.log(this.myControl);
      this.captchaCounter++;
    });
    // axios.post('api/sign-in', this.loginInfo, {headers: {}})
    //   .then(res => {
    //     console.log(res);
    //   }, err => {
    //     this.timeStamp = this.timeStamp + 1;
    //     console.log(err);
    //   });
  }
}

export class Selectable {
  title: string;
  value: any;
}
