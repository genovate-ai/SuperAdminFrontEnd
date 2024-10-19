import { Injectable } from '@angular/core';
import { Constants } from '../../helper/Constants';
import { API_CALLEVENTGROUP_CODE, SCREEN_CODE } from '../../helper/Enums';
import { AlertModel, AlertType, HeaderType } from '../../models/Alert.Model';
import { NotificationServiceService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingNotificationService {

  constructor(protected notification: NotificationServiceService,) { }
  ProcessSaveFail(message,isUserExplicitEvent:boolean = false) {
    this.ShowErrorNotification(message,isUserExplicitEvent);

  }
  ShowErrorNotification(message,isuserexplicitEvent) {

    const alertEr: AlertModel = { type: AlertType.DANGER, message: message, header: HeaderType.ERROR,isUserExplicitEvent : isuserexplicitEvent};
    this.notification.showNotification(alertEr);

  }
  ProcessSaveSuccess(message,isUserExplicitEvent:boolean = false) {

    this.ShowSuccessNotification(message,isUserExplicitEvent);
  }
  ShowSuccessNotification(message,isUserExplicitEvent) {

    const alert: AlertModel = { type: AlertType.SUCCESS, message: message, header: HeaderType.SUCCESS,isUserExplicitEvent : isUserExplicitEvent };
    this.notification.showNotification(alert);

  }
  showLoader(screen: SCREEN_CODE, apiCallEvent: API_CALLEVENTGROUP_CODE) {

    if (Constants.showLoader) {
      this.notification.loading = true;
    }

  }
  hideLoader(screen: SCREEN_CODE, apiCallEvent: API_CALLEVENTGROUP_CODE) {

    if (Constants.showLoader) {
      this.notification.loading = false;
    }
  }
}
