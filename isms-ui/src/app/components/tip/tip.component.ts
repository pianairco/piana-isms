import { Component, OnInit } from '@angular/core';
import {AuthenticationService, SiteInfo} from "../../services/authentication-service.service";
import {ShareStateService} from "../../services/share-state.service";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.css']
})
export class TipComponent implements OnInit {
  siteInfo: SiteInfo = new SiteInfo();
  isEditedMode: boolean = false;
  tabName: string = 'text';
  // bac = 'https://shop.piana.ir:8443/assets/header/4Tb9tC59dg1Wd0…tJJHiPn10uDUml5jz2G424JWWUyjoLbjtwiG3C84TvB9.jpeg';

  constructor(
    private loadingService: LoadingService,
    public authService: AuthenticationService,
              public shareStateService: ShareStateService) { }

  ngOnInit(): void {
    this.authService.authSubject.subscribe(appInfo => {
      this.siteInfo = appInfo.siteInfo;
    });
  }

  updateSiteInfo() {
    this.authService.updateSiteInfoTip(this.siteInfo);
  }
}
