import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import axios from "axios";
import {ConstantService} from "../../services/constant.service";
import {AuthenticationService} from "../..//services/authentication-service.service";
import {LoadingService} from "../../services/loading.service";
import {PianaStorageService} from "../../services/piana-storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuService} from "../../services/menu-service.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit, AfterViewChecked {
  @ViewChild('toggled') toggled: ElementRef;

  istoggled: boolean = false;
  forceShow: boolean = false;

  constructor(public authenticationService: AuthenticationService,
              public menuService: MenuService,
              private loadingService: LoadingService,
              private pianaStorageService: PianaStorageService,
              public constantService: ConstantService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    // console.log(this.toggled['display'])
  }

  ngAfterViewChecked() {
    if(this.toggled) {
      // console.log(window.getComputedStyle(this.toggled.nativeElement).visibility)
      this.istoggled = true;
    }
  }

  forceShowClick() {
    // console.log(window.getComputedStyle(this.toggled.nativeElement).visibility)
    // console.log("asfasd", this.toggled.nativeElement.getAttribute('display'), this.toggled.nativeElement)
    if(this.toggled)
      this.istoggled = true;
    this.forceShow = !this.forceShow
  }

  windowRef=null;
  interval = 0;

  // async openLoginWindow() {
  //   // console.log(localStorage.getItem('currentUser'));
  //   // console.log(localStorage.getItem('currentUser')['username']);
  //   this.authenticationService.initialToSignIn().then(redirectUrl => {
  //     if(redirectUrl) {
  //       this.windowRef= window.open(redirectUrl,"child", "toolbar=no,location=no,directories=no,status=no,menubar=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=430,height=520,left=500,top=100");
  //       this.interval = setInterval(() => { this.loginWindowClosedCheck(); }, 1000);
  //     }
  //   }, err => {
  //     console.log("error")
  //   });
  //
  // }

  // loginWindowClosedCheck(){
  //   if(this.windowRef.closed) {
  //     console.log("closed")
  //     clearInterval(this.interval);
  //     this.loadingService.changeState(true);
  //     this.authenticationService.login().then(res => {
  //       this.loadingService.changeState(false);
  //     }, err => {
  //       this.loadingService.changeState(false);
  //     });
  //   }
  // }
}
