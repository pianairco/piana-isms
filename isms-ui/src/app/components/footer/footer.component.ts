import {Component, OnInit} from '@angular/core';
import {AuthenticationService, SiteInfo} from "../../services/authentication-service.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  siteInfo: SiteInfo = new SiteInfo();

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.authSubject.subscribe(appInfo => {
      this.siteInfo = appInfo.siteInfo;
    });
  }

}
