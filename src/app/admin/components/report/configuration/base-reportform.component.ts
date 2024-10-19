import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { RoleVModel } from 'src/app/shared/models/roles/RoleV.Model';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { SCREEN_CODE } from 'src/app/shared/helper/Enums';
import { IEReportConfigurationVM } from 'src/app/shared/models/reports/IEReportConfgV.Model';
import { SelectBox } from 'src/app/shared/models/SelectBox.Model';

// This component just has a controller file. it uses template and stylesheet fron create-user-component.
@Component({
  template: ''
})

export class BaseReportFormConfigurationComponent extends BaseFormComponent implements OnInit {


  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageReportConfg;
  lstReportGrp: Array<SelectBox> = [];
  lstReport: Array<SelectBox> = [];
  selectedReportGrp: any;
  selectedReportType: any;
  reportCnfg: IEReportConfigurationVM;
  reportCnfgId : string;
  
  form: UntypedFormGroup;

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
  resetForm() {

    this.selectedReportGrp = [];
    this.selectedReportType = [];
    this.form = this.formBuilder.group({
      fcReportName: ['', [Validators.required, Validators.maxLength(200)]],
      fcReportDesc: ['', [Validators.required, Validators.maxLength(300)]],
      fcReportGrp:  ['', [Validators.required]],
      fcReport:     ['', [Validators.required]],
      fcIsActive: ['true']
    });

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
    this.close();
  }

  ProcessSaveFail(response) {

    this.ShowErrorNotification(response.message);

  }


}


