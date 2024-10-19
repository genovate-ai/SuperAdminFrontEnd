import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { RoleVModel } from 'src/app/shared/models/roles/RoleV.Model';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { SCREEN_CODE } from 'src/app/shared/helper/Enums';

// This component just has a controller file. it uses template and stylesheet fron create-user-component.
@Component({
  template: ''
})

export class BaseRoleFormComponent extends BaseFormComponent implements OnInit {


  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageRole;


  form: UntypedFormGroup;
  roleId: string;
  roleVModel: RoleVModel;

  isNavigated: boolean = false;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected translationPipe: TranslationConfigService,
    protected popupController: PopupControllerService,
    protected notification: NotificationServiceService,
    protected accountService:AccountService
  ) {

    super(translationPipe, popupController, notification, accountService);
  }

  ngOnInit() {
  }
  reset(){
    this.form.reset();
    this.form.get('fcIsActive').setValue("true");
  }

  resetForm() {

    this.form = this.formBuilder.group({
      fcName: ['', [Validators.required, Validators.maxLength(60), Validators.pattern('^[0-9a-zA-Z][0-9a-zA-Z_\\-\\. ]*$')]],
      fcDesc: ['', [Validators.required,  Validators.maxLength(200)]],
      fcIsActive: ['true']
    });

    // //MEMO: Role Management
    if (!this.isSaveButtonAllow) {
      this.form.disable();
    }


  }


  CheckFormValid() {
    if (this.form.invalid) {
      return false;
    }
  }

  ProcessSaveSuccess(response) {

    this.ShowSuccessNotification(response.message);

    this.resetForm();
    this.popupController.updateResult(true);
    this.close();
  }

  ProcessSaveFail(response) {

    this.ShowErrorNotification(response.message);

  }


}


