let domList;
domList = document.querySelectorAll("body, .app-header, .screen-title");
for (let i = 0; i < domList.length; ++i) {
  domList[i].classList.add('background-white');
}
domList = document.querySelectorAll("body, .app-header, .heading-text, .screen-name");
for (let i = 0; i < domList.length; ++i) {
  domList[i].classList.add('background-white');
  domList[i].classList.add('data-log');
} import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/common/auth.service';
import { Router } from '@angular/router';
import { STATUS_CODE, MessagesCodes, SCREEN_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { AlertModel, AlertType, HeaderType } from 'src/app/shared/models/Alert.Model';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { ResponseVModel } from 'src/app/shared/models/ResponseV.Model';
import { AuthVModel } from 'src/app/shared/models/AuthV.Model';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { UserVModel } from 'src/app/shared/models/users/UserV.Model';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { AccessRightVModel } from 'src/app/shared/models/roles/AccessRightV.Model';
import { LayoutComponent } from 'src/app/layout/components/layout/layout.component';
import { BehaviorSubject } from 'rxjs/Rx';
import { LasturlAccessed } from 'src/app/shared/services/common/urlAccessed.service';
import { ViewUserLicenseComponent } from 'src/app/admin/components/user-license/view-user-license.component';
import { ManageUserLicenseService } from 'src/app/shared/services/manage-user-license-services/manage-user-license.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends BaseFormComponent implements OnInit {
  isLoggedIn = false;
  selectedLanguage: any;
  lstLng = []
  lngForm: UntypedFormGroup;
  value;
  isNavigated = false;
  showPassword = false;

  // @ViewChild(LayoutComponent, {static: false}) child: LayoutComponent;
  constructor(private authService: AuthService,
    private router: Router,
    protected manageUserLicenseService: ManageUserLicenseService,
    protected notificationService: NotificationServiceService,
    private account: AccountService,
    protected urlAccessed: LasturlAccessed,
    // protected translationPipe: TranslationConfigService,
    protected popupController: PopupControllerService, private fb: UntypedFormBuilder
  ) {

    super(null, popupController, notificationService, account);
    let domList;
    domList = document.querySelectorAll("body, .app-header, .screen-title");
    for (let i = 0; i < domList.length; ++i) {
      domList[i].classList.remove('background-white');
    }
    domList = document.querySelectorAll("body, .app-header, .heading-text, .screen-name");
    for (let i = 0; i < domList.length; ++i) {
      domList[i].classList.remove('background-white');
      domList[i].classList.remove('data-log');
    }
  }
  guid: string;
  showConfirmationFlag: boolean;
  screen = SCREEN_CODE.ManageUser;
  confirmationMessage = '';
  ngOnInit() {
    this.resetForm();
    this.lstLng = [
      { code: 'en-US', name: 'English(US)' },
      { code: 'en-GB', name: 'English(UK)' },
      { code: 'ar-KSA', name: 'Arabic' },
      { code: 'fr', name: 'French' },
      { code: 'ko', name: 'Korean' },


    ]
    this.selectedLanguage = 'en-US';


    this.account.isLoggedIn.asObservable().subscribe(boolean => {
      this.isLoggedIn = boolean;
      if (this.isLoggedIn) {
        this.router.navigate(['/home']);
      }
    });
  }
  signIn(form, formFields) {
    
    if (form.invalid) {
      this.isNavigated = true;
      return;
    }
    const auth: AuthVModel = {

      EmailId: formFields.email,
      Password: formFields.password,
      token: '',
      systemIp: ''

    };


    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

    this.authService.login(auth).subscribe(response => {
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR && response.displayPopup === 1) {

        this.showConfirmationFlag = true;
      } else if (response.statusCode === STATUS_CODE.SUCCESS) {
        this.authService.toggleAuthState(true);
        this.onSuccessfulLogin(response);
      } else {
        this.ShowErrorNotification(response.message);
      }
    });

  }



  relogin() {
  }

  onSuccessfulLogin(response: ResponseVModel) {
    debugger;
    //  let timezoneIndex = response.dataObject.timeZoneCountry.indexOf("_")
    let timeZoneId = response.dataObject.timeZoneCountryId
    let timeZone = response.dataObject.timeZoneCountry
    

    // let dateFormatIndex = response.dataObject.userDateFormat.indexOf("_")
    let dateFormatId = response.dataObject.userDateFormatId
    let dateformat = response.dataObject.userDateFormat
    var re = /m/gi;
    // dateformat =dateformat.replace(re, "M");
    this.account.user = {} as UserVModel;
    
    this.account.user.userFirstName = response.dataObject.userName;
    this.account.user.userId = response.dataObject.userId;
    this.account.user.userOrgnTypeId = response.dataObject.userOrgnTypeId;
    this.account.user.userOrgnId = response.dataObject.userOrgnId;
    this.account.user.userLanguage = response.dataObject.userLanguage;
    this.account.user.userTimeZone = response.dataObject.userTimeZone;
    this.account.user.helpCenterURL = response.dataObject.helpCenterURL;
    this.account.mapboxAccessKey = response.dataObject.mapboxAccesskey;
    this.account.user.userDateFormat = dateformat;
    this.account.user.dateFormatId = dateFormatId;
    this.account.user.regionName = response.dataObject.regionName;
    this.account.user.timeZoneCountry = timeZone;
    this.account.user.timeZoneId = timeZoneId;
    this.account.user.versions = response.dataObject.versions;
    this.account.user.isSuperTenant = response.dataObject.isSuperTenant;
    this.account.user.isSuperUser = response.dataObject.isSuperUser;

    this.account.accessToken = response.dataObject.token;
    this.account.accessRights = response.dataObject.accessRights;   
    this.createSessionAndNavigate();
  }

  forgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  async showEulaIfAny(obj: any) {

    this.createSessionAndNavigate();
  }
  createSessionAndNavigate() {
    this.authService.createSession();
    this.router.navigate(['/home/project/project-Management']);
  }

  public defultLanguage(value){

    this.value= this.account.user.userLanguage;
    // this.translationPipe.setDefaultLang(this.value);
  }
  public defultTimeZone() {
    this.value = this.account.user.userTimeZone;
    return this.value;
  }
  resetForm() {
    this.lngForm = this.fb.group({
      languageItems: []
    });
  }

}
