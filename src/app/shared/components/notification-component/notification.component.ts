import { Component, OnInit } from '@angular/core';
import { NotificationServiceService } from '../../services/common/notification.service';
import { AlertModel } from '../../models/Alert.Model';
import { debounceTime } from 'rxjs/operators'
@Component({
  selector: 'app-notification-component',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {


  constructor(public notification: NotificationServiceService) { }

  ngOnInit() {

    this.notification.alert.subscribe(message => {
      this.message = message;

    })
  }


  ngAfterViewInit(): void {
    if(typeof(this.message)!='undefined'){
      if(this.message.type == 'upload'){
        document.getElementsByTagName("button")[0].setAttribute("class", "d-none");
        // div.item
      }
    }

    document.onclick = (args: any) : void => {
      if(this.message) {
          if(this.message.type != 'upload')
          {
            this.close();

          }
        }
      }
  }

 public message: AlertModel
  close() {
    if(this.message.isUserExplicitEvent) {
      this.message.isUserExplicitEvent = null;
    } else {
      this.message = null
    }
  }
}
