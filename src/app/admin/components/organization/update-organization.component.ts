import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormValidatorsServiceService } from 'src/app/shared/services/common/form-validators.service';
import { Router, ActivatedRoute } from '@angular/router';
import { STATUS_CODE, MessagesCodes, EVENTGROUP_CODE, SCREEN_CODE, EVENT_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AlertModel, AlertType, HeaderType } from 'src/app/shared/models/Alert.Model';
import { HelperFunctionsServiceService } from 'src/app/shared/services/common/helper-functions.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { SelectBox } from 'src/app/shared/models/SelectBox.Model';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { OrganizationVModel } from 'src/app/shared/models/organization/OrganizationV.Model';
import { ManageOrganizationsService } from 'src/app/shared/services/manage-organizations/manage-organizations.service';
import { Constants } from 'src/app/shared/helper/Constants';
import { DomSanitizer } from '@angular/platform-browser';
import { baseorganizationformcomponent } from './base-organizationform.component';
import { AccountService } from 'src/app/shared/services/common/account.service';

// This component just has a controller file. it uses template and stylesheet fron create-user-component.

@Component({
  selector: 'app-update-organization',
  templateUrl: './create-organization.component.html'
})
export class UpdateOrganizationComponent extends baseorganizationformcomponent implements OnInit {

  eventGroup = EVENTGROUP_CODE.UPDATE;


  isFromUpdate = true;
  isFromUpdateComponent = true;
  organizationVModel: OrganizationVModel;
  organId: string;
  isBlur;
  @ViewChild('work', { static: true }) workInputElement: ElementRef;
  constructor(protected formBuilder: UntypedFormBuilder,
    protected manageOrganizationsService: ManageOrganizationsService,
    protected formValidators: FormValidatorsServiceService,
    private route: ActivatedRoute,
    protected notification: NotificationServiceService,
    public popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected accountService: AccountService) {

    super(formBuilder, translationPipe, popupController, notification,
      formValidators, manageOrganizationsService, accountService);

  }


  ngOnInit() {
    this.isUpdating = true;
    this.SetRoleSecurity(this.screen, this.eventGroup);
    
    if (this.route.snapshot.paramMap.get('id')) { // if this components is called via routing
      this.organId = this.route.snapshot.paramMap.get('id');
    } else { // if this components is called via popup
      this.organId = this.popupController.getParams() as string;
    }

    this.resetForm();


    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageOrganizationsService.loadCreateOrganizationScreenMetaData()
      .subscribe(response => {
        
        this.lstOrgType = response.dataObject.lstOrganizationTypeVM;
        this.lstRoles = response.dataObject.lstRoleVM;
        this.lstReportRoles = response.dataObject.lstReport_RoleVM;
        this.lstPhoneCode = response.dataObject.lstCountryVM;
        this.lstEulas = response.dataObject.lstEulaVM;

        this.manageOrganizationsService.LoadOrganizationData(this.organId).subscribe(data => {

          this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

          this.organizationVModel = data.dataObject;
          
          this.FillFCFromModel();
          let obj = this.form.controls.fcCellCode.value ? { code: this.form.controls.fcCellCode.value } : null;
          // this.isCellCodeSelected(obj, false);
          // this.selectedRoles = this.organizationVModel.lstRoleIDS;
          this.selectedRoles = this.organizationVModel.lstUserRoleVM;
          this.selectedReportRoles = this.organizationVModel.lstReportRoleVM;
          this.selectedEulas = this.organizationVModel.lstEulaIDS;
          this.image64 = this.organizationVModel.orgnLogo;

        });
      });

  }


  FillFCFromModel() {
    
    // MEMO : Below Validation Required otherwise after edit validation will not work.
    this.form.controls.fcName.patchValue(this.organizationVModel.orgnName);
    this.form.controls.fcOrgID.patchValue(this.organizationVModel.orgnUniqueNumber);
    this.form.controls.fcEmail.patchValue(this.organizationVModel.orgnEmail);
    this.form.controls.fcOrganizationType.patchValue(this.organizationVModel.orgnTypeId);
    this.form.controls.fcCellCode.patchValue(this.organizationVModel.orgnCtryPhoneCodeId);
    this.form.controls.fcCellNumber.patchValue(this.organizationVModel.orgnPhoneNo);

    this.form.controls.fcIsActive.patchValue(this.organizationVModel.isActive.toString());
    this.form.controls.fcMaxUsers.patchValue(this.organizationVModel.orgnMaxUsers);
    this.form.controls.fcRoleId.patchValue(this.organizationVModel.lstUserRoleVM);
    this.form.controls.fcReportRoleId.patchValue(this.organizationVModel.lstReportRoleVM);
    this.form.controls.fcEulaId.patchValue(this.organizationVModel.lstEulaIDS);

    this.form.controls.fcOrgID.disable();

  }



  submit({
    fcName,
    fcEmail,
    fcIsActive,
    fcCellNumber,
    fcCellCode,
    fcOrganizationType,
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

    if (this.image64 === '') {

      this.image64 = Constants.defaultImage64;

    }

    // const domElement = this.workInputElement.nativeElement;
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

    // if (fcCellCode == null || fcCellCode == undefined || fcCellCode == "" || fcCellCode.length) {
    //   fcCellCode = null
    //   fcCellNumber = "";
    // }

    const organ: OrganizationVModel = {
      orgnId: +this.organId,
      orgnName: fcName,
      orgnTypeId: fcOrganizationType,
      orgnEmail: fcEmail,
      orgnLogo: this.image64,
      orgnUniqueNumber: '',
      orgnCtryPhoneCodeId: fcCellCode,
      orgnPhoneNo: fcCellNumber.substring(0, 11),
      orgnMaxUsers: fcMaxUsers,
      isActive: fcIsActive,

      lstUserRoleVM: fcRoleId ? fcRoleId : [],
      lstReportRoleVM: fcReportRoleId ? fcReportRoleId : [],
      lstEulaIDS: fcEulaId

    };

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.manageOrganizationsService.updateOrganization(organ).subscribe(response => {

      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);

      if (response.statusCode === STATUS_CODE.SUCCESS) {
        this.popupController.updateResult(true);
        this.ProcessSaveSuccess(response);
      } else if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
        this.ProcessSaveFail(response);
      }

    });

  }

}


