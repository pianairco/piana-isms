import {Component, Input, OnInit} from '@angular/core';
import {Menu, MenuService} from "../../services/menu-service.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {log} from "util";

@Component({
  selector: 'app-piana-dropdown',
  templateUrl: './piana-dropdown.component.html',
  styleUrls: [ './piana-dropdown.component.css' ],
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
export class PianaDropdownComponent implements OnInit {
  @Input() menu: Menu;
  @Input() menus: Menu[];

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    console.log(this.menu)
  }

  getState(currentMenu): string {
    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

  toggle(currentMenu): void {
    if (currentMenu.type === 'dropdown') {
      console.log(currentMenu['parent_id'])
        let sibling = this.menuService.findChildren(currentMenu['parent_id']);
        sibling.forEach(element => {
        console.log(currentMenu.id, element.id)
        if (element.id === currentMenu.id) {
          currentMenu.active = !currentMenu.active;
        } else {
          if(element.active) {
            let childs = this.menuService.findChildren(element['id']);
            childs.forEach(element => {
              if (element.type === 'dropdown') {
                element.active = 0;
              }
            });
            element.active = 0;
          }
        }
      });

    }
  }
}
