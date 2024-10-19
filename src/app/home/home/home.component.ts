import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportCode } from 'src/app/shared/helper/Enums';
import { ReportsGrpAndReportsVModel } from 'src/app/shared/models/reports/ReportGrpAndReportsV.Model';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  lstReportGrpWithReports: Array<ReportsGrpAndReportsVModel> = [];
  userType;
  reportsData
  constructor(
    private manageReportService: ManageReportService, private router: Router,
    protected notificationService: NotificationServiceService) {
    // this.router.navigate(['/home/admin']);
  }

  ngOnInit() {

    this.notificationService.loading = true;
    // this.manageReportService
    //   .getAllReportsOfReportGroups()
    //   .subscribe(response => {
    //     this.lstReportGrpWithReports = response.dataObject;

    //     for (let i = 0; i < this.lstReportGrpWithReports.length; i++) {
    //       let lst = this.lstReportGrpWithReports[i].lstReports;
    //       for (let j = 0; j < lst.length; j++) {
    //         if (lst[j].reportCode == ReportCode.PortfolioReport && lst[j].setHome) {
    //           this.router.navigate(['/home/farm-report/farm-portfolio-report']);
    //           // this.userType = "dataAnalyst";
    //         }
    //       }
    //     }
    //     if (!this.userType) {
    //       this.notificationService.loading = false;
    //       this.router.navigate(['/home/admin']);
    //     }
    //     this.notificationService.loading = false;
    //   });

    this.router.navigate(['/home/project']);

  }

}
