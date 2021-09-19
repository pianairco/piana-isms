import {Injectable} from '@angular/core';
import axios from "axios";
import {PianaStorageService} from "./piana-storage.service";
import {ConstantService} from "./constant.service";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  uuid = null;
  private _menuSubject: any;
  private _menu: Menu[] = null;

  setMenu(menu: Menu[]) {
    this._menu = menu;
    console.log(this._menu)
    this._menuSubject.next(this._menu);
  }

  constructor(
    private constantService: ConstantService,
    private pianaStorageService: PianaStorageService) {
    this._menu = [];
    this._menuSubject = new BehaviorSubject<any>(this._menu);
  }

  get menuSubject(): Observable<Menu[]> {
    return this._menuSubject.asObservable();
  }

  async getMenu() {
    // return new Promise((resolve, reject) => {
    // })
    try {
      let res = await axios.get('api/modules/general/menu/list',
        { headers: { } });
      if (res.status === 200) {
        this.setMenu(res['data']);
      }
    } catch(err) {
      console.log(err)
    }
  }
}

export class Menu {
  id: number;
  type: string;
  active: number;
  icon: string;
  badge: { class: string, text: string};
  parentId: number;
  title: string;
  link: string;
  children: Menu[];

  constructor(id, parentId, title, link, children) {
    this.id = id;
    this.parentId = parentId;
    this.title = title;
    this.link = link;
    this.children = children;
  }
}
