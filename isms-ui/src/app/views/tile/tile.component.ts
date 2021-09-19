import { Component, OnInit } from '@angular/core';
import {ShareStateService} from "../../services/share-state.service";

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {

  constructor(public shareStateService: ShareStateService) { }

  ngOnInit(): void {
  }

}
