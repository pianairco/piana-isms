import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import {ConstantService} from "../../services/constant.service";
import {AuthenticationService, SiteInfo} from "../../services/authentication-service.service";
import {ShareStateService} from "../../services/share-state.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-data-editor',
  templateUrl: './data-editor.component.html',
  styleUrls: ['./data-editor.component.css']
})
export class DataEditorComponent implements OnInit {
  siteInfo: SiteInfo = new SiteInfo();

  constructor(private route: ActivatedRoute,
              public router: Router,
              public constantService: ConstantService,
              public shareStateService: ShareStateService,
              public authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authService.authSubject.subscribe(appInfo => {
      this.siteInfo = appInfo.siteInfo;
    });
    // axios.get('/api/message').then(res => {
    //   console.log(res);
    // }, err => {
    //   console.log(err);
    // })
  }

  windowRef = null;
  uuid = null;
  interval = 0;

}
