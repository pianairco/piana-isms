import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SidebarService} from '../../services/sidebar.service';
import {animate, state, style, transition, trigger} from "@angular/animations";
import * as moment from "jalali-moment";
import {ShareStateService} from "../../services/share-state.service";
import {GeneralStateService} from "../../services/general-state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slide', [
      state('up', style({ 'pointer-events': 'auto', opacity: 1 })),
      state('down', style({ 'pointer-events': 'none', opacity: 0 })),
      transition('up <=> down', animate(500))
    ])
  ]
})
export class HomeComponent implements OnInit {
  public sidebarState2 = false;

  constructor(public shareStateService: ShareStateService,
              public sidebarservice: SidebarService,
              public router: Router,
              public generalStateService: GeneralStateService) {
  }

  ngOnInit(): void {
  }

  logout() {
    console.log("logout")
    this.router.navigate(['/logout'])
  }

  getState() {
    return this.sidebarservice.getSidebarState() ? 'down' : 'up';
  }

  toggleSidebar() {
    console.log(this.sidebarservice.getSidebarState())
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }
  toggleBackgroundImage() {
    this.sidebarservice.hasBackgroundImage = !this.sidebarservice.hasBackgroundImage;
  }
  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
    this.sidebarservice.setSidebarState(true);
  }

  getTime() {
    return moment().locale('fa').format('DD jMMM YYYY');
    // return moment().locale('fa').format('YYYY/MM/DD');
  }
}
