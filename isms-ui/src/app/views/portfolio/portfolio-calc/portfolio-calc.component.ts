import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as moment from 'jalali-moment';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {InstrumentSelectable, InstrumentSelectableService} from "../../../services/instrument-selectable.service";

@Component({
  selector: 'app-portfolio-calc',
  templateUrl: './portfolio-calc.component.html',
  styleUrls: ['./portfolio-calc.component.css']
})
export class PortfolioCalcComponent implements OnInit {
  @ViewChild('instrument') instrumentInput: ElementRef;

  model = {
    startDate: moment(),
    endDate: moment(),
    instrumentId: 0,
  }

  filteredOptions: Observable<InstrumentSelectable[]>;
  myControl = new FormControl();

  constructor(public instrumentSelectableService: InstrumentSelectableService) {
    this.instrumentSelectableService.instrumentsSubject.subscribe(res => {
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });

    this.filteredOptions.subscribe(r => {
      if (r && r.length == 1) {
        this.model.instrumentId = r[0].id;
      }
    })
  }

  doWork() {
    let filter = this._filter(this.instrumentInput.nativeElement.value);
    if(filter && filter.length === 1 && filter[0].name === this.instrumentInput.nativeElement.value) {
      console.log(this.model.instrumentId)
    }
  }

  showInfoIcon() {
    if(!this.instrumentInput)
      return false
    let filter = this._filter(this.instrumentInput.nativeElement.value);
    if(filter && filter.length === 1 && filter[0].name === this.instrumentInput.nativeElement.value)
      return true;
    return false;
  }

  private _filter(value: string): InstrumentSelectable[] {
    const filterValue = value.toLowerCase();

    return this.instrumentSelectableService.instruments
      .filter(option => option != null && option.name != null)
      .filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit(): void {
    this.instrumentSelectableService.fetch();
  }

}
