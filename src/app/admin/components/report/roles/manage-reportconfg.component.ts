import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { STATUS_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import { BaseReportFormComponent } from './base-reportform.component';
import { IEReportConfigurationVM } from 'src/app/shared/models/reports/IEReportConfgV.Model';
import { ReportGroupDataVM } from 'src/app/shared/models/reports/ReportGroupV.Model';


@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-reportconfg.component.html'
})
export class ManageReportComponent extends BaseReportFormComponent implements OnInit {

  // eventGroup = EVENTGROUP_CODE.INSERT;
  reportObj: IEReportConfigurationVM;
  groupDelete: boolean;
  showDetails: boolean = false;
  collapseAll: boolean = false;
  collapseGroup: Array<boolean> = [];
  showDeleteGroup: Array<boolean> = [];
  form: UntypedFormGroup;
  isFromUpdateComponent: boolean = true;
  isNavigated: boolean = false;
  gID: any;
  rID: any;
  dataReport: Array<IEReportConfigurationVM> = [];
  dataGroup: any = [];
  editGroup: boolean = false;
  idToDelete: any;
  showConfirmationFlag: boolean = false;
  confirmationMessage: any;
  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected manageReportService: ManageReportService,
    protected notification: NotificationServiceService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected accountService: AccountService

  ) {
    super(formBuilder, translationPipe, popupController, notification, accountService);

  }


  ngOnInit() {
    

    this.SetRoleSecurity(this.screen, EVENTGROUP_CODE.INSERT);
    this.resetGroupForm(false);
    this.getReportDataLists();
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService.GetAllIEReports().subscribe(response => {
      this.lstReport = response.dataObject;
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    })
  }

  submitReportForm({
    fcReportName,
    fcReportDesc,
    fcReportGrp,
    fcReport,
    fcIsActive
  }) {
    
    if (this.CheckFormValid() === false) {
      this.form.markAllAsTouched();
      this.isNavigated = true;
      return false;
    }
    const cnfgReport: IEReportConfigurationVM = {
      ieReportConfigurationID: this.rID,
      ieReportGroupID: fcReportGrp,
      ieReportID: fcReport,
      displayName: fcReportName,
      description: fcReportDesc,
      groupName: fcReportGrp,
      reportName: fcReport,
      isActive: fcIsActive,
      isDeleted: false
    };
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.manageReportService.updateCnfgReport(cnfgReport).subscribe(response => {
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      if (response.statusCode === STATUS_CODE.SUCCESS) {
        this.showDetails = false;
        this.ProcessSaveSuccessReport(response);
        this.getReportDataLists();
      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
        this.ProcessSaveFail(response);
      }
    });

  }

  submitGroupForm({
    fcGroupName,
    fcGroupDesc,
    fcGroupRprt,
    fcIsActive
  }) {
    
    if (this.CheckFormValid() === false) {
      this.form.markAllAsTouched();
      this.isNavigated = true;
      return false;
    }
    const groupReport: ReportGroupDataVM = {
      ieReportGroupID: this.gID,
      groupName: fcGroupName,
      groupDescription: fcGroupDesc,
      lstReportIDs: fcGroupRprt,
      isActive: fcIsActive,
      isDeleted: false
    };
    if (this.editGroup) {
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      this.manageReportService.UpdateReportGroup(groupReport).subscribe(response => {
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
        if (response.statusCode === STATUS_CODE.SUCCESS) {
          this.showDetails = false;
          this.ProcessSaveSuccessGroup(response);
          this.getReportDataLists();
        }
        if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
          this.ProcessSaveFail(response);
        }
      });
    }
    else {
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      this.manageReportService.AddReportGroup(groupReport).subscribe(response => {
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
        if (response.statusCode === STATUS_CODE.SUCCESS) {
          this.showDetails = false;
          this.ProcessSaveSuccessGroup(response);
          this.getReportDataLists();
        }
        if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
          this.ProcessSaveFail(response);
        }
      });
    }
  }

  getReportDataLists() {
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService
      .LoadManageReportConfgMetaData()
      .subscribe(response => {
        this.dataReport = response.dataObject;
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      });

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService
      .GetAllIEReportGroups()
      .subscribe(response => {
        this.dataGroup = response.dataObject;
        this.lstReportGrp = response.dataObject;
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
        for(let i = 0; i < this.dataGroup.length; i++){
          this.collapseGroup.push(false);
          this.showDeleteGroup.push(false);
        }
      });
    // //MEMO: Role Management
    if (!this.isSaveButtonAllow) {
      this.form.disable();
    }
  }

  updateSelectedListID(ID, dist) {
    this.isSaveButtonAllow = this.screenPermission.isUpdateAllow;
    if (ID == 0) {
      return;
    }
    this.form.markAsUntouched();
    this.isNavigated = false;
    if (dist == 'group') {
      this.showDetails = true;
      this.gID = ID;
      this.rID = -1;
      this.isReportSelected = false;
      this.editGroup = true;
      this.getGroupData(ID);
      this.form.markAsUntouched();
      this.form.markAsPristine();
    }
    else {
      this.showDetails = true;
      this.gID = -1;
      this.rID = ID
      this.isReportSelected = true;
      this.getReportData(ID);
      this.form.markAsUntouched();
      this.form.markAsPristine();
    }
  }

  checkbackgoundcolor(id, dist) {
    if (dist == 'group') {
      if (id == this.gID) {
        return false;
      }
      return true;
    }
    else {
      if (id == this.rID) {
        return false;
      }
      return true;
    }
  }

  getGroupData(ID) {
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService.LoadReportGroupDataById(ID).subscribe(response => {
      this.groupReportData = response.dataObject;
      // this.resetGroupForm();
      this.FillFCGroupFromModel();
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    })
  }

  getReportData(ID) {
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService.LoadCnfgReportById(ID).subscribe(response => {
      this.reportCnfg = response.dataObject;
      this.FillFCReportFromModel();
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    })
  }

  FillFCReportFromModel() {
    // MEMO : Below Validation Required otherwise after edit validation will not work.
    // this.form = this.formBuilder.group({
    //   fcReportName: [this.reportCnfg.displayName, [Validators.required, Validators.maxLength(200)]],
    //   fcReportDesc: [this.reportCnfg.description, [Validators.required, Validators.maxLength(300)]],
    //   fcReportGrp: [this.reportCnfg.ieReportGroupID, [Validators.required]],
    //   fcReport: [this.reportCnfg.ieReportID, [Validators.required]],
    //   fcIsActive: this.reportCnfg.isActive.toString()
    // });

    this.form.reset();
    this.form.markAsUntouched();
    this.form.markAsPristine();
    this.form.get('fcReportName').patchValue(this.reportCnfg.displayName)
    this.form.get('fcReportDesc').patchValue(this.reportCnfg.description);
    this.form.get('fcReportGrp').patchValue(this.reportCnfg.ieReportGroupID);
    this.form.get('fcReport').patchValue(this.reportCnfg.ieReportID);
    this.form.get('fcIsActive').patchValue(this.reportCnfg.isActive.toString());

    this.form.get('fcReportName').setValidators([Validators.required, Validators.maxLength(100)]);
    this.form.get('fcReportDesc').setValidators([Validators.required, Validators.maxLength(200)]);
    this.form.get('fcReportGrp').setValidators([Validators.required]);
    this.form.get('fcReport').setValidators([Validators.required]);
    this.form.get('fcReportGrp').disable();
    this.form.get('fcReport').disable();

    this.form.get('fcGroupName').setValidators(null);
    this.form.get('fcGroupName').setErrors(null);
    this.form.get('fcGroupDesc').setValidators(null);
    this.form.get('fcGroupDesc').setErrors(null);
    this.form.get('fcGroupRprt').setValidators(null);
    this.form.get('fcGroupRprt').setErrors(null);

    
    this.form.markAsTouched();
  }


  FillFCGroupFromModel() {
    // MEMO : Below Validation Required otherwise after edit validation will not work.
    // this.form = this.formBuilder.group({
    //   fcGroupName: [this.groupReportData.groupName, [Validators.required, Validators.maxLength(200)]],
    //   fcGroupDesc: [this.groupReportData.groupDescription, [Validators.required, Validators.maxLength(300)]],
    //   fcGroupRprt: [this.groupReportData.lstReportIDs, [Validators.required]],
    //   fcIsActive: this.groupReportData.isActive.toString()
    // });
    

    this.form.reset();
    this.form.markAsUntouched();
    this.form.markAsPristine();
    this.form.get('fcGroupName').patchValue(this.groupReportData.groupName);
    this.form.get('fcGroupDesc').patchValue(this.groupReportData.groupDescription);
    this.form.get('fcGroupRprt').patchValue(this.groupReportData.lstReportIDs);
    this.form.get('fcIsActive').patchValue(this.groupReportData.isActive.toString());

    this.form.get('fcGroupName').setValidators([Validators.required, Validators.maxLength(100)]);
    this.form.get('fcGroupDesc').setValidators([Validators.required, Validators.maxLength(200)]);
    this.form.get('fcGroupRprt').setValidators([Validators.required]);

    this.form.get('fcReportName').setValidators(null);
    this.form.get('fcReportName').setErrors(null);
    this.form.get('fcReportDesc').setValidators(null);
    this.form.get('fcReportDesc').setErrors(null);
    this.form.get('fcReportGrp').setValidators(null);
    this.form.get('fcReportGrp').setErrors(null);
    this.form.get('fcReport').setValidators(null);
    this.form.get('fcReport').setErrors(null);
    
    this.form.markAsTouched();

    this.selectedgroupRprt = this.groupReportData.lstReportIDs;
  }

  addGroup() {
    this.showDetails = true;
    this.isSaveButtonAllow = true;
    this.isNavigated = false;
    this.gID = -1;
    this.rID = -1;
    this.isReportSelected = false;
    this.editGroup = false;
    this.resetGroupForm();
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }


  deleteGroup(event, id, index) {
    this.showDeleteGroup[index] = false;
    this.translationPipe.getTranslation('Confirm.DeleteReportGroup', '').subscribe(response => {
      this.confirmationMessage = response;
    });
    this.showConfirmationFlag = true;
    this.idToDelete = id;
    this.groupDelete = true;
    event.stopPropagation();
  }

  deleteReport(event, report) {

    this.translationPipe.getTranslation('Confirm.DeleteReport', '').subscribe(response => {
      this.confirmationMessage = response;
    });
    this.showConfirmationFlag = true;
    this.reportObj = {
      ieReportConfigurationID: report.ieReportConfigurationID,
      ieReportGroupID: report.ieReportGroupID,
      ieReportID: report.ieReportID,
      displayName: report.displayName,
      description: report.description,
      groupName: report.groupName,
      reportName: report.reportName,
      isActive: report.isActive,
      isDeleted: false
    }
    this.groupDelete = false;
    event.stopPropagation();
  }

  positiveDelete() {
    if (this.groupDelete) {
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      this.manageReportService.DeleteReportGroup(this.idToDelete).subscribe(response => {
        if (response.statusCode == STATUS_CODE.SUCCESS) {
          this.showDetails = false;
          this.showConfirmationFlag = false;
          this.ShowSuccessNotification(response.message);
          this.form.reset();
          this.form.controls['fcIsActive'].patchValue('true');
          this.form.markAsUntouched();
          this.form.markAsPristine();
          this.getReportDataLists();
        }
        if (response.statusCode == STATUS_CODE.CUSTOM_ERROR) {
          this.ShowErrorNotification(response.message);
        }
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      })
      this.idToDelete = 0;
    }
    else {
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      this.manageReportService.DeleteIEReport(this.reportObj).subscribe(response => {
        if (response.statusCode == STATUS_CODE.SUCCESS) {
          this.showDetails = false;
          this.showConfirmationFlag = false;
          this.ShowSuccessNotification(response.message);
          this.form.reset();
          this.form.controls['fcIsActive'].patchValue('true');
          this.form.markAsUntouched();
          this.form.markAsPristine();
          this.getReportDataLists();
        }
        if (response.statusCode == STATUS_CODE.CUSTOM_ERROR) {
          this.ShowErrorNotification(response.message);
        }
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      })
    }
  }
  expandGroup(index,event){
    this.collapseGroup[index] = !this.collapseGroup[index];
    event.stopPropagation();
  }

  collapseAllItems(){
    this.collapseAll = false;
    for(let i = 0; i < this.collapseGroup.length; i++){
      this.collapseGroup[i] = false;
    }
  }


  expandAllItems(){
    this.collapseAll = true;
    for(let i = 0; i < this.collapseGroup.length; i++){
      this.collapseGroup[i] = true;
    }
  }

}
