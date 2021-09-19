import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {AuthenticationService} from "../../services/authentication-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent {
  constructor(
    private titleService:Title,
    private authenticationService: AuthenticationService) {
    authenticationService.authSubject.subscribe(appInfo => {
      console.log(appInfo)
      this.titleService.setTitle(appInfo.siteInfo.title);
    });
  }
}
