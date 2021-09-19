import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from "jalali-moment";
import {AjaxCallService} from "../../services/ajax-call.service";
import {SearchBoxService} from "./search-box.service";
import {MatDialog} from "@angular/material/dialog";
import {InjectableDialogComponent} from "./injectable-dialog.component";

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  @Input() config: SearchBoxConfigModel;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  lastEmpty = 0;
  selectableMap = {};
  injectableMap = {};
  injectableModel = {};

  // fromDateObject = moment('1400-11-22','jYYYY,jMM,jDD');
  // toDateObject = moment('1400-11-22','jYYYY,jMM,jDD');

  constructor(private searchBoxService: SearchBoxService,
              public dialog: MatDialog) { }

  async ngOnInit() {
    console.log(this.config)
    let sizes = 0;

    if(this.config) {
      for (let field of this.config.fields) {
        this.selectableMap[field.name] = this.searchBoxService.getSelectableSubject(field.name);/*.subscribe(res => {
          this.selectableMap[field.name] =
        });*/
        sizes += field.size;
        if(field.selectables)
          console.log(field.selectables, field.selectables.substr(5, field.selectables.length - 5))
        if(field.selectables && typeof field.selectables == 'string'
          && field.selectables.length > 5 && field.selectables.startsWith('rest:')) {
          this.searchBoxService.call(field.name, field.selectables.substr(5, field.selectables.length - 5));
        } else {
          this.selectableMap[field.name] = field.selectables;
        }
        if (field.type === 'empty') {
        } else if (field.type === 'string') {
          this.config.values[field.name] = field.default ? field.default : '';
          if(field.injectable) {
            this.injectableMap[field.name] = false;
          }
        } else if (field.type === 'jalali') {
          this.config.values[field.name] = field.default ? moment(field.default,'jYYYY,jMM,jDD') : moment();
        } else if (field.type === 'multi-select') {
          this.config.values[field.name] = field.default ? field.default : '';
          // console.log(this.selectableMap[field.name])
        } else if (field.type === 'select') {
          this.config.values[field.name] = field.default ? field.default : '';
          // console.log(this.selectableMap[field.name])
        }
      }
    }
    this.lastEmpty = 12 - (sizes % 12);
    console.log(this.config)
  }

  okClick() {
    let obj = {};
    for(let field of this.config.fields) {
      if(field.type === 'date' && this.config.values[field.name]) {
        obj[field.name] = moment(this.config.values[field.name]).format('jYYYY/jMM/jDD');
      } else if(field.type != 'empty') {
        obj[field.name] = this.config.values[field.name];
      }
    }

    this.notifyParent.emit(obj);
    console.log(obj);
  }

  injectableClick(field) {
    this.injectableMap[field.name] = !this.injectableMap[field.name];
    const dialogRef = this.dialog.open(InjectableDialogComponent, {
      width: '100%',
      data: {
        component: field.injectable
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${JSON.stringify(result)}`);
      this.injectableMap[field.name] = false;
      this.injectableModel[field.name] = result['data'];
      this.config.values[field.name] = result['data']['number'];
    });
  }
}

export class SearchBoxFieldModel {
  type: string;
  title: string;
  name: string;
  default: string;
  size: number;
  selectables: any;
  injectable: string;

  constructor(type, size) {
    this.type = type;
    this.size = size;
  }

}

export class SearchBoxConfigModel {
  fields: SearchBoxFieldModel[];
  _values: object;
  title: string;

  get values(): object {
    return this._values;
  }

  set values(field) {
    this._values[field['name']] = field['value'];
  }

  constructor(fields: SearchBoxFieldModel[], title: string) {
    this.fields = fields;
    this.title = title;
    this._values = {};
  }
}
