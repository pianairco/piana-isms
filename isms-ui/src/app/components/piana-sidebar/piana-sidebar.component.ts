import { Component, OnInit } from '@angular/core';
import {Menu, MenuService} from "../../services/menu-service.service";
import {SidebarService} from "../../services/sidebar.service";
import {AuthenticationService} from "../../services/authentication-service.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-piana-sidebar',
  templateUrl: './piana-sidebar.component.html',
  styleUrls: ['./piana-sidebar.component.css'],
  animations: [
    trigger('slide', [
      state('up', style({ width: 0, opacity: 1 })),
      state('down', style({ width: '*', opacity: 1 })),
      transition('up <=> down', animate(300))
    ]),
    trigger('slide3', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(300))
    ])
  ]
})
export class PianaSidebarComponent implements OnInit {

  menus: Menu[];
  constructor(public menuService: MenuService,
              public sidebarservice: SidebarService,
              public authService: AuthenticationService) {
    menuService.menuSubject.subscribe(m => {
      this.menus = m;
      console.log(m)
    });

  }

  ngOnInit(): void {
  }

  getSideBarState(): boolean {
    return this.sidebarservice.getSidebarState();
  }

  toggleSidebar() {
    console.log(this.sidebarservice.getSidebarState())
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }

  toggle(currentMenu): void {
    if (currentMenu.type === 'dropdown') {
      this.menus.forEach(element => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          // element.active = false;
        }
      });
    }
  }

  getState2() {
    return this.sidebarservice.getSidebarState() ? 'up' : 'down';
  }

  getState3() {
    return this.sidebarservice.getSidebarState() ? 'closed' : 'open';
  }

  getState(currentMenu): string {

    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

  hasBackgroundImage(): boolean {
    return this.sidebarservice.hasBackgroundImage;
  }

}
