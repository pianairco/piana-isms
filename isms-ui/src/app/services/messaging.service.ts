import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MessageDialogComponent, MessageType} from "../components/dialog/message-dialog/message-dialog.component";
import {ConfirmDialogComponent} from "../components/dialog/confirm-dialog/confirm-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  dialogRef = null;

  constructor(public dialog: MatDialog) { }

  showMessage(messageType: MessageType, title: string, message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(!this.dialogRef) {
        this.dialogRef = this.dialog.open(MessageDialogComponent, {
          disableClose: true,
          width: '600px',
          data: {
            title: title,
            message: message,
            messageType: messageType
          },
          maxHeight: '100vh'
        });
        this.dialogRef.afterClosed().subscribe(result => {
          this.dialogRef = null;
          resolve(true);
        }, error => {
          resolve(false);
        });
      } else {
        reject(false);
      }
    });

  }

  confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(!this.dialogRef) {
        this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
          disableClose: true,
          width: '600px',
          data: {
            title: title,
            message: message,
          },
          maxHeight: '100vh'
        });
        this.dialogRef.afterClosed().subscribe(result => {
          this.dialogRef = null;
          resolve(result['status']);
        }, error => {
          reject(false);
        });
      } else {
        reject(false);
      }
    });

  }
}
