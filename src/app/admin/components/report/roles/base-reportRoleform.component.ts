import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, FormControl } from '@angular/forms';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { API_CALLEVENTGROUP_CODE, SCREEN_CODE } from 'src/app/shared/helper/Enums';
import { ReportRoleVModel } from 'src/app/shared/models/reports/ReportRoleV.Model';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';

// This component just has a controller file. it uses template and stylesheet fron create-user-component.
@Component({
  template: ''
})

export class BaseReportRoleFormComponent extends BaseFormComponent implements OnInit {


  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageReportRole;


  form: UntypedFormGroup;
  roleId: string;
  reportRoleVModel: ReportRoleVModel;

  isNavigated: boolean = false;

  // For report fields #Start
  selectedReport: any;
  lstReports = [];
  lstReportFields: Array<any> = [];
  lstAllReportFields: Array<any> = [];
  // lstAllowedColumns: Array<any> = [];
  rptFieldCTRL = new UntypedFormArray([]); // report field control
  // For report fields #End

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

  resetForm(resetControls = true) {

    this.rptFieldCTRL = new UntypedFormArray([]);
    if(resetControls) {
      this.form.reset();
      this.form.controls['fcIsActive'].patchValue('true');
      this.form.controls['fcdataSecurity'].patchValue('true');
      this.form.controls['fcauditTrail'].patchValue('false');
    } else {
      this.form = this.formBuilder.group({
        fcName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern('^[0-9a-zA-Z][0-9a-zA-Z_\\-\\. ]*$')]],
        fcDesc: ['', [Validators.required, Validators.maxLength(200)]],
        fcIsActive: ['true'],
        fcdataSecurity: ['true'],
        fcauditTrail: ['false'],
        fcReportType: []
        // fcReportFields: this.rptFieldCTRL
      });
    }

    // this.lstReportColumns.forEach(element => {
    //   this.rptColumnCTRL.push(
    //     new FormGroup({
    //       fcCheckBox: new FormControl(false),
    //       fcColumnName: new FormControl('ColName')
    //     })
    //   );
    // });


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
    this.popupController.updateResult(true);
    // this.resetForm();
    this.close();
  }

  ProcessSaveFail(response) {

    this.ShowErrorNotification(response.message);

  }



}


