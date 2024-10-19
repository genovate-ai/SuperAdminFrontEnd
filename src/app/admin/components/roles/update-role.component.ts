import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { STATUS_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE} from 'src/app/shared/helper/Enums';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ManageRoleService } from 'src/app/shared/services/manage-role-services/manage-role-service.service';
import { RoleVModel } from 'src/app/shared/models/roles/RoleV.Model';
import { BaseRoleFormComponent } from './base-roleform.component';
import { AccountService } from 'src/app/shared/services/common/account.service';

// This component just has a controller file. it uses template and stylesheet fron create-user-component.

@Component({
  selector: 'app-update-role',
  templateUrl: './create-role.component.html'
})
export class UpdateRoleComponent extends BaseRoleFormComponent implements OnInit {

  eventGroup = EVENTGROUP_CODE.UPDATE;
  isFromUpdateComponent = true;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    private manageRoleService: ManageRoleService,
    protected notification: NotificationServiceService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    private route: ActivatedRoute,
    protected accountService:AccountService


  ) {
    super(formBuilder, translationPipe, popupController, notification,accountService);
  }

  ngOnInit() {

    
    this.SetRoleSecurity(this.screen, this.eventGroup);
    
    if (this.route.snapshot.paramMap.get('id')) {
      this.roleId = this.route.snapshot.paramMap.get('id');
    } else {
      this.roleId = this.popupController.getParams() as string;
    }
    this.resetForm();
    
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
    this.manageRoleService.LoadRoleByRoleId(+this.roleId).subscribe(data => {
    this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
    this.roleVModel = data.dataObject;
    this.FillFCFromModel();
    
    });

  }

  submit({
    fcName,
    fcDesc,
    fcIsActive

  }) {


    if (this.CheckFormValid() === false) {

      return false;
    }

    const role: RoleVModel = {
      userRoleId: +this.roleId,
      userRoleName: fcName,
      userRoleDesc: fcDesc,
      isActive: fcIsActive

    };

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.manageRoleService.updateRole(role).subscribe(response => {

      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      
      if (response.statusCode === STATUS_CODE.SUCCESS) {

        this.ProcessSaveSuccess(response);

      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
        this.ProcessSaveFail(response);
      }
      
    });

  }


  FillFCFromModel() {

    // MEMO : Below Validation Required otherwise after edit validation will not work.

    this.form.get('fcName').patchValue(this.roleVModel.userRoleName)
    this.form.get('fcDesc').patchValue(this.roleVModel.userRoleDesc)
    this.form.get('fcIsActive').patchValue( this.roleVModel.isActive.toString())
  }

}


