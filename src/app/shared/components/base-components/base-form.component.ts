import { Component, OnInit } from '@angular/core';
import { MessagesCodes, EVENT_CODE, EVENTGROUP_CODE, SCREEN_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AlertModel, AlertType, HeaderType } from 'src/app/shared/models/Alert.Model';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { SelectBox } from '../../models/SelectBox.Model';
import { AccountService } from '../../services/common/account.service';
import { ScreenVPermission } from '../../models/ScreenPermissionV.Model';
import { Constants } from '../../helper/Constants';


// This component just has a controller file. it uses template and stylesheet fron create-user-component.

@Component({
  template: ''
})

export class BaseFormComponent implements OnInit {

  selectItemLimit;
  selectItemLimitSM;

  showloaderTime: Date;
  hidingLoaderTime: Date;
  // MEMO: For Role Security
  screenPermission: ScreenVPermission = {
    screenId: 0,
    isCreateAllow: false,
    isUpdateAllow: false,
    isViewAllow: false,

    isCreateButtonAllow: false,
    isEditButtonAllow: false,
    isDeleteButtonAllow: false,
    isViewButtonAllow: false,
    //isEditSaveButtonAllow: false
  };

  screenPermission1: ScreenVPermission = {
    screenId: 0,
    isCreateAllow: false,
    isUpdateAllow: false,
    isViewAllow: false,

    isCreateButtonAllow: false,
    isEditButtonAllow: false,
    isDeleteButtonAllow: false,
    isViewButtonAllow: false,
    //isEditSaveButtonAllow: false
  };
  screenPermission2: ScreenVPermission = {
    screenId: 0,
    isCreateAllow: false,
    isUpdateAllow: false,
    isViewAllow: false,

    isCreateButtonAllow: false,
    isEditButtonAllow: false,
    isDeleteButtonAllow: false,
    isViewButtonAllow: false,
    //isEditSaveButtonAllow: false
  };
  screenPermission3: ScreenVPermission = {
    screenId: 0,
    isCreateAllow: false,
    isUpdateAllow: false,
    isViewAllow: false,

    isCreateButtonAllow: false,
    isEditButtonAllow: false,
    isDeleteButtonAllow: false,
    isViewButtonAllow: false,
    //isEditSaveButtonAllow: false
  };
  screenPermission4: ScreenVPermission = {
    screenId: 0,
    isCreateAllow: false,
    isUpdateAllow: false,
    isViewAllow: false,

    isCreateButtonAllow: false,
    isEditButtonAllow: false,
    isDeleteButtonAllow: false,
    isViewButtonAllow: false,
    //isEditSaveButtonAllow: false
  };
  isSaveButtonAllow: boolean = false;
  // MEMO: END For Role Security

  selectComp: SelectBox = { codeID: 0, name: '---Select---', code: '00', tag: 0 };

  isNavigated: boolean = false;
  ShowSiteID: boolean = false;

  screen;

  datezoneFormat;
  timeZoneFormat;
  popupCloseSubscription: any;

  showConfirmationFlag = false;
  confirmationMessage = '';
  isSuperTenant =false;
  isSuperUser = false;
  constructor(
    protected translationPipe: TranslationConfigService,
    protected popupController: PopupControllerService,
    protected notification: NotificationServiceService,
    protected accountService: AccountService,
  ) {
    this.selectItemLimit = Constants.NgSelectItemLimit;
    this.selectItemLimitSM = Constants.NgSelectItemLimitSM;

  }

  ngOnInit() {
  }


  FillMandatoryFieldsNotif() {

    let messageTS: any;
    this.translationPipe.getTranslation(MessagesCodes.MANDATORYREQUIRED.valueOf(), '').subscribe(response => {
      messageTS = response;
      const alertInvalid: AlertModel = { type: AlertType.DANGER, message: messageTS, header: HeaderType.ERROR };
      this.notification.showNotification(alertInvalid);

    });
  }

  close() {
    this.popupController.closePopup();
  }

  ShowSuccessNotification(message) {

    const alert: AlertModel = { type: AlertType.SUCCESS, message: message, header: HeaderType.SUCCESS };
    this.notification.showNotification(alert);

  }

  ShowErrorNotification(message) {

    const alertEr: AlertModel = { type: AlertType.DANGER, message: message, header: HeaderType.ERROR };
    this.notification.showNotification(alertEr);

  }

  ShowUploadNotification(message, progress) {


    const alertEr: AlertModel = { type: AlertType.UPLOAD, message: message, progress: progress, header: HeaderType.INFO };
    this.notification.showNotification(alertEr);
  }



  minDateFunc = function () {
    const date = new Date();
    const year = date.getFullYear() - 18;
    date.setFullYear(year);

    return date;
  };

  ShowLogMessage(message) {
  }

  private AccessScreenEvent(screen: SCREEN_CODE) {

    let accessRightsFiltered: Array<ScreenVPermission> = this.accountService.accessRights.filter
      (p => p.screenId === screen.valueOf());

    // MEMO: For Role Security
    let ScreenVPermissionLcl: ScreenVPermission = {
      screenId: 0,
      isCreateAllow: false,
      isUpdateAllow: false,
      isViewAllow: false,

      isCreateButtonAllow: false,
      isEditButtonAllow: false,
      isDeleteButtonAllow: false,
      isViewButtonAllow: false,
      //isEditSaveButtonAllow : false
    };


    ScreenVPermissionLcl.screenId = 0;


    if (accessRightsFiltered.length > 0) {
      ScreenVPermissionLcl = accessRightsFiltered[0];
    }

    if (ScreenVPermissionLcl.isCreateAllow === true) {
      ScreenVPermissionLcl.isCreateButtonAllow = true;

    }
    if (ScreenVPermissionLcl.isUpdateAllow === true) {
      ScreenVPermissionLcl.isEditButtonAllow = true;
      ScreenVPermissionLcl.isDeleteButtonAllow = true;

    }
    if (ScreenVPermissionLcl.isViewAllow === true) {
      ScreenVPermissionLcl.isViewButtonAllow = true;
      ScreenVPermissionLcl.isEditButtonAllow = true;
    }

    return ScreenVPermissionLcl;
  }




  IsAccessAllowed(screen: SCREEN_CODE) {
    return this.AccessScreenEvent(screen);

  }

  getIsSuperTenant() {
    return this.accountService.user.isSuperTenant;
  }

  getIsSuperUser() {
    return this.accountService.user.isSuperUser;
  }

  SetRoleSecurity(screen: SCREEN_CODE, event: EVENTGROUP_CODE) {
    // MEMO: For Role Security
    this.screenPermission = this.IsAccessAllowed(screen);

    this.isSaveButtonAllow = false;

    if (event === EVENTGROUP_CODE.INSERT && this.screenPermission.isCreateAllow === true) {

      this.isSaveButtonAllow = true;

    }
    if (event === EVENTGROUP_CODE.UPDATE && this.screenPermission.isUpdateAllow === true) {

      this.isSaveButtonAllow = true;
    }


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
  ProcessSaveSuccess(response) {

    this.ShowSuccessNotification(response.message);
    this.close();
  }

  ProcessSaveFail(response) {
    this.ShowErrorNotification(response.message);
  }

  getTimeDiff(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    var days = Math.floor(diff / (60 * 60 * 24 * 1000));
    var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    return seconds;
  }
  startCountdown(seconds) {
    var counter = seconds;
    var interval = setInterval(() => {

      counter--;
      if (counter < 0) {
        clearInterval(interval);
        this.notification.loading = false;
      };
    }, 500);
  };
  getProfileView() {
    return this.accountService.getProfileStatus();
  }

  strsortingAsc(a, b) {

    if (typeof (a) === 'number' && typeof (b) === 'number') {
      return a - b;
    } else {
      let alphabet = ' !"#$%&\'()*+-./:;<=>?@[\\]^_`{|}01234567989ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      a = (a || '').toUpperCase();
      b = (b || '').toUpperCase();
      let index_a = alphabet.indexOf(a[0]),
        index_b = alphabet.indexOf(b[0]);

      if (index_a === index_b) {
        // same first character, sort regular
        if (a.toUpperCase() < b.toUpperCase()) {
          return -1;
        } else if (a.toUpperCase() > b.toUpperCase()) {
          return 1;
        }
        return 0;
      } else {
        return index_a - index_b;
      }
    }

  }

  strsortingDsc(a, b) {

    if (typeof (a) === 'number' && typeof (b) === 'number') {
      return b - a;
    } else {
      let alphabet = ' !"#$%&\'()*+-./:;<=>?@[\\]^_`{|}01234567989ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      a = (a || '').toUpperCase();
      b = (b || '').toUpperCase();

      let index_a = alphabet.indexOf(a[0]),
        index_b = alphabet.indexOf(b[0]);

      if (index_a === index_b) {
        // same first character, sort regular
        if (a.toUpperCase() > b.toUpperCase()) {
          return -1;
        } else if (a.toUpperCase() < b.toUpperCase()) {
          return 1;
        }
        return 0;
      } else {
        return index_b - index_a;
      }
    }

  }

  isNewerVersion(highestVersion, enteredVersion) {
    const oldParts = highestVersion.split('.')
    const newParts = enteredVersion.split('.')
    for (var i = 0; i < newParts.length; i++) {
      const a = ~~newParts[i] // parse int
      const b = ~~oldParts[i] // parse int
      if (a < b) return false
      if (a > b) return true
    }
    return false
  }
  allowInteger(event) {
    return (event.charCode >= 48 && event.charCode <= 57);
  }
  allowDecimal(event) {
    return ((event.charCode >= 48 && event.charCode <= 57) || event.charCode === 46);
  }
  trackById(fieldKey: string, index: number, item: any) {
    return item[fieldKey];
  }
  parseJsonDateTimeObj(date) {
    const dateStr = date.split(/[-T.]/);
    const result = new Date(dateStr.slice(0, 3).join('/') + ' ' + dateStr[3]);
    return result;
  }
}


