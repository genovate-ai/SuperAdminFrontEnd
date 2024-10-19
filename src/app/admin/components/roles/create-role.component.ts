import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import {

  UntypedFormBuilder,

} from '@angular/forms';

import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import {  STATUS_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ManageRoleService } from 'src/app/shared/services/manage-role-services/manage-role-service.service';
import { RoleVModel } from 'src/app/shared/models/roles/RoleV.Model';
import { BaseRoleFormComponent } from './base-roleform.component';
import { AccountService } from 'src/app/shared/services/common/account.service';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html'
})
export class CreateRoleComponent extends BaseRoleFormComponent implements OnInit {

  eventGroup = EVENTGROUP_CODE.INSERT;
  isFromUpdateComponent = false;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    private manageRoleService: ManageRoleService,
    protected notification: NotificationServiceService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected accountService:AccountService
  ) {

    super(formBuilder, translationPipe, popupController, notification, accountService);

    this.isNavigated = false;

  }


  ngOnInit() {
    this.SetRoleSecurity(this.screen, this.eventGroup);
    this.resetForm();

  }

  submit({
    fcName,
    fcDesc,
    fcIsActive

  }) {

    if (this.CheckFormValid() === false) {
        this.isNavigated = true;
        return false;
    }



    const role: RoleVModel = {
      userRoleId: 0,
      userRoleName: fcName,
      userRoleDesc: fcDesc,
      isActive: fcIsActive

    };

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.manageRoleService.createRole(role).subscribe(response => {


      if (response.statusCode === STATUS_CODE.SUCCESS) {

       this.ProcessSaveSuccess(response);

      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

        this.ProcessSaveFail(response);

      }

      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    });


  }





}
