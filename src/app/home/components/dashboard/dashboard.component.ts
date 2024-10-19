import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/common/auth.service';
import { STATUS_CODE, SCREEN_CODE, API_CALLEVENTGROUP_CODE, ReportCode } from 'src/app/shared/helper/Enums';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { ReportsVModel } from 'src/app/shared/models/reports/Reports.V.Model';
import { viewReportVModel } from 'src/app/shared/models/reports/viewReport.V.Model';
import { ScreenNameService } from 'src/app/shared/services/common/screen-name.service';
// import { LasturlAccessed } from 'src/app/shared/services/common/urlaccessed.service';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import { environment } from 'src/environments/environment';
import { paramVModel } from 'src/app/shared/models/reports/param.V.Model';

@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseFormComponent implements OnInit {
  screen = SCREEN_CODE.HomeScreen;
  reportsData: Array<ReportsVModel> = [];
  viewReports: viewReportVModel = new viewReportVModel;
  showList: boolean = false;
  Home;
  constructor(private account: AccountService,
    private screenNameService: ScreenNameService,
    protected translationPipe: TranslationConfigService,
    protected popupController: PopupControllerService,
    protected notification: NotificationServiceService,
    // protected urlAccessed: LasturlAccessed,
    protected manageReportService: ManageReportService) {
    super(translationPipe, popupController, notification, account);
  }

  ngOnInit() {
    this.translationPipe
    .getTranslation("menu.Home", "")
    .subscribe((response) => {
      this.Home = response;
    });
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService.
    GetDefaultReportsByUser().
    subscribe(response => {
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      this.reportsData = response.dataObject;
      this.showReport(this.reportsData);
    })
  }
  ngDoCheck(){

  }

  showReport(reports: Array<ReportsVModel>) {
    if(reports.length != 0){
    for(let data of reports){
      if(data.setHome){
        this.viewReports.param = new paramVModel;
        this.viewReports.param.isPassed = true;
        this.viewReports.param.reportName = data.reportName;
        this.viewReports.param.reportCode = data.reportCode;
        this.viewReports.param.ieReportConfigurationID = data.ieReportConfigurationID;
        this.viewReports.param.ieReportID = data.ieReportID;
        switch (data.reportCode) {
          case ReportCode.SalmonellaLog:
            this.viewReports.wireframe = false;
            this.viewReports.coccidiaLog = false;
            this.viewReports.slamonellaLog = true;
            this.viewReports.EntericDashboard = false;
            this.viewReports.coccidiaTimeline = false;
            this.viewReports.mpnSlamonellaLog = false;
            this.viewReports.externalCoccidialaLog = false;
            this.viewReports.externalSlamonellaLog = false;
            this.viewReports.ExternalMPNSalmonellaLog = false;
          break;
          case ReportCode.CoccidiaLog:
            this.viewReports.wireframe = false;
            this.viewReports.coccidiaLog = true;
            this.viewReports.slamonellaLog = false;
            this.viewReports.EntericDashboard = false;
            this.viewReports.coccidiaTimeline = false;
            this.viewReports.mpnSlamonellaLog = false;
            this.viewReports.externalCoccidialaLog = false;
            this.viewReports.externalSlamonellaLog = false;
            this.viewReports.ExternalMPNSalmonellaLog = false;
          break;
          case ReportCode.CoccidiaTimeline:
            this.viewReports.wireframe = false;
            this.viewReports.coccidiaLog = false;
            this.viewReports.slamonellaLog = false;
            this.viewReports.coccidiaTimeline = true;
            this.viewReports.EntericDashboard = false;
            this.viewReports.mpnSlamonellaLog = false;
            this.viewReports.externalCoccidialaLog = false;
            this.viewReports.externalSlamonellaLog = false;
            this.viewReports.ExternalMPNSalmonellaLog = false;
          break;
          case ReportCode.MPNSalmonellaLog:
            this.viewReports.wireframe = false;
            this.viewReports.coccidiaLog = false;
            this.viewReports.slamonellaLog = false;
            this.viewReports.EntericDashboard = false;
            this.viewReports.coccidiaTimeline = false;
            this.viewReports.mpnSlamonellaLog = true;
            this.viewReports.externalCoccidialaLog = false;
            this.viewReports.externalSlamonellaLog = false;
            this.viewReports.ExternalMPNSalmonellaLog = false;
          break;
          case ReportCode.ExternalCoccidiaLog:
            this.viewReports.wireframe = false;
            this.viewReports.coccidiaLog = false;
            this.viewReports.slamonellaLog = false;
            this.viewReports.EntericDashboard = false;
            this.viewReports.coccidiaTimeline = false;
            this.viewReports.mpnSlamonellaLog = false;
            this.viewReports.externalCoccidialaLog = true;
            this.viewReports.externalSlamonellaLog = false;
            this.viewReports.ExternalMPNSalmonellaLog = false;
          break;
          case ReportCode.ExternalSalmonellaLog:
            this.viewReports.wireframe = false;
            this.viewReports.coccidiaLog = false;
            this.viewReports.slamonellaLog = false;
            this.viewReports.EntericDashboard = false;
            this.viewReports.coccidiaTimeline = false;
            this.viewReports.mpnSlamonellaLog = false;
            this.viewReports.externalCoccidialaLog = false;
            this.viewReports.externalSlamonellaLog = true;
            this.viewReports.ExternalMPNSalmonellaLog = false;
          break;
          case ReportCode.Wireframe:
            this.viewReports.wireframe = true;
            this.viewReports.coccidiaLog = false;
            this.viewReports.slamonellaLog = false;
            this.viewReports.coccidiaTimeline = false;
            this.viewReports.mpnSlamonellaLog = false;
            this.viewReports.EntericDashboard = false;
            this.viewReports.externalCoccidialaLog = false;
            this.viewReports.externalSlamonellaLog = false;
            this.viewReports.ExternalMPNSalmonellaLog = false;
            case ReportCode.ExternalMPNSalmonellaLog:
              this.viewReports.wireframe = false;
              this.viewReports.coccidiaLog = false;
              this.viewReports.slamonellaLog = false;
              this.viewReports.EntericDashboard = false;
              this.viewReports.coccidiaTimeline = false;
              this.viewReports.mpnSlamonellaLog = false;
              this.viewReports.externalCoccidialaLog = false;
              this.viewReports.externalSlamonellaLog = false;
              this.viewReports.ExternalMPNSalmonellaLog = true;
            break;
            case ReportCode.EntericDashboard:
              this.viewReports.wireframe = false;
              this.viewReports.coccidiaLog = false;
              this.viewReports.slamonellaLog = false;
              this.viewReports.EntericDashboard = true;
              this.viewReports.coccidiaTimeline = false;
              this.viewReports.mpnSlamonellaLog = false;
              this.viewReports.externalCoccidialaLog = false;
              this.viewReports.externalSlamonellaLog = false;
              this.viewReports.ExternalMPNSalmonellaLog = true;
            break;
          default:
            this.viewReports.wireframe = false;
            this.viewReports.coccidiaLog = false;
            this.viewReports.slamonellaLog = false;
            this.viewReports.coccidiaTimeline = false;
            this.viewReports.mpnSlamonellaLog = false;
            this.viewReports.EntericDashboard = false;
            this.viewReports.externalCoccidialaLog = false;
            this.viewReports.externalSlamonellaLog = false;
            this.viewReports.ExternalMPNSalmonellaLog = false;
          break;
        }
      }
  }
  }
  else{
    this.viewReports.param = new paramVModel;
    this.viewReports.param.isPassed = false;
    this.viewReports.param.reportName = null;
    this.viewReports.param.reportCode = null;
    this.viewReports.param.ieReportConfigurationID = null;
    this.viewReports.wireframe = false;
    this.viewReports.coccidiaLog = false;
    this.viewReports.slamonellaLog = false;
    this.viewReports.coccidiaTimeline = false;
    this.viewReports.mpnSlamonellaLog = false;
    this.viewReports.EntericDashboard = false;
    this.viewReports.externalCoccidialaLog = false;
    this.viewReports.externalSlamonellaLog = false;
    this.viewReports.ExternalMPNSalmonellaLog = false;
    this.screenNameService.changeScreenName(this.Home);
  }
}
  saveDafultReport(obj: ReportsVModel){
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService.
    UpdateDefaultReport(obj.ieReportConfigurationID).
    subscribe(response => {
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      if (response.statusCode === STATUS_CODE.SUCCESS) {
        for(let i = 0; i < this.reportsData.length; i++){
          if(this.reportsData[i].ieReportConfigurationID == obj.ieReportConfigurationID){
            this.reportsData[i].setHome = true;
          }
          else{
            this.reportsData[i].setHome = false;
          }
        }
        this.showReport(this.reportsData);
      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
      }
    })
  }
  manageReportList(){
    this.showList = !this.showList;
  }

  getProfileView(){
    return this.account.getProfileStatus();
  }
  ngOnDestroy(){
  }

}
