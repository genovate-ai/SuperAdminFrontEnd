import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,

  UntypedFormArray,
  UntypedFormControl,

} from '@angular/forms';
import { FormValidatorsServiceService } from 'src/app/shared/services/common/form-validators.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { HelperFunctionsServiceService } from 'src/app/shared/services/common/helper-functions.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ManageRoleService } from 'src/app/shared/services/manage-role-services/manage-role-service.service';
import { AccessRightVModel } from 'src/app/shared/models/roles/AccessRightV.Model';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { STATUS_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { BaseRoleFormComponent } from './base-roleform.component';

@Component({
  selector: 'app-create-rights',
  templateUrl: './create-rights.component.html'
})
export class CreateRightsComponent extends BaseRoleFormComponent implements OnInit {

  eventGroup = EVENTGROUP_CODE.UPDATE;

  form: UntypedFormGroup;
  isFromUpdateComponent: boolean = true;
  isNavigated: boolean = false;
  lclUserRoleId: number;
  roleId: string;

  accessRightsCTR = new UntypedFormArray([]);

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected manageRoleService: ManageRoleService,
    private route: ActivatedRoute,
    protected notification: NotificationServiceService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected accountService: AccountService

  ) {
    super(formBuilder, translationPipe, popupController, notification, accountService);

  }


  ngOnInit() {

    this.SetRoleSecurity(this.screen, this.eventGroup);

    if (this.route.snapshot.paramMap.get('id')) { // if this components is called via routing
      this.roleId = this.route.snapshot.paramMap.get('id');
    } else { // if this components is called via popup
      this.roleId = this.popupController.getParams() as string;
    }

    this.resetForm();

  }

  submit({
    fcLstAccessRights
  }) {

    const lstAccessRights: Array<AccessRightVModel> = [];
    
    const arrayControl = fcLstAccessRights as UntypedFormArray;

    for (let index = 0; index < arrayControl.length; index++) {


      const element = arrayControl[index];

      const lclAccessRightVModel: AccessRightVModel = {

        userRoleId: +this.roleId,
        roleAccessId: element.fcRoleAccessId,
        isCreateAllow: element.fcIsCreate,
        isUpdateAllow: element.fcIsUpdate,
        isViewAllow: element.fcIsView,
        screenName: element.fcScreenName,
        screenId: 0,
        isActive: true,
        isCreateAble: false,
        isUpdateAble: false,
        isViewAble: false,
        isFieldAccessAllow: element.fcFieldAccess,
        adminRoleReportFieldsAcess: element.fcAdminRoleReportFieldsAcess
      };

      lstAccessRights.push(lclAccessRightVModel);

    }

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.manageRoleService.EditRoleRights(lstAccessRights).subscribe(response => {



      if (response.statusCode === STATUS_CODE.SUCCESS) {

        this.ShowSuccessNotification(response.message);

        this.resetForm();
        this.close();

      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

        this.ShowErrorNotification(response.message);

      }
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);

    });


  }

  resetForm() {

    this.accessRightsCTR = new UntypedFormArray([]);
    this.form = this.formBuilder.group({
      fcLstAccessRights: this.accessRightsCTR
    });


    let lstAccessRights: Array<AccessRightVModel> = [];
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    
    this.manageRoleService
      .LoadManageRightsMetaData(this.roleId)
      .subscribe(response => {

        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
        lstAccessRights = response.dataObject;
        
        for (const rightobj of lstAccessRights) {

          this.accessRightsCTR.push(

            new UntypedFormGroup({

              fcRoleAccessId: new UntypedFormControl(rightobj.roleAccessId),
              fcScreenName: new UntypedFormControl(rightobj.screenName),
              fcIsCreate: new UntypedFormControl(rightobj.isCreateAllow),
              fcIsUpdate: new UntypedFormControl(rightobj.isUpdateAllow),
              fcIsView: new UntypedFormControl(rightobj.isViewAllow),
              fcIsCreateAble: new UntypedFormControl(rightobj.isCreateAble),
              fcIsUpdateAble: new UntypedFormControl(rightobj.isUpdateAble),
              fcIsViewAble: new UntypedFormControl(rightobj.isViewAble),

              fcFieldAccess: new UntypedFormControl(rightobj.isFieldAccessAllow),
              fcShowFieldAccess: new UntypedFormControl(false),
              fcAdminRoleReportFieldsAcess: new UntypedFormControl(rightobj.adminRoleReportFieldsAcess),
              fcSearchFieldAccess: new UntypedFormControl(''),
              fcShowAllFields: new UntypedFormControl(rightobj.fcShowAllFields ? rightobj.fcShowAllFields : false),
              fcHiddenFieldsCnt: new UntypedFormControl(0)
            })

          );

        }

      });

    // //MEMO: Role Management
    if (!this.isSaveButtonAllow) {
      this.form.disable();
    }
  }


  get formData() {

    return <UntypedFormArray>this.form.get('fcLstAccessRights');
  }


  showHideFields(right) {
    // setTimeout(() => {
    right.controls['fcShowFieldAccess'].setValue(!right.controls['fcShowFieldAccess'].value);
    right.controls['fcSearchFieldAccess'].setValue('');
    if (right.controls['fcShowFieldAccess'].value == false) {
      right.controls['fcShowAllFields'].setValue(false);
    }

    // }, 0);

  }

  markUnmarkAccessField(item) {
    if (item.sysIndicator === true && item.isViewAllow === true) {
      return;
    } else {
      if (item.dataState === 'NotModified') {
        item.dataState = 'DataModified';
      } else if (item.dataState === 'DataModified') {
        item.dataState = 'NotModified';
      } else {
        item.dataState = item.dataState;
      }
      // item.dataState = item.dataState === 'NotModified' ? 'DataModified' : 'NotModified';
      item.isViewAllow = !item.isViewAllow;
    }
  }

  trackByFieldId(index: number, item: any): string {
    return item.fieldId;
  }


}
