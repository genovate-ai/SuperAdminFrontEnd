import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserAccountService } from 'src/app/shared/services/user-account-services/user-account.service';
import { Router } from '@angular/router';
import { SCREEN_CODE, API_CALLEVENTGROUP_CODE, STATUS_CODE } from 'src/app/shared/helper/Enums';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserVModel } from 'src/app/shared/models/users/UserV.Model';
import { LasturlAccessed } from 'src/app/shared/services/common/urlAccessed.service';
import { FormValidatorsServiceService } from 'src/app/shared/services/common/form-validators.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/common/auth.service';
import { UserProfileService } from 'src/app/shared/services/common/user-profile.service';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/shared/helper/Constants';
import { ScreenNameService } from 'src/app/shared/services/common/screen-name.service';



@Component({
  selector: 'app-manage-profile-component',
  templateUrl: './manage-profile.component.html'
})
export class ManageProfileComponent extends BaseFormComponent implements OnInit {
  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageSite;
  form: any;
  viewPipers = true;
  selectedValuePhoneCode: any;
  selectedValueCellCode: any;
  lstPhoneCode: [];
  isDsbld: any;
  //////////////// Masks /////////////////////
  workCountryCode = 1;
  cellCountryCode = 1;
  userID: number;
  userVModel: any;
  @ViewChild('cell', { static: true }) cellInputElement: ElementRef;
  @ViewChild('work', { static: true }) workInputElement: ElementRef;
  lastAccessedURL: any;
  closeSubscription: any;
  lstLng = [];
  lstTimeZone = [];
  lstDateFormat = [];

  lngForm: UntypedFormGroup;
  value;
  selectedLanguage: any;
  selectedTimeZone: any;
  selectedDateFormat: any;
  showConfirmationFlag: boolean = false;
  confirmationMessage = '';
  isRoleMGMTMenuApplied = false;
  isfixed = false;
  isShowFullMenu = false;
  isHomeGroupActive = true;
  isAdminGroupActive = false;
  isMetaDataGroupActive = false;
  isOpsGroupActive = false;
  isContactGroupActive = false;
  isHelpGroupActive = false;
  isClientGroupActive = false;
  isAnalysisReportGroupActive = false;
  isAnalysisReportsCollapsed = true;
  activeProfileSettings = false;
  isUserCollapsed = true;
  isMetaDataCollapsed = true;
  moduleName = Constants.moduleName;
  screenName = Constants.screenName;

  isReportDisplayed = false;
  regionName = '';
  timeZoneCountry = '';
  translate: any;

  stepOne = true;
  stepTwo = false;
  stepThree = false;

  constructor(
    protected userAccountService: UserAccountService,
    protected router: Router,
    protected popupController: PopupControllerService,
    protected notificationService: NotificationServiceService,
    protected translationPipe: TranslationConfigService,
    protected accountService: AccountService,
    protected formBuilder: UntypedFormBuilder,
    protected urlAccessed: LasturlAccessed,
    protected formValidators: FormValidatorsServiceService,
    private authService: AuthService,
    private screenNameService: ScreenNameService,
    private userProfileService: UserProfileService

  ) {

    super(translationPipe, popupController, notificationService, accountService);
    let domList;
    domList = document.querySelectorAll("body, .app-header, .screen-title");
    for (let i = 0; i < domList.length; ++i) {
      domList[i].classList.add('background-white');
    }
    domList = document.querySelectorAll("body, .app-header, .heading-text, .screen-name");
    for (let i = 0; i < domList.length; ++i) {
      domList[i].classList.add('background-white');
      domList[i].classList.add('data-log');
    }
  }
  ngOnInit() {
    this.resetForm();
    

    this.userID = this.accountService.user.userId;
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

    this.userAccountService.LoadRefDataManageProfile().subscribe(response => {
      this.lstPhoneCode = response.dataObject.lstPhoneCode || [];
      this.lstLng = response.dataObject.lstLanguage || [];
      this.lstTimeZone = response.dataObject.lstTimeZone || [];
      this.lstDateFormat = response.dataObject.lstDateFormat || [];

      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    });
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.userAccountService.GetManageProfileUserData(this.userID).subscribe(response => {
      this.userVModel = response.dataObject;

      this.FillFCFromModel();
      // this.isCellCodeSelected();
      // this.isWorkCodeSelected();
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    });
    this.closeSubscription = this.urlAccessed.previousURL.subscribe(screen => this.lastAccessedURL = screen)
  }

  resetForm() {
    let mail = this.userVModel ? this.userVModel.userEmail : '';

    this.form = this.formBuilder.group({
      fcFirstName: ['', [Validators.required, Validators.maxLength(200)]],
      fcLastName: ['', [Validators.required, Validators.maxLength(200)]],
      fcCellNumber: ['', [Validators.maxLength(15)]],
      fcCellCode: [0],
      fcPhoneCode: [0],
      fcPhoneNumber: ['', [Validators.maxLength(15)]],
      fcEmail: [mail, [Validators.maxLength(300), this.formValidators.emailValidator]],
      fcLanguage: [''],
      fcTimeZone: [''],
      fcDateFormat: [''],

    });
    this.form.controls['fcEmail'].disable();
    //this.isCellCodeSelected();
    //this.isWorkCodeSelected();
    this.selectedValuePhoneCode = [];
    this.selectedValueCellCode = [];
  }
  // public onLanguageChange(value) {
  //   this.value= this.form.get('fcLanguage').value;
  //   this.translationPipe.changeLanguage(this.value);
  // }

  ResetUserPin() {
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.userAccountService.ResetPin(this.userID).subscribe(response => {

      if (response.statusCode === STATUS_CODE.SUCCESS) {

        this.ShowSuccessNotification(response.message);

      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

        this.ShowErrorNotification(response.message);
      }

      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);

    });

  }
  changeRegionName(item) {

    this.regionName = item.name;
  }
  changeTimeZone(item) {

    this.timeZoneCountry = item.name;
  }
  submit({
    fcFirstName,
    fcLastName,
    fcCellNumber,
    fcCellCode,
    fcPhoneCode,
    fcPhoneNumber,
    fcLanguage,
    fcTimeZone,
    fcDateFormat
  }) {

    // if (fcCellCode == null || fcCellCode == undefined || fcCellCode == "" || fcCellCode.lenght == 0) {
    //   fcCellCode = 0;
    //   fcCellNumber = "";
    // }
    // if (fcPhoneCode == null || fcPhoneCode == undefined || fcPhoneCode == "" || fcPhoneCode.lenght == 0) {
    //   fcPhoneCode = 0;
    //   fcPhoneNumber = "";
    // }
    this.isNavigated = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return;
    }

    var user: UserVModel = {
      userId: this.userID,
      userFirstName: fcFirstName,
      userLastName: fcLastName,
      userWrkPhoneCodeId: 0,
      userWrkPhoneNo: fcPhoneNumber,
      userPhoneCodeId: 0,
      userPhoneNo: fcCellNumber,
      EmailId: '',
      userLanguage: fcLanguage,
      userTimeZone: fcTimeZone,
      userDateFormat: fcDateFormat,

      userOrgnTypeId: 0,
      userOrgnId: 0,
      orgnName: '',

      userOrgnSiteId: 0,
      userPrimaryContact: true,
      isActive: true,

      lstRoleIDS: [],
      lstEulaIDS: [],
      lstReportRoleIDS: [],
      lstOrganizationIDS: [],
      userDesignation: '',
      isForDISAPI: true,
      lstSiteIDS: [],
      lstPiperIDS: [],
      isPiperUser: true,
      orgSites: [],
      regionName: this.regionName,
      timeZoneCountry: this.timeZoneCountry,

    };

    // Memo: To select the placeholder below should be done.
    let selectedDateFormat = this.form.get('fcDateFormat').value;
    let selectedTimeZone = this.form.get('fcTimeZone').value;
    let selectedLanguage = this.form.get('fcLanguage').value;

    if (this.timeZoneCountry == '') {
      this.timeZoneCountry = this.accountService.user.timeZoneCountry;
    }
    if (this.regionName == '') {
      this.regionName = this.accountService.user.regionName;
      user.regionName = this.regionName;
    }
    if (selectedDateFormat == this.accountService.user.userDateFormat
      && selectedTimeZone == this.accountService.user.userTimeZone
      && selectedLanguage == this.accountService.user.userLanguage
      && this.regionName == this.accountService.user.regionName
      && this.timeZoneCountry == this.accountService.user.timeZoneCountry

    ) {
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      this.userAccountService.SaveUserProfileData(user).subscribe(response => {


        if (response.statusCode === STATUS_CODE.SUCCESS) {

          this.ProcessSaveSuccess(response);
          //this.accountService.unsetProfileStatus();
          this.authService.updateUserFormatsInSession(user);
          this.translationPipe.setDefaultLang(user.userLanguage);
          this.accountService.updateUserProfileFormats(user);
          // this.userProfileService.changeUserParam(user);



        } else {

          this.ProcessSaveFail(response);
        }
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      });
    }
    else {

      
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      this.userAccountService.SaveUserProfileData(user).subscribe(response => {


        if (response.statusCode === STATUS_CODE.SUCCESS) {

          this.confirmationMessage = this.translationPipe.getTraslatedValue('Confirm', 'logOut');
          this.showConfirmationFlag = true;
          // this.delete();

          //  this.userProfileService.changeUserParam(user);



        } else {

          this.ProcessSaveFail(response);
        }
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      });
    }


  }
  delete() {

    this.translationPipe
      .getTranslation('Confirm.logOut', '')
      .subscribe((response) => {
        this.confirmationMessage = response;
      });
    this.showConfirmationFlag = true;
  }
  positiveDelete() {

    // this.ProcessSaveSuccess(response);
    // this.accountService.unsetProfileStatus();
    // this.authService.updateUserFormatsInSession(user);
    // this.translationPipe.setDefaultLang(user.userLanguage);
    // this.accountService.updateUserProfileFormats(user);


    this.isRoleMGMTMenuApplied = false;
    this.isfixed = false;
    this.isShowFullMenu = false;
    this.authService.logout();
    this.translate.setDefaultLang(environment.default_lang);
    this.setHomeGroupActive();
    this.urlAccessed.makeHomeFalse();
  }
  negativeAction() {
    this.showConfirmationFlag = false;
    // this.accountService.unsetProfileStatus();
  }
  setHomeGroupActive() {
    this.urlAccessed.changeurl('/home');
    this.isContactGroupActive = false;
    this.isHomeGroupActive = true;
    this.isAdminGroupActive = false;
    this.isMetaDataGroupActive = false;
    this.isOpsGroupActive = false;
    this.isHelpGroupActive = false;
    this.isClientGroupActive = false;
    this.isAnalysisReportGroupActive = false;

    this.translate.getTranslation('menu.AnceraIE', '').subscribe(response => {
      this.moduleName = response;
    });
    this.screenName = this.screenNameService.name.value;
  }
  ResetPassword() {
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.userAccountService.ResetPassword(this.userID).subscribe(response => {

      if (response.statusCode === STATUS_CODE.SUCCESS) {

        this.ShowSuccessNotification(response.message);

      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

        this.ShowErrorNotification(response.message);
      }

      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);

    });
  }
  cancelButton() {

    this.router.navigate([this.lastAccessedURL]);
  }

  // onWorkCountryCode() {
  //   this.workCountryCode = this.form.get('fcCellCode').value ? this.form.get('fcCellCode').value : 1;
  // }

  // isCellCodeSelected() {

  //   let isDsbld = this.form.get('fcCellCode').value ? false : true
  //   if (isDsbld) {
  //     this.form.controls.fcCellNumber.setValidators([Validators.maxLength(15)])
  //     this.form.get('fcCellNumber').setValue('');
  //     this.form.get('fcCellNumber').disable();
  //   }
  //   else {
  //     this.form.controls.fcCellNumber.setValidators([Validators.required, Validators.maxLength(15)]);
  //     this.form.get('fcCellNumber').setValue('');
  //     this.form.get('fcCellNumber').enable();
  //     this.form.get('fcCellNumber').markAsPristine();
  //     this.form.get('fcCellNumber').markAsUntouched();
  //   }
  //   this.cellCountryCode = this.form.get('fcCellCode').value ? this.form.get('fcCellCode').value : 1;
  // }
  // isWorkCodeSelected() {

  //   let isDsbld = this.form.get('fcPhoneCode').value ? false : true
  //   if (isDsbld) {
  //     this.form.controls.fcPhoneNumber.setValidators([Validators.maxLength(15)])
  //     this.form.get('fcPhoneNumber').setValue('');
  //     this.form.get('fcPhoneNumber').disable();
  //   }
  //   else {
  //     this.form.controls.fcPhoneNumber.setValidators([Validators.required, Validators.maxLength(15)]);
  //     this.form.get('fcPhoneNumber').setValue('');
  //     this.form.get('fcPhoneNumber').enable();
  //     this.form.get('fcPhoneNumber').markAsPristine();
  //     this.form.get('fcPhoneNumber').markAsUntouched();
  //   }
  //   this.workCountryCode = this.form.get('fcPhoneCode').value ? this.form.get('fcPhoneCode').value : 1;
  // }

  FillFCFromModel() {

    this.viewPipers = this.userVModel.isPiperUser;
 
    this.form.get('fcFirstName').patchValue(this.userVModel.userFirstName)
    this.form.get('fcLastName').patchValue(this.userVModel.userLastName)
    //this.form.get('fcPhoneCode').patchValue(this.userVModel.userWrkPhoneCodeId == 0 ? null : this.userVModel.userWrkPhoneCodeId)
    this.form.get('fcCellNumber').enable();
      this.form.get('fcCellNumber').setValue(this.userVModel.userPhoneNo)

      this.form.get('fcPhoneNumber').enable();
      this.form.get('fcPhoneNumber').setValue(this.userVModel.userWrkPhoneNo)
    // if(this.userVModel.userWrkPhoneCodeId != 0)
    // {
    //   this.form.get('fcPhoneNumber').enable();
    //   this.form.get('fcPhoneNumber').setValue(this.userVModel.userWrkPhoneNo)
    // }
    // //this.workCountryCode = this.form.get('fcPhoneCode').value ? this.form.get('fcPhoneCode').value : 1;

    // this.form.get('fcCellCode').patchValue(this.userVModel.userPhoneCodeId == 0 ? null : this.userVModel.userPhoneCodeId)
    // if(this.userVModel.userPhoneCodeId != 0)
    // {
      
    // }
    //this.cellCountryCode = this.form.get('fcCellCode').value ? this.form.get('fcCellCode').value : 1;

    this.form.get('fcEmail').patchValue(this.userVModel.userEmail)
    this.form.get('fcLanguage').patchValue(this.userVModel.userLanguage)
    this.form.get('fcTimeZone').patchValue(parseInt(this.userVModel.userTimeZone))
      this.form.get('fcDateFormat').setValue(parseInt(this.userVModel.userDateFormat))
      
  }

  ProcessSaveSuccess(response) {

    this.ShowSuccessNotification(response.message);
    this.popupController.updateResult(response.dataObject);
    this.close();
  }

  ProcessSaveFail(response) {

    this.ShowErrorNotification(response.message);

  }
  ngOnDestroy() {
    this.closeSubscription.unsubscribe();
  }
  showLogOutOption() {

    let c = this.showConfirmationFlag;
    return c;
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 ||
      item.countryName.toLocaleLowerCase().indexOf(term) > -1;
  }
  tabClick(newValue, isNextNavigation: boolean) {
 
    if (newValue === 'one') {
      this.stepOne = true;
      this.stepTwo = false;
      this.stepThree = false;
    }
    if (newValue === 'two') {
      this.stepOne = false;
      this.stepTwo = true;
      this.stepThree = false;
    }
    if (newValue === 'three') {
      this.stepOne = false;
      this.stepTwo = false;
      this.stepThree = true;
    }
    this.value = newValue;

  }
}
