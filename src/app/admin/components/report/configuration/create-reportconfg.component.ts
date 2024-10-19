import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder} from '@angular/forms';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import {  STATUS_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { RoleVModel } from 'src/app/shared/models/roles/RoleV.Model';
import { BaseReportFormConfigurationComponent } from './base-reportform.component';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import { IEReportConfigurationVM } from 'src/app/shared/models/reports/IEReportConfgV.Model';

@Component({
  selector: 'app-create-reportconfg',
  templateUrl: './create-reportconfg.component.html'
})
export class CreateReportConfgComponent extends BaseReportFormConfigurationComponent implements OnInit {

  eventGroup = EVENTGROUP_CODE.INSERT;
  isFromUpdateComponent = false;


  constructor(
    private manageReportConfgService: ManageReportService,
    protected formBuilder: UntypedFormBuilder,
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

  this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportConfgService
      .GetAllIEReportGroups()
      .subscribe(response => {
        this.lstReportGrp =  response.dataObject

        this.manageReportConfgService.GetAllIEReports().subscribe(response => {
          this.lstReport =  response.dataObject
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

        })
        
      });
  }

  submit({
    fcReportName,
    fcReportDesc,
    fcReportGrp,
    fcReport,
    fcIsActive

  }) {

    if (this.CheckFormValid() === false) {
        this.isNavigated = true;
        return false;
    }
    const cnfgReport: IEReportConfigurationVM = {
      ieReportConfigurationID: 0,
      ieReportGroupID: fcReportGrp,
      ieReportID: fcReport,
      displayName: fcReportName,
      description:fcReportDesc,
      groupName:fcReportGrp,
      reportName:fcReport,
      isActive: fcIsActive,
      isDeleted: false
    };

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.manageReportConfgService.ConfigureReport(cnfgReport).subscribe(response => {

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
