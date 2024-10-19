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

export class BaseReportFormComponent extends BaseFormComponent implements OnInit {


  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageReportConfg;
  lstReportGrp: Array<SelectBox> = [];
  lstReport: Array<SelectBox> = [];
  selectedReportGrp: any;
  selectedgroupRprt: any;
  isReportSelected: boolean = false;
  selectedReportType: any;
  reportCnfg: IEReportConfigurationVM;
  groupReportData: any;
  reportCnfgId: string;

  form: UntypedFormGroup;

  isNavigated: boolean = false;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected translationPipe: TranslationConfigService,
    protected popupController: PopupControllerService,
    protected notification: NotificationServiceService,
    protected accountService: AccountService
  ) {

    super(translationPipe, popupController, notification, accountService);

  }

  ngOnInit() {

  }

  resetReportForm(resetControls = true) {
    this.selectedReportGrp = [];
    this.selectedReportType = [];
    if (resetControls) {
      this.form.reset();
      this.form.controls['fcIsActive'].patchValue('true');
      this.form.markAllAsTouched();
    } else {
      this.form = this.formBuilder.group({
        fcReportName: ['', [Validators.required, Validators.maxLength(100)]],
        fcReportDesc: ['', [Validators.required, Validators.maxLength(200)]],
        fcReportGrp: ['', [Validators.required]],
        fcReport: ['', [Validators.required]],
        fcIsActive: ['true']
      });
    }

    if (!this.isSaveButtonAllow) {
      this.form.disable();
    }
  }

  resetGroupForm(resetControls = true) {
    
    this.selectedgroupRprt = [];
    this.selectedgroupRprt = [];
    if (resetControls) {
      setTimeout(() => {
        this.selectedgroupRprt = [];
      }, 0);
      this.form.reset();

      this.form.controls['fcIsActive'].patchValue('true');

      this.form.get('fcReportName').setValidators(null);
      this.form.get('fcReportName').setErrors(null);
      this.form.get('fcReportDesc').setValidators(null);
      this.form.get('fcReportDesc').setErrors(null);
      this.form.get('fcReportGrp').setValidators(null);
      this.form.get('fcReportGrp').setErrors(null);
      this.form.get('fcReport').setValidators(null);
      this.form.get('fcReport').setErrors(null);

      this.form.markAllAsTouched();
    } else {
      this.form = this.formBuilder.group({
        fcGroupName: ['', [Validators.required, Validators.maxLength(100)]],
        fcGroupDesc: ['', [Validators.required, Validators.maxLength(200)]],
        fcGroupRprt: ['', [Validators.required]],
        fcIsActive: ['true'],
        fcReportName: [''],
        fcReportDesc: [''],
        fcReportGrp: [''],
        fcReport: [''],
      });
    }
    if (!this.isSaveButtonAllow) {
      this.form.disable();
    }
  }


  public selectAllGroupRprt(e) {
    if (e.target.checked) {
      const selected = this.lstReport.map(item => item.codeID);
      this.form.get('fcGroupRprt').patchValue(selected);
    }
    else {
      this.form.get('fcGroupRprt').patchValue([]);
    }

  }

  CheckFormValid() {
    if (this.form.invalid) {
      return false;
    }
  }

  ProcessSaveSuccessReport(response) {

    this.ShowSuccessNotification(response.message);
    this.resetReportForm();
  }

  ProcessSaveSuccessGroup(response) {

    this.ShowSuccessNotification(response.message);
    this.resetGroupForm();
  }

  ProcessSaveFail(response) {

    this.ShowErrorNotification(response.message);

  }


}


