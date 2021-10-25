import {Component, Input, OnInit} from '@angular/core';
import {AjaxCallService} from "../../../../../../../services/ajax-call.service";
import {BehaviorSubject} from "rxjs";
import {
  animate,
  query,
  sequence,
  stagger,
  style,
  transition,
  trigger
} from "@angular/animations";

export const DropDownAnimation = trigger("dropDownAnimation", [
  transition(":enter", [
    style({ height: 0, overflow: "hidden" }),
    query(".menu-item", [
      style({ opacity: 0, transform: "translateY(-50px)" })
    ]),
    sequence([
      animate("500ms", style({ height: "*" })),
      query(".menu-item", [
        stagger(-50, [
          animate("200ms ease", style({ opacity: 1, transform: "none" }))
        ])
      ])
    ])
  ]),

  transition(":leave", [
    style({ height: "*", overflow: "hidden" }),
    query(".menu-item", [style({ opacity: 1, transform: "none" })]),
    sequence([
      query(".menu-item", [
        stagger(50, [
          animate(
            "400ms ease",
            style({ opacity: 0, transform: "translateY(-50px)" })
          )
        ])
      ]),
      animate("200ms", style({ height: 0 }))
    ])
  ])
]);

@Component({
  selector: 'app-type-creator',
  templateUrl: './type-creator.component.html',
  styleUrls: ['./type-creator.component.css'],
  animations: [
    DropDownAnimation
  ]
})
export class TypeCreatorComponent implements OnInit {
  @Input() parameterTypeId: number;
  _attributes = [];
  attributes$ = new BehaviorSubject(this._attributes);
  _selectedAttr = null;
  _selectToSwap = null;

  constructor(private ajaxCall: AjaxCallService) { }

  set attributes(_attributes) {
    this._attributes = _attributes;
    this.attributes$.next(this._attributes);
  }

  async ngOnInit() {
    let res = await this.ajaxCall.read("api/modules/riskmanagement/asset-management/settings/consequence-parameters/request-to-create/" + this.parameterTypeId);
    console.log(res)
    if(res.status == 200 && res.data['code'] == 0) {
      console.log(res.data['data'])
      this.attributes = res.data['data'];
      this._attributes.forEach(attr => {
        this.addState(attr);
      })
    }
  }

  addState(attr) {
    attr['_state'] = false;
    attr['state$'] = new BehaviorSubject(attr['_state']);
    attr['state'] = (_state) => {
      if(_state == 0) {
        if(attr['_state'] == true) {
          attr['_state'] = !attr['_state'];
          attr['state$'].next(attr['_state']);
        }
      } else {
        attr['_state'] = !attr['_state'];
        attr['state$'].next(attr['_state']);
      }
    }
  }

  editMode = new BehaviorSubject(false);

  changeToEdit(attr) {
    // this._selectedAttr = attr;
    this._attributes.forEach(a => {
      if(a != attr)
        a['state'].apply(a, [0]);
    })
    attr['state'].apply(attr, [1]);
    this.editMode.next(true);
  }

  cancelEdit(attr) {
    attr['state'].apply(attr, [1]);
    this.editMode.next(false);
    // this._selectedAttr = null;
  }

  selectToSwap(attr) {
    if(this._selectToSwap == null) {
      this._selectToSwap = attr;
    } else {
      this._selectToSwap = null;
    }
  }

  addNewAttribute() {
    this._attributes.push({"id": 0,
      "consequenceParametersTypeId": 0,
      "orders":this._attributes.length + 1,
      "value": 0,
      "label":""});
    this.attributes$.next(this._attributes);
  }
}
