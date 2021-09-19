import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  showLoading = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.currentState.subscribe(state => {
      this.showLoading = state;
      // console.log(state);
    }); //<= Always get current value!
  }

}
