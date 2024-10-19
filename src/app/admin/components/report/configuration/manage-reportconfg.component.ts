import { Component, OnInit } from '@angular/core';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { CreateReportConfgComponent } from './create-reportconfg.component';
import { UpdateReportConfgComponent } from './update-reportconfg.component';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AccountService } from 'src/app/shared/services/common/account.service';

import {STATUS_CODE,  SCREEN_CODE, API_CALLEVENTGROUP_CODE, ColManageConfgReportEnum } from 'src/app/shared/helper/Enums';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';


@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-reportconfg.component.html'
})
export class ManageReportConfgComponent  extends BaseFormComponent implements OnInit {

  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageReportConfg;
    
  reportColName: string = null;
  reportSort: number = 1;

  showConfirmationFlag: boolean;
  confirmationMessage = '';
  lstReports: Array<any> = [];
  closeSubscription: any;
  constructor(
    private manageReportConfgService: ManageReportService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected notification: NotificationServiceService,
    protected accountService:AccountService

  ) { 

    super(translationPipe, popupController, notification, accountService);
  }

  ngOnInit() {
    this.closeSubscription = this.popupController.close.subscribe((item) => this.updateParentValue(item));

    
    this.screenPermission = this.IsAccessAllowed(this.screen);

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportConfgService
      .LoadManageReportConfgMetaData()
      .subscribe(response => {
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
        this.lstReports = response.dataObject;
        
      });
  }
  GenerateReportList(){
    this.lstReports=[];
    var reportConfg={
      "reportId":"1",
      "reportGrp":"Device",
      "report":"Processing",
      "reportDsplyName":"Processing Time",
      "reportDsc":"Analysis of machine processing time"
    }
    this.lstReports.push(reportConfg);
    var reportConfg1={
      "reportId":"2",
      "reportGrp":"Bacteria",
      "report":"Chlamydiae",
      "reportDsplyName":"Dangerous chlamydiae",
      "reportDsc":"Analysis of dangerous Chlamydiae"
    }
    this.lstReports.push(reportConfg1);
    var reportConfg2={
      "reportId":"3",
      "reportGrp":"Bacteria",
      "report":"Aquificae",
      "reportDsplyName":"Generation of Aquificae",
      "reportDsc":"Analysis of Generation of Aquificae"
    }
    this.lstReports.push(reportConfg2);
    var reportConfg3={
      "reportId":"4",
      "reportGrp":"Chiller",
      "report":"Chiller Report",
      "reportDsplyName":"Chiller No.21",
      "reportDsc":"Detail of Chiller number twenty one usage"
    }
    this.lstReports.push(reportConfg3);
    var reportConfg4={
      "reportId":"5",
      "reportGrp":"Chiller",
      "report":"Chiller Report",
      "reportDsplyName":"Chiller No.46",
      "reportDsc":"Chiller number forty six usage detail"
    }
    this.lstReports.push(reportConfg4);
  }


  editReportConfg(id) {
    this.translationPipe.getTranslation('reportsConfg.updtReportConfg', '').subscribe(response => {
      this.popupController.popupHeader = response;
     });
    this.popupController.updateModalSize('sm');
    this.popupController.parameters = id;
    this.popupController.updateComponent(UpdateReportConfgComponent);
  }

  DeleteReportConfg(id) {
  }

  positiveDelete() {

  }
  createReportConfg() {
    this.translationPipe.getTranslation('reportsConfg.crtReportConfg', '').subscribe(response => {
      this.popupController.popupHeader = response;
     });
    this.popupController.updateModalSize('sm');
    this.popupController.updateComponent(CreateReportConfgComponent);

  }

  updateParentValue(value) {

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportConfgService
    .LoadManageReportConfgMetaData()
    .subscribe(response => {

      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      this.lstReports = response.dataObject;
      
    });

  }

  onPageChange(event) {

  }

  LoadManageCnfgReportsLstData( colName, isAsc, notSorting) {
  
    var objSort = {
      columnName: colName,
      isAscSort: isAsc
    };
  
    this.reportColName = colName;
  
    
    if (this.reportSort !== 2) {
      this.reportSort = 2;
    }
    else {
      this.reportSort = 3;
      objSort.isAscSort = false;
    }
  
    this.lstReports = [];
  
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
      
      this.manageReportConfgService
        .LoadSortedManageReportMetaData( objSort)
        .subscribe(response => {
  
          this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
          
          this.lstReports = response.dataObject;
         
        });
  
    
  }
  
 
 getColManageReportEnum() {
  return ColManageConfgReportEnum;
}

ngOnDestroy() {
  this.closeSubscription.unsubscribe();
}

}
