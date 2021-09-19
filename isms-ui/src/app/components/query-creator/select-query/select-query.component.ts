import {Component, Input, OnInit} from '@angular/core';
import {QueryCreatorService, QuerySpec, SelectQueryStructure} from "../query-creator.service";

@Component({
  selector: 'app-select-query',
  templateUrl: './select-query.component.html',
  styleUrls: ['./select-query.component.css']
})
export class SelectQueryComponent implements OnInit {
  @Input() selectQueryStructure: SelectQueryStructure = null;
  @Input() templateQueryStructure: SelectQueryStructure = null;
  @Input() querySpec: QuerySpec;

  constructor(public qcService: QueryCreatorService) {
  }

  ngOnInit(): void {
    if(!this.selectQueryStructure) {
      this.selectQueryStructure = this.qcService.getSelectQueryStructure(this.querySpec);
      console.log(this.selectQueryStructure)
    } else {
    }
  }

  addColumn(type) {

  }
}
