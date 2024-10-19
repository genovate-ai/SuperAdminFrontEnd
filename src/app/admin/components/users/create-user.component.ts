import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import {
  UntypedFormBuilder
} from '@angular/forms';
import { UserAccountService } from 'src/app/shared/services/user-account-services/user-account.service';
import { FormValidatorsServiceService } from 'src/app/shared/services/common/form-validators.service';
import { BUTTON_LABELS, STATUS_CODE, EVENTGROUP_CODE, SCREEN_CODE, EVENT_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { OrganizationTypeEnum } from 'src/app/shared/helper/Enums';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { UserVModel } from 'src/app/shared/models/users/UserV.Model';
import { BaseUserFormComponent } from './base-userform.component';
import { AuthService } from 'src/app/shared/services/common/auth.service';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { AccessRightVModel } from 'src/app/shared/models/roles/AccessRightV.Model';
import { UserModel } from 'src/app/shared/models/users/User.Model';
import { ManageOrganizationsService } from 'src/app/shared/services/manage-organizations/manage-organizations.service';
import { LasturlAccessed } from 'src/app/shared/services/common/urlAccessed.service';

@Component({
  selector: 'app-create-user-component',
  templateUrl: './create-user.component.html'
})

export class CreateUserComponent extends BaseUserFormComponent implements OnInit {

  successButton = BUTTON_LABELS.SAVE;
  dangerButton = BUTTON_LABELS.RESET;

  eventGroup = EVENTGROUP_CODE.INSERT;
  screen = SCREEN_CODE.ManageUser;
  event = EVENT_CODE.CreateUser;

  ResetPassword() {


  }

  @ViewChild('cell', { static: true }) cellInputElement: ElementRef;
  @ViewChild('work', { static: true }) workInputElement: ElementRef;

  constructor(
    protected manageOrganizationsService: ManageOrganizationsService,
    protected formBuilder: UntypedFormBuilder,
    protected userAccountService: UserAccountService,
    protected formValidators: FormValidatorsServiceService,
    protected notification: NotificationServiceService,
    public popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected accountService: AccountService,
    protected urlAccessed: LasturlAccessed
  ) {

    super(manageOrganizationsService, formBuilder, translationPipe, popupController, notification, formValidators, userAccountService, accountService);

  }


  ngOnInit() {
    this.disableSiteSelection = true;
    this.translationPipe
      .getTranslation('Confirm.setPassword', '')
      .subscribe(response => {
        this.passwordText = response;
      });
    this.createScreen = true;
    this.isFromCreateComponent = true;

    this.SetRoleSecurity(this.screen, this.eventGroup);
    this.resetForm();

    // this.isSiteAdmin = this.accountService.user.siteAdministrator === 'true';
    this.orgnTypeId = this.accountService.user.userOrgnTypeId;

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.userAccountService
      .loadCreateUserScreenMetaData()
      .subscribe(response => {

        console.log(response);

        if(this.orgnTypeId === OrganizationTypeEnum.Ancera.valueOf()) {
          this.lstOrgType = response.dataObject.lstOrganizationTypeVM;
          this.lstOrganizations = response.dataObject.lstOrganizationVM;


          this.orgnId = 0;
          // this.orgnIdOri = 0;
          this.isAnceraUser = true;
        } else if(this.orgnTypeId !== OrganizationTypeEnum.Ancera.valueOf()) {
          this.orgnId = this.accountService.user.userOrgnId;
          // this.orgnId = this.orgnIdOri;
          let objOrgnType = response.dataObject.lstOrganizationTypeVM.find(x=>x.codeID === this.orgnTypeId);
          let arrOrgnType = [];
          if(objOrgnType) {
            arrOrgnType.push(objOrgnType);
          }
          this.lstOrgType = arrOrgnType.slice();

          let objOrgn = response.dataObject.lstOrganizationVM.find(x=>x.codeID === this.orgnId);
          let arrOrgn = [];
          if(objOrgnType) {
            arrOrgn.push(objOrgn);
          }
          this.lstOrganizations = arrOrgn.slice();

        }
        
        this.lstOrganizationWiseUserRoles = response.dataObject.lstOrganizationWiseUserRoles;
        this.lstOrganizationWiseUserReportRoles = response.dataObject.lstOrganizationWiseUserReportRoles

        // this.lstMyClientsFiltered = this.lstOrganizations.filter(
        //   rec => rec.tag === OrganizationTypeEnum.Clients.valueOf());

        this.lstReportRoles = response.dataObject.lstReportRoleVM;
        this.lstSites = response.dataObject.lstSiteVM;
        this.saveMapOfSites(this.lstSites, false);
        this.lstPipers = response.dataObject.lstPipersVM;
        this.lstEulas = response.dataObject.lstEulaVM;
        this.renderLstEulas = true;
        this.lstPhoneCode = response.dataObject.lstCountryVM;
        this.lstRoles = response.dataObject.lstRoleVM;
        this.lstRoleCategory = response.dataObject.lstRoleCategory;
        this.lstTehsils = response.dataObject.lstTehsils;

        
        
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      });
  }

  // Changing screen from desktop to mobile when menu is locked #Start
  @HostListener('window:resize', ['$event'])
  onResize(event) {

  }
  submit({
    fcFirstName,
    fcLastName,
    fcEmail,
    fcIsActive,
    fcCellNumber,
    fcCellCode,
    fcPhoneCode,
    fcPhoneNumber,
    fcOrganizationType,
    fcOrganization,
    fcRoleId,
    fcClientId,
    fcPrimaryContact,
    fcDesignation,
    fcReportRoleId,
    fcPiperUser,
    fcPipers,
    fcEulaId,
    fcRoleCategoryId,
    fcRoleCategoryName,
    fcSiteAdministrator,
    fcTehsilId

  }) {
    
    this.isNavigated = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // if(this.lstTestingSites.length == 0 && fcPiperUser == 'true'){
    //   this.showSiteRequiredErr = true;
    //   return;
    // }
    // else{
    //   this.showSiteRequiredErr = false;
    // }
    // if (fcCellCode == null || fcCellCode == undefined || fcCellCode == "") {
    //   fcCellCode = 0;
    //   fcCellNumber = "";
    // }
    // if (fcPhoneCode == null || fcPhoneCode == undefined || fcPhoneCode == "") {
    //   fcPhoneCode = 0;
    //   fcPhoneNumber = "";
    // }

    // let domCellElement = this.cellInputElement.nativeElement;
    // let domWorkElement = this.workInputElement.nativeElement;
    // let val;
    // let val1;
    // if (domCellElement && domCellElement.value !== '') {
    //   val = domCellElement.value;
    //   fcCellNumber = val;
    // } else {
    //   val = '';
    //   fcCellNumber = val;
    // }

    // if (domWorkElement && domWorkElement.value !== '') {
    //   val1 = domWorkElement.value;
    //   fcPhoneNumber = val1;
    // } else {
    //   val1 = '';
    //   fcPhoneNumber = val1;
    // }

    let storePiper = false;
    if (fcPiperUser == 'true') {
      storePiper = true;
    }
    const user: UserVModel = {
      userId: 0,
      userFirstName: fcFirstName,
      userLastName: fcLastName,
      userWrkPhoneCodeId: fcPhoneCode,
      userWrkPhoneNo: fcPhoneNumber.substring(0, 11),
      userPhoneCodeId: fcCellCode,
      userPhoneNo: fcCellNumber.substring(0, 11),
      EmailId: fcEmail,

      userOrgnTypeId: fcOrganizationType,
      userOrgnId: fcOrganization,
      orgnName: null,

      userOrgnSiteId: 0,
      userPrimaryContact: fcPrimaryContact,
      isActive: fcIsActive,

      lstRoleIDS: fcRoleId,
      lstReportRoleIDS: fcReportRoleId && fcReportRoleId.length != 0 ? [fcReportRoleId] : [],  // Due to report-role fields access this implementation change from list to single object at front-end but it doesn't change on backend. IE-437
      lstEulaIDS: fcEulaId,
      lstOrganizationIDS: fcClientId,
      userDesignation: fcDesignation,
      isForDISAPI: false,
      lstSiteIDS: this.values,
      lstPiperIDS: fcPipers,

      isPiperUser: storePiper,
      orgSites: this.OrgAndSiteIds,
      lstTestSitesIDS: this.lstTestingSites,
      lstClientIDS: this.lstClientSites,
      roleCategoryId: fcRoleCategoryId,
      roleCategoryName: fcRoleCategoryName,
      siteAdministrator: fcSiteAdministrator,
      lstTehsilIDS: fcTehsilId
      
    };

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.userAccountService.createUser(user).subscribe(response => {

      if (response.statusCode === STATUS_CODE.SUCCESS) {

        this.ProcessSaveSuccess(response);

      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

        this.ProcessSaveFail(response);

      }
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);

    });


  }


  hideTree() {
    this.showConfirmationFlag = false;
    this.showTreeDiv = false;
    this.OrgAndSiteIds = [];
    for (let i = 0; i < this.savedOrgnAndSites.length; i++) {
      this.OrgAndSiteIds.push(this.savedOrgnAndSites[i]);
    }
  }
  saveClientSites(save, prev, getData) {
    this.savedOrgnAndSites = [];
    for (let i = 0; i < this.OrgAndSiteIds.length; i++) {
      this.savedOrgnAndSites.push(this.OrgAndSiteIds[i]);
    }
    this.showConfirmationFlag = false;
    this.showTreeDiv = false;
  }
  closeTree(param) {
    this.selectedSites = [];
    this.showConfirmationFlag = false;
    this.showConfirmationFlag2 = false;
    this.showTreeDiv = false;
  }

  selectRoles(event){

  }
  saveClientSitesandCloseTree() {
  }
  GetAllSitesForClients(saveVal) {
  }
  // LoadLocationTreeandFillData(param){
  //   if(param){
  //     this.closeForcefully = false;
  //     if(this.selectedClients2 && this.selectedClients2.length != 0){
  //       let foundVal = false;
  //       for(let i = 0; i < this.OrgAndSiteIds.length; i++){
  //         if(this.OrgAndSiteIds[i].orgnId == this.selectedClients2){
  //           this.LoadLocationTree(this.selectedClients2, false, this.OrgAndSiteIds[i].siteId, true);
  //           foundVal = true;
  //         }
  //       }
  //       if(!foundVal){
  //         this.LoadLocationTree(this.selectedClients2, false, [], true);
  //       }
  //     }
  // }
  // else{
  //   this.itemsLst2 = [];
  //   this.closeForcefully = true;
  //   this.ValueChangedIndicator = false;
  // }
  // }

  ResetUserPin() { }



}
