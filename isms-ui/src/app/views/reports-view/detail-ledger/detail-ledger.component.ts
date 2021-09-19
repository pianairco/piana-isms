import { Component, OnInit } from '@angular/core';
import {GeneralStateService} from "../../../services/general-state.service";

@Component({
  selector: 'app-detail-ledger',
  templateUrl: './detail-ledger.component.html',
  styleUrls: ['./detail-ledger.component.css']
})
export class DetailLedgerComponent implements OnInit {

  constructor(private generalStateService: GeneralStateService) {
    this.generalStateService.title = "دفتر تفصیل";
  }

  ngOnInit(): void {
  }

}
