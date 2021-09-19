import { Component, OnInit } from '@angular/core';
import {AuthenticationService, SiteInfo} from "../../services/authentication-service.service";
import {ShareStateService} from "../../services/share-state.service";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  siteInfo: SiteInfo = new SiteInfo();
  isEditedMode: boolean = false;
  tabName: string = 'text';
  image: string = null;
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
    this.authService.updateSiteInfoHeaderText(this.siteInfo);
  }

  tabChange(tabName) {
    this.tabName = tabName;
  }

  selectImage(image) {
    this.loadingService.changeState(true);
    this.image = image;
    this.authService.updateSiteInfoHeaderImage(this.image).then(res => {
      this.siteInfo.headerImage = this.image;
      this.loadingService.changeState(false);
    }, err => {
      this.image = null
      this.loadingService.changeState(false);
    });
  }
}
