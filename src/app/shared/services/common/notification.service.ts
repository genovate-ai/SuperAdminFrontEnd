import { Injectable } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { AlertModel } from '../../models/Alert.Model'
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {

  loading: boolean;
  alert = new Subject<AlertModel>();
  constructor() {

  }
  showNotification(alert: AlertModel) {
    this.alert.next(alert);
    
  }

}
