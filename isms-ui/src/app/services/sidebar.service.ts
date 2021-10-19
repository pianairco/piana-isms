import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  toggled = true;

  _hasBackgroundImage = true;
  menus = [
    {
      title: 'تنظیمات',
      type: 'header'
    },
    {
      title: 'دفتر تلفن',
      icon: 'fa fa-book',
      active: false,
      type: 'simple',
      link: '/home/book'
      // badge: {
      //   text: 'Beta',
      //   class: 'badge-primary'
      // },
    },
    {
      title: 'ارسال پیامک',
      icon: 'fas fa-envelope',
      active: false,
      type: 'dropdown',
      children: [
        {
          title: 'ارسال گروهی',
          icon: 'far fa-share-square',
          active: false,
          type: 'simple',
          link: '/home/group-sender'
        },
        {
          title: 'ارسال تکی',
          icon: 'fa fa-globe',
          active: false,
          type: 'simple',
          link: '/home/sms-sender'
        },
      ]
    },
    {
      title: 'گزارشگیری',
      icon: 'fa fa-chart-line',
      active: false,
      type: 'simple',
      link: '/home/reporting'
    },
    {
      title: 'گروهی',
      icon: 'fa fa-tachometer-alt',
      active: false,
      type: 'simple',
      link: '/home/group'
    },
    {
      title: 'خروج',
      icon: 'fa fa-folder',
      active: false,
      type: 'simple',
      link: ''
    }
  ];
  constructor() { }

  toggle(): void {
    this.toggled = ! this.toggled;
  }

  getSidebarState(): boolean {
    return this.toggled;
  }

  setSidebarState(state: boolean): void {
    this.toggled = state;
  }

  getMenuList(): any {
    return this.menus;
  }

  get hasBackgroundImage(): boolean {
    return this._hasBackgroundImage;
  }

  set hasBackgroundImage(hasBackgroundImage) {
    this._hasBackgroundImage = hasBackgroundImage;
  }
}
