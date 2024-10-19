import { Component, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { STATUS_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { BaseReportRoleFormComponent } from './base-reportRoleform.component';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import { ReportRoleVModel } from 'src/app/shared/models/reports/ReportRoleV.Model';

// This component just has a controller file. it uses template and stylesheet fron create-user-component.

@Component({
  selector: 'app-update-reportRole',
  templateUrl: './create-reportRole.component.html'
})
export class UpdateReportRoleComponent extends BaseReportRoleFormComponent implements OnInit {

  eventGroup = EVENTGROUP_CODE.UPDATE;
  isFromUpdateComponent = true;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    private manageReportService: ManageReportService,
    protected notification: NotificationServiceService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    private route: ActivatedRoute,
    protected accountService: AccountService


  ) {
    super(formBuilder, translationPipe, popupController, notification, accountService);
  }

  ngOnInit() {


    this.SetRoleSecurity(this.screen, this.eventGroup);

    if (this.route.snapshot.paramMap.get('id')) {
      this.roleId = this.route.snapshot.paramMap.get('id');
    } else {
      this.roleId = this.popupController.getParams() as string;
    }
    this.resetForm(false);

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService.LoadReportRoleByRoleId(+this.roleId).subscribe(data => {
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      // this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      // this.manageReportService.loadReportTypeList().subscribe(response => {

      //   this.lstReports = response.dataObject
      //   this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      // });
      this.reportRoleVModel = data.dataObject;
      this.FillFCFromModel();


    });

  }

  submit({
    fcName,
    fcDesc,
    fcIsActive,
    fcdataSecurity,
    fcauditTrail
  }) {


    if (this.CheckFormValid() === false) {
      this.form.markAllAsTouched();
      return false;
    }

    // let tempArr = [];
    // this.lstAllReportFields.forEach(element => {
    //   element.roleId = +this.roleId;
    //   element.reportFields.forEach(element => {
    //     if(element.source !== 'LKUP') {
    //       if(element.isViewAllowState != element.isViewAllow) {
    //         tempArr.push(element);
    //       }
    //     } else {
    //       tempArr.push(element);
    //     }
    //   });
    // });

    const role: any = {
      reportRoleID: +this.roleId,
      reportRoleName: fcName,
      reportRoleDesc: fcDesc,
      isActive: fcIsActive,
      dataSecurity: fcdataSecurity,
      auditTrail: fcauditTrail,
      // reportFieldsData: tempArr
    };

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.manageReportService.updateReportRole(role).subscribe(response => {

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
    // this.form = this.formBuilder.group({

    //   fcName: [this.reportRoleVModel.reportRoleName, [Validators.required, Validators.maxLength(200)]],
    //   fcDesc: [this.reportRoleVModel.reportRoleDesc, [Validators.required, Validators.maxLength(200)]],

    //   fcIsActive: this.reportRoleVModel.isActive.toString(),
    //   fcdataSecurity: this.reportRoleVModel.dataSecurity.toString(),
    //   fcauditTrail: this.reportRoleVModel.auditTrail.toString(),
    //   fcReportType: []
    // });
    this.form.controls['fcName'].patchValue(this.reportRoleVModel.reportRoleName);
    this.form.controls['fcDesc'].patchValue(this.reportRoleVModel.reportRoleDesc);
    this.form.controls['fcIsActive'].patchValue(this.reportRoleVModel.isActive.toString());
    this.form.controls['fcdataSecurity'].patchValue(this.reportRoleVModel.dataSecurity.toString());
    this.form.controls['fcauditTrail'].patchValue(this.reportRoleVModel.auditTrail.toString());
  }

  loadReportFields(obj) {


    let index = this.lstAllReportFields.findIndex(x => x.reportId === obj.reportId);
    if(index > -1) {
      this.lstReportFields = [];
      let tempArr = (this.lstAllReportFields[index].reportFields || []);
      this.lstReportFields = [].concat(tempArr);
      tempArr = [];
    } else {
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

      this.manageReportService.getReportFields({id: obj.reportId, roleId: +this.roleId})
      .subscribe(response => {

        this.lstReportFields = response.dataObject;

        if(this.lstReportFields.length > 0) {
          if(this.lstReportFields[0].source !== 'LKUP') {
            this.lstReportFields.forEach(element => {
              if(element.sysIndicator) {
                element.isViewAllow = element.sysIndicator;
              }
              element['isViewAllowState'] = element.isViewAllow;
            });
          }
        }

        this.lstAllReportFields.push({
          reportId: obj.reportId,
          reportFields: response.dataObject
        });

        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT)
      });
    }

  }

  onFieldSelectionChange(event, data, i) {

    let index = this.lstAllReportFields.findIndex(x => x.reportId === data.reportId);
    if(index > -1) {
      this.lstAllReportFields[index].reportFields[i].isViewAllow = event.target.checked;
    }

  }

}


