import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { UserAccountService } from 'src/app/shared/services/user-account-services/user-account.service';
import { FormValidatorsServiceService } from 'src/app/shared/services/common/form-validators.service';
import { ActivatedRoute } from '@angular/router';
import { STATUS_CODE, BUTTON_LABELS, OrganizationTypeEnum, SCREEN_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { UserVModel } from 'src/app/shared/models/users/UserV.Model';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { BaseUserFormComponent } from './base-userform.component';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { AlertModel, AlertType, HeaderType } from 'src/app/shared/models/Alert.Model';
import { ManageOrganizationsService } from 'src/app/shared/services/manage-organizations/manage-organizations.service';
import { SelectBox } from 'src/app/shared/models/SelectBox.Model';

// This component just has a controller file. it uses template and stylesheet fron create-user-component.

@Component({
  selector: 'app-update-user-component',
  templateUrl: './create-user.component.html'
})

export class UpdateUserComponent extends BaseUserFormComponent implements OnInit {


  eventGroup: EVENTGROUP_CODE = EVENTGROUP_CODE.UPDATE;

  successButton = BUTTON_LABELS.SAVE;
  dangerButton = BUTTON_LABELS.RESET;
  isFromUpdateComponent = true;
  renderLstEulas = false;
  userId: string;
  valTrack = [];
  lstRolesFiltered: Array<SelectBox> = [];
  lstOrganizationWiseUserRoles: Array<any> = [];

  dict = []; // create an empty array


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
    protected route: ActivatedRoute,
    protected accountService: AccountService

  ) {

    super(manageOrganizationsService, formBuilder, translationPipe, popupController, notification, formValidators, userAccountService, accountService);

  }



  ngOnInit() {
    this.translationPipe
      .getTranslation('buttons.password', '')
      .subscribe(response => {
        this.passwordText = response;
      });
    this.createScreen = false;
    this.SetRoleSecurity(this.screen, this.eventGroup);

    if (this.route.snapshot.paramMap.get('id')) { // if this components is called via routing
      this.userId = this.route.snapshot.paramMap.get('id');
    } else { // if this components is called via popup
      this.userId = this.popupController.getParams() as string;
    }

    this.resetForm();

    // this.isSiteAdmin = this.accountService.user.siteAdministrator === 'true';
    this.orgnTypeId = this.accountService.user.userOrgnTypeId;

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.userAccountService
      .loadCreateUserScreenMetaData()
      .subscribe(response => {
        
        if (this.orgnTypeId === OrganizationTypeEnum.Ancera.valueOf()) {
          this.lstOrgType = response.dataObject.lstOrganizationTypeVM;
          this.lstOrganizations = response.dataObject.lstOrganizationVM;
          this.orgnId = 0;
        } else if (this.orgnTypeId !== OrganizationTypeEnum.Ancera.valueOf()) {
          this.roleClearable = false;
          this.orgnId = this.accountService.user.userOrgnId;
          let objOrgnType = response.dataObject.lstOrganizationTypeVM.find(x => x.codeID === this.orgnTypeId);
          let arrOrgnType = [];
          if (objOrgnType) {
            arrOrgnType.push(objOrgnType);
          }
          this.lstOrgType = arrOrgnType.slice();

          let objOrgn = response.dataObject.lstOrganizationVM.find(x => x.codeID === this.orgnId);
          let arrOrgn = [];
          if (objOrgnType) {
            arrOrgn.push(objOrgn);
          }
          this.lstOrganizations = arrOrgn.slice();

        }


        // this.lstMyClientsFiltered = this.lstOrganizations.filter(
        //   rec => rec.tag === OrganizationTypeEnum.Clients.valueOf());

        this.lstOrganizationWiseUserRoles = response.dataObject.lstOrganizationWiseUserRoles;
        this.lstOrganizationWiseUserReportRoles = response.dataObject.lstOrganizationWiseUserReportRoles;
        this.lstSites = response.dataObject.lstSiteVM;
        this.lstRoles = response.dataObject.lstRoleVM;
        this.lstReportRoles = response.dataObject.lstReportRoleVM;
        this.lstPhoneCode = response.dataObject.lstCountryVM;
        this.lstPipers = response.dataObject.lstPipersVM;
        this.lstEulas = response.dataObject.lstEulaVM;
        this.lstRoleCategory = response.dataObject.lstRoleCategory;
        this.lstTehsils = response.dataObject.lstTehsils;

        this.userAccountService.LoadUserData(this.userId).subscribe(data => {
          
          this.userVModel = data.dataObject;
          if (this.orgnTypeId !== OrganizationTypeEnum.Ancera.valueOf()) {
            this.lstRoles = [];
            this.lstRoles = data.dataObject.lstRoleVM;
            this.lstReportRoles = [];
            this.lstReportRoles = data.dataObject.lstReportRoleVM;

            this.lstRoles.forEach(element => {
              let obj = this.userVModel.lstRoleIDS.includes(element.codeID);
              if (obj) {
                element.allowRemove = true;
              }
            });

          }


          this.OrgAndSiteIds = this.userVModel.orgSites;
          this.lstUserSitesAssn = this.userVModel.lstUserSitesAssn;
          let sites = [];
          for (let i = 0; i < this.lstUserSitesAssn.length; i++) {
            sites.push(this.lstUserSitesAssn[i].siteId);
          }
          this.lstTestingSites = sites;
          this.taggedData = this.lstUserSitesAssn;
          this.savedOrgnAndSites = [];
          if (this.OrgAndSiteIds) {
            for (let i = 0; i < this.OrgAndSiteIds.length; i++) {
              this.savedOrgnAndSites.push({
                userId: this.OrgAndSiteIds[i].userId,
                orgnId: this.OrgAndSiteIds[i].orgnId,
                siteId: this.OrgAndSiteIds[i].siteId
              });
            }
          }
          if (this.OrgAndSiteIds) {
            for (let i = 0; i < this.OrgAndSiteIds.length; i++) {
              this.lstClientSites = this.OrgAndSiteIds[i].siteId.concat(this.lstClientSites);
            }
          }
          

          if (this.lstRoles) {
            this.lstRolesFiltered = new Array<SelectBox>;

            let commaSeparatedRolesGivenToOrganization: Array<any>;

            let ids = this.lstOrganizationWiseUserRoles.filter(x => x.organizationId === this.userVModel.userOrgnId).map(item => {
              return item.commaSeparatedUserRoleIds;
            })[0];
            if (ids != null) {
              commaSeparatedRolesGivenToOrganization = ids.split(",")
              for (let i = 0; i < commaSeparatedRolesGivenToOrganization.length; i++) {
                this.lstRoles.map((data) => {
                  if (data.code === commaSeparatedRolesGivenToOrganization[i]) {
                    this.lstRolesFiltered.push(data);
                  }
                })
              }
            } else {
              this.lstRolesFiltered = this.lstRoles
            }

          }

          if (this.lstReportRoles) {
            this.lstReportRolesFiltered = new Array<SelectBox>;

            let commaSeparatedReportRolesGivenToOrganization: Array<any>;

            let ids = this.lstOrganizationWiseUserReportRoles.filter(x => x.organizationId === this.userVModel.userOrgnId).map(item => {
              return item.commaSeparatedUserRoleIds;
            })[0];
            if (ids != null) {
              commaSeparatedReportRolesGivenToOrganization = ids.split(",")
              for (let i = 0; i < commaSeparatedReportRolesGivenToOrganization.length; i++) {
                this.lstReportRoles.map((data) => {
                  if (data.code == commaSeparatedReportRolesGivenToOrganization[i]) {
                    this.lstReportRolesFiltered.push(data);
                  }
                })
              }
            } else {
              this.lstReportRolesFiltered = this.lstReportRoles.slice()
            }

          }


          this.lstAllUserSitesIDs = data.dataObject.lstUserSiteIDs;
          this.lstAllTestingSitesIDs = data.dataObject.lstTestingSiteIDs;
          this.lstAllCollectionSitesIDs = data.dataObject.lstCollectionSitesIDs;
          this.lstAllExtraSitesIDs = data.dataObject.lstExtraSitesIDs;
          this.lstAllSites = this.lstTestingSites.concat(this.userVModel.lstSiteIDS, this.lstClientSites);
          this.saveMapOfSites(this.lstSites, true)
          this.disableSiteSelection = false;
          this.values = this.userVModel.lstSiteIDS;
          this.FillFCFromModel();
          // this.isCellCodeSelected();
          // this.isWorkCodeSelected();
          this.isDsbld = !this.userVModel.userPhoneCodeId,
            this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
        });

      });

  }
  FillFCFromModel() {

    // MEMO : Below Validation Required otherwise after edit validation will not work.
    // this.form = this.formBuilder.group({

    //   fcFirstName: [this.userVModel.userFirstName, [Validators.required, Validators.maxLength(200)]],
    //   fcLastName: [this.userVModel.userLastName, [Validators.required, Validators.maxLength(200)]],
    //   fcEmail: [this.userVModel.userEmail, [
    //     Validators.required,
    //     Validators.maxLength(300),
    //     this.formValidators.emailValidator
    //   ]],

    //   fcPhoneCode: [this.userVModel.userWrkPhoneCodeId == 0 ? null : this.userVModel.userWrkPhoneCodeId],
    //   fcPhoneNumber: [this.userVModel.userWrkPhoneNo, [Validators.maxLength(20)]],

    //   fcOrganizationType: [this.userVModel.userOrgnTypeId, [Validators.required]],

    //   fcOrganization: [this.userVModel.userOrgnId, [Validators.required]],
    //   fcPrimaryContact: this.userVModel.userPrimaryContact.toString(),

    //   fcCellCode: [this.userVModel.userPhoneCodeId == 0 ? null : this.userVModel.userPhoneCodeId],
    //   fcCellNumber: [this.userVModel.userPhoneNo, [Validators.maxLength(20)]],
    //   fcIsActive: this.userVModel.isActive.toString(),
    //   fcRoleId: [this.userVModel.lstRoleIDS, [Validators.required]],
    //   fcClientId: [this.userVModel.lstOrganizationIDS],
    //   fcClientId2: [''],
    //   fcDesignation: [this.userVModel.userDesignation],
    //   fcReportRoleId: [this.userVModel.lstReportRoleIDS[0]],  // Due to report-role fields access this implementation change from list to single object at front-end but it doesn't change on backend. IE-437
    //   fcPiperUser: [this.userVModel.isPiperUser].toString(),
    //   fcPipers: [this.userVModel.lstPiperIDS],
    //   fcEulaId: [this.userVModel.lstEulaIDS]
    // });
    
    this.form.controls.fcFirstName.patchValue(this.userVModel.userFirstName);
    this.form.controls.fcLastName.patchValue(this.userVModel.userLastName);
    this.form.controls.fcEmail.patchValue(this.userVModel.EmailId);
    this.form.controls.fcPhoneCode.patchValue(this.userVModel.userWrkPhoneCodeId == 0 ? null : this.userVModel.userWrkPhoneCodeId);
    this.form.controls.fcPhoneNumber.patchValue(this.userVModel.userWrkPhoneNo);
    this.form.controls.fcOrganizationType.patchValue(this.userVModel.userOrgnTypeId);
    this.form.controls.fcOrganization.patchValue(this.userVModel.userOrgnId);
    this.form.controls.fcPrimaryContact.patchValue(this.userVModel.userPrimaryContact.toString());
    this.form.controls.fcCellCode.patchValue(this.userVModel.userPhoneCodeId == 0 ? null : this.userVModel.userPhoneCodeId);
    this.form.controls.fcCellNumber.patchValue(this.userVModel.userPhoneNo);
    this.form.controls.fcIsActive.patchValue(this.userVModel.isActive.toString());
    this.form.controls.fcRoleId.patchValue(this.userVModel.lstRoleIDS);
    this.form.controls.fcClientId.patchValue(this.userVModel.lstOrganizationIDS);
    this.form.controls.fcDesignation.patchValue(this.userVModel.userDesignation);
    this.form.controls.fcReportRoleId.patchValue(this.userVModel.lstReportRoleIDS[0]);
    this.form.controls.fcPiperUser.patchValue(this.userVModel.isPiperUser.toString());
    this.form.controls.fcPipers.patchValue(this.userVModel.lstPiperIDS);
    this.form.controls.fcEulaId.patchValue(this.userVModel.lstEulaIDS);
    this.form.controls.fcRoleCategoryId.patchValue(this.userVModel.roleCategoryId);
    this.form.controls.fcRoleCategoryName.patchValue(this.userVModel.roleCategoryName);
    this.form.controls.fcTehsilId.patchValue(this.userVModel.lstTehsilIDS);

    this.form.controls.fcOrganization.disable();
    this.form.controls.fcOrganizationType.disable();
    // this.form.controls.fcTehsilId.patchValue(this.userVModel.tehsilId);
    this.form.controls.fcSiteAdministrator.patchValue(this.userVModel.siteAdministrator.toString());
    let other = this.lstRoleCategory.find(r => (r.name || '').toLowerCase() === 'other');
    if (other && other.codeID && other.codeID === this.userVModel.roleCategoryId) {
      this.showRoleCategoryName = true;
    }
    let other2 = this.lstRoleCategory.find(r => (r.name || '').toLowerCase() === 'field agent');
    if (other2 && other2.codeID && other2.codeID === this.userVModel.roleCategoryId) {
      this.showTehsilId = true;
    }
    this.markPiperUser(this.userVModel.isPiperUser);
    // this.userAccountService
    //   .GetAllRolesForOrganization(this.userVModel.userOrgnId)
    //   .subscribe(response => {
    //     this.lstRoles = response.dataObject;
    //   });
    
    this.selectedValueOrganization = this.userVModel.userOrgnId;
    this.selectedValueOrgType = this.userVModel.userOrgnTypeId;
    this.selectedClients = this.userVModel.lstOrganizationIDS;
    this.selectedRoles = this.userVModel.lstRoleIDS;
    this.selectedTehsils = this.userVModel.lstTehsilIDS;
    this.selectedReportRoles = this.userVModel.lstReportRoleIDS[0]; // Due to report-role fields access this implementation change from list to single object at front-end but it doesn't change on backend. IE-437
    this.selectedValuePipers = this.userVModel.lstPiperIDS;
    // this.selectedEulas.concat(this.userVModel.lstEulaIDS);
    this.lstEulasWithStatus = this.userVModel.lstEulasWithStatus;
    this.selectedRoleCategory = this.userVModel.roleCategoryId;


    this.lstEulasWithStatus.forEach(value => {
      const element = this.lstEulas.find(x => x.codeID === value.eulaId);
      if (element) {
        if (value.statusId === 2) {
          element.tag = 2;
          element.disabled = true;
        }

      }
    });
    this.userVModel.lstEulaIDS.forEach(element => {
      this.selectedEulas.push(element);
    });

    this.renderLstEulas = true;

    this.selectedOrgType(this.userVModel.userOrgnTypeId, false);
    // this.LoadLocationTree(this.userVModel.userOrgnId, false, this.userVModel.lstSiteIDS, false);
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
    
    // if (fcCellCode == null || fcCellCode == undefined || fcCellCode == '' || fcCellCode.lenght == 0) {
    //   fcCellCode = 0;
    //   fcCellNumber = '';
    // }
    this.isNavigated = true;
    // stop here if form is invalid
    if (this.form.invalid) {

      // this.FillMandatoryFieldsNotif();
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
    fcPhoneCode = 92
    fcCellCode = 92
    // const domCellElement = this.cellInputElement.nativeElement;
    // const domWorkElement = this.workInputElement.nativeElement;
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

    this.OrgAndSiteIds;
    const user: UserVModel = {
      userId: +this.userId,
      userFirstName: fcFirstName,
      userLastName: fcLastName,
      userWrkPhoneCodeId: fcPhoneCode,
      userWrkPhoneNo: fcPhoneNumber.substring(0, 11),
      userPhoneCodeId: fcCellCode,
      userPhoneNo: fcCellNumber.substring(0, 11),
      EmailId: fcEmail,

      userOrgnTypeId: this.userVModel.userOrgnTypeId,
      userOrgnId: this.userVModel.userOrgnId,
      orgnName: null,

      userOrgnSiteId: 0,
      userPrimaryContact: fcPrimaryContact,
      isActive: fcIsActive,

      lstRoleIDS: fcRoleId,
      lstReportRoleIDS: fcReportRoleId ? [fcReportRoleId] : [],  // Due to report-role fields access this implementation change from list to single object at front-end but it doesn't change on backend. IE-437
      lstOrganizationIDS: fcClientId,
      userDesignation: fcDesignation,
      isForDISAPI: false,
      lstSiteIDS: this.values,
      lstEulaIDS: fcEulaId,
      lstPiperIDS: fcPipers,
      isPiperUser: storePiper,
      orgSites: this.OrgAndSiteIds,
      lstTestSitesIDS: this.lstTestingSites,
      lstClientIDS: this.lstClientSites,
      roleCategoryId: fcRoleCategoryId,
      roleCategoryName: fcRoleCategoryName,
      siteAdministrator: fcSiteAdministrator,
      // tehsilId: fcTehsilId
      lstTehsilIDS: fcTehsilId

    };

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.userAccountService.updateUser(user).subscribe(response => {


      if (response.statusCode === STATUS_CODE.SUCCESS) {
        // if (this.selectedValueOrganization) {
        //   this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
        //   this.manageOrganizationsService
        //     .UpdateTestSites(this.values)
        //     .subscribe(res => {
        //     });
        // }

        this.ProcessSaveSuccess(response, true);
      } else {

        this.ProcessSaveFail(response);
      }
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    });

  }

  ResetPassword() {

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.userAccountService.ResetPassword(+this.userId).subscribe(response => {

      if (response.statusCode === STATUS_CODE.SUCCESS) {

        this.ShowSuccessNotification(response.message);

      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

        this.ShowErrorNotification(response.message);
      }

      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);

    });

  }

  ResetUserPin() {
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.userAccountService.ResetPin(+this.userId).subscribe(response => {

      if (response.statusCode === STATUS_CODE.SUCCESS) {

        this.ShowSuccessNotification(response.message);

      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

        this.ShowErrorNotification(response.message);
      }

      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);

    });

  }
  closeTree(maintainVal) {

    this.selectedSites = [];
    this.showConfirmationFlag = false;
    this.showConfirmationFlag2 = false;
    this.showTreeDiv = false;
  }
  hideTree() {



    this.showConfirmationFlag = false;
    this.showTreeDiv = false;
    this.OrgAndSiteIds = [];

    for (let i = 0; i < this.savedOrgnAndSites.length; i++) {
      this.OrgAndSiteIds.push({
        userId: this.savedOrgnAndSites[i].userId,
        orgnId: this.savedOrgnAndSites[i].orgnId,
        siteId: this.savedOrgnAndSites[i].siteId
      });
    }
  }
  saveClientSites(save, prev, getData) {
    this.savedOrgnAndSites = [];
    for (let i = 0; i < this.OrgAndSiteIds.length; i++) {
      this.savedOrgnAndSites.push({
        userId: this.OrgAndSiteIds[i].userId,
        orgnId: this.OrgAndSiteIds[i].orgnId,
        siteId: this.OrgAndSiteIds[i].siteId
      });
    }
    this.showConfirmationFlag = false;
    this.showTreeDiv = false;
  }
  saveClientSitesandCloseTree() {
  }
  GetAllSitesForClients(savePrev) {
  }
  // LoadLocationTreeandFillData(param) {
  //   if (param) {
  //     this.closeForcefully = false;
  //     if (this.selectedClients2 && this.selectedClients2.length != 0) {
  //       let foundVal = false;
  //       for (let i = 0; i < this.OrgAndSiteIds.length; i++) {
  //         if (this.OrgAndSiteIds[i].orgnId == this.selectedClients2) {
  //           this.LoadLocationTree(this.selectedClients2, false, this.OrgAndSiteIds[i].siteId, true);
  //           foundVal = true;
  //         }
  //       }
  //       if (!foundVal) {
  //         this.LoadLocationTree(this.selectedClients2, false, [], true);
  //       }
  //     }
  //   }
  //   else {
  //     this.itemsLst2 = [];
  //     this.closeForcefully = true;
  //     this.ValueChangedIndicator = false;
  //   }
  // }


}


