import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {  UntypedFormBuilder} from '@angular/forms';
import { FormValidatorsServiceService } from 'src/app/shared/services/common/form-validators.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { HelperFunctionsServiceService } from 'src/app/shared/services/common/helper-functions.service';
import { STATUS_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/shared/helper/Constants';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { OrganizationVModel } from 'src/app/shared/models/organization/OrganizationV.Model';
import { ManageOrganizationsService } from 'src/app/shared/services/manage-organizations/manage-organizations.service';
import { DomSanitizer } from '@angular/platform-browser';
import { baseorganizationformcomponent } from './base-organizationform.component';
import { AccountService } from 'src/app/shared/services/common/account.service';


@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html'
})
export class CreateOrganizationComponent extends baseorganizationformcomponent implements OnInit {

  eventGroup = EVENTGROUP_CODE.INSERT;
  isBlur;
  @ViewChild('work', { static: true }) workInputElement: ElementRef;
  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected manageOrganizationService: ManageOrganizationsService,
    protected formValidators: FormValidatorsServiceService,
    protected notification: NotificationServiceService,
    public popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected   accountService: AccountService
  ) {

    super(formBuilder, translationPipe, popupController, notification, formValidators, manageOrganizationService , accountService);

  }


  ngOnInit() {
    this.isUpdating = false;
    this.SetRoleSecurity(this.screen, this.eventGroup);
    this.resetForm();

    this.image64= Constants.defaultImage64;

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

    this.manageOrganizationService
      .loadCreateOrganizationScreenMetaData()
      .subscribe(response => {


        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
        this.lstOrgType = response.dataObject.lstOrganizationTypeVM;
        this.lstRoles = response.dataObject.lstRoleVM;
        this.lstReportRoles = response.dataObject.lstReport_RoleVM;
        this.lstEulas = response.dataObject.lstEulaVM;
        this.lstPhoneCode = response.dataObject.lstCountryVM;



      });
  }



  submit({
    fcName,
    fcEmail,
    fcIsActive,
    fcCellNumber,
    fcCellCode,
    fcOrganizationType,
    //fcImage,
    fcRoleId,
    fcReportRoleId,
    fcEulaId,
    fcMaxUsers

  }) {


    this.isNavigated = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // let reset = false;

    // let domElement = this.workInputElement.nativeElement;
    // let val;
    // if (domElement && domElement.value !== '') {
    //   val = domElement.value;
    //   fcCellNumber = val;
    // } else {
    //   val = '';
    //   fcCellNumber = val;
    // }

    // if(fcCellCode.length ==0)
    // {
    //   fcCellCode = null;
    // }
    
    if (fcCellCode == null || fcCellCode == undefined || fcCellCode == "" || fcCellCode.length) {
      fcCellCode = null
      //fcCellNumber = "";
    }

    var organ: OrganizationVModel = {
      orgnId: 0,
      orgnName: fcName,
      orgnTypeId: fcOrganizationType,
      orgnEmail: fcEmail,
      orgnLogo : this.image64,
      orgnUniqueNumber: '',
      orgnCtryPhoneCodeId: fcCellCode,
      orgnPhoneNo: fcCellNumber.substring(0, 11),
      orgnMaxUsers: fcMaxUsers,
      isActive: fcIsActive,

      lstUserRoleVM: fcRoleId ? fcRoleId : [],
      lstReportRoleVM: fcReportRoleId ? fcReportRoleId : [],
      lstEulaIDS: fcEulaId,
    };



    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.manageOrganizationService.createOrganization(organ).subscribe(response => {

      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      if (response.statusCode === STATUS_CODE.SUCCESS) {
        this.popupController.updateResult(true);
        this.ProcessSaveSuccess(response);
      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
        this.ProcessSaveFail(response);
      }
    });
  }


}
