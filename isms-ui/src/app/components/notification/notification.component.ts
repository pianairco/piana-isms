import { Component, OnInit } from '@angular/core';
import {NotificationModel, NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  selectedMessage = null;
  showMessage = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.currentMessage.subscribe(message => {
      this.selectedMessage = message;
      // console.log(message);
      if (this.selectedMessage instanceof NotificationModel && this.selectedMessage.isShow) {
        console.log(this.selectedMessage)

        this.showMessage = true;
      } else {
        this.showMessage = false;
      }
      // console.log(message.message);
    }); //<= Always get current value!
  }

  clear() {
    this.showMessage = false;
    this.notificationService.clear();
  }
}
