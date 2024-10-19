import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { STATUS_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE} from 'src/app/shared/helper/Enums';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ManageRoleService } from 'src/app/shared/services/manage-role-services/manage-role-service.service';
import { RoleVModel } from 'src/app/shared/models/roles/RoleV.Model';
import { BaseReportFormConfigurationComponent} from './base-reportform.component';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { IEReportConfigurationVM } from 'src/app/shared/models/reports/IEReportConfgV.Model';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';

// This component just has a controller file. it uses template and stylesheet fron create-user-component.

@Component({
  selector: 'app-update-reportconfg',
  templateUrl: './create-reportconfg.component.html'
})
export class UpdateReportConfgComponent extends BaseReportFormConfigurationComponent implements OnInit {

  eventGroup = EVENTGROUP_CODE.UPDATE;
  isFromUpdateComponent = true;


  constructor(
    protected formBuilder: UntypedFormBuilder,
    private manageReportConfgService: ManageReportService,

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
      this.reportCnfgId = this.route.snapshot.paramMap.get('id');
    } else {
      this.reportCnfgId = this.popupController.getParams() as string;
    }
    this.resetForm();
    

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportConfgService.LoadCnfgReportById(+this.reportCnfgId).subscribe(response => {

      this.reportCnfg = response.dataObject;
      this.manageReportConfgService.GetAllIEReportGroups().subscribe(response => {
        this.lstReportGrp =  response.dataObject
        this.manageReportConfgService.GetAllIEReports().subscribe(response => {
          this.lstReport =  response.dataObject
          this.FillFCFromModel();
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

        })
        
      });
    })
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
    ieReportConfigurationID:  +this.reportCnfgId,
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
    this.manageReportConfgService.updateCnfgReport(cnfgReport).subscribe(response => {

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
    this.form = this.formBuilder.group({
      
      fcReportName: [this.reportCnfg.displayName,[Validators.required, Validators.maxLength(200)]],
      fcReportDesc: [this.reportCnfg.description,[Validators.required, Validators.maxLength(300)]],
      fcReportGrp:  [this.reportCnfg.ieReportGroupID ,[Validators.required]],
      fcReport:     [this.reportCnfg.ieReportID,[Validators.required]],
      fcIsActive: this.reportCnfg.isActive.toString()
      
    });
  }

}


