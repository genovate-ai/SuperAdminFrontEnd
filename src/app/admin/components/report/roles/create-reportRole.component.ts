import { Component, OnInit } from '@angular/core';
import {

  FormArray,
  UntypedFormBuilder, FormControl, FormGroup,

} from '@angular/forms';

import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { STATUS_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { BaseReportRoleFormComponent } from './base-reportRoleform.component';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import { ReportRoleVModel } from 'src/app/shared/models/reports/ReportRoleV.Model';

@Component({
  selector: 'app-create-reportRole',
  templateUrl: './create-reportRole.component.html'
})
export class CreateReportRoleComponent extends BaseReportRoleFormComponent implements OnInit {

  eventGroup = EVENTGROUP_CODE.INSERT;
  isFromUpdateComponent = false;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    private manageReportService: ManageReportService,
    protected notification: NotificationServiceService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected accountService: AccountService
  ) {

    super(formBuilder, translationPipe, popupController, notification, accountService);
    this.isNavigated = false;

  }


  ngOnInit() {
    this.SetRoleSecurity(this.screen, this.eventGroup);
    this.resetForm(false);

    // this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    // this.manageReportService.loadReportTypeList().subscribe(response => {
    //   this.lstReports = response.dataObject
    //   this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    // });

    // this.lstReports = [
    //   {codeID:1, name:'Salmonella'},
    //   {codeID:2, name:'Coccidia'},
    //   {codeID:3, name:'External Salmonella'},
    //   {codeID:4, name:'External Coccidia'},
    // ];

  }

  submit({
    fcName,
    fcDesc,
    fcIsActive,
    fcdataSecurity,
    fcauditTrail
  }) {
    
    if (this.CheckFormValid() === false) {
      this.isNavigated = true;
      this.form.markAllAsTouched();
      return false;
    }

    // let tempArr = [];
    // this.lstAllReportFields.forEach(element => {
    //   element.reportFields.forEach(element => {
    //     if(element.sysIndicator) {
    //       element.isViewAllow = element.sysIndicator;
    //     }
    //     tempArr.push(element);
    //   });
    // });

    let c = this.form.controls['fcDesc'].value;

    const role: any = {
      reportRoleID: 0,
      reportRoleName: fcName,
      reportRoleDesc: fcDesc,
      isActive: fcIsActive,
      dataSecurity: fcdataSecurity,
      auditTrail: fcauditTrail,
      // reportFieldsData: tempArr
    };

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.manageReportService.createReportRole(role).subscribe(response => {
      if (response.statusCode === STATUS_CODE.SUCCESS) {

        this.ProcessSaveSuccess(response);

      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

        this.ProcessSaveFail(response);

      }
      // tempArr = [];
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    });


  }

  loadReportFields(obj) {


    let index = this.lstAllReportFields.findIndex(x => x.reportId === obj.reportId);
    if (index > -1) {
      this.lstReportFields = [];
      let tempArr = (this.lstAllReportFields[index].reportFields || []);
      this.lstReportFields = [].concat(tempArr);
      tempArr = [];
    } else {
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

      this.manageReportService.getReportFields({ id: obj.reportId, roleId: null })
        .subscribe(response => {

          this.lstReportFields = response.dataObject;

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
    if (index > -1) {
      this.lstAllReportFields[index].reportFields[i].isViewAllow = event.target.checked;
    }

  }

}
