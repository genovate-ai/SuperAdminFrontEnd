import { Injectable } from '@angular/core';
import { Constants } from '../../helper/Constants';
import { HttpClient } from '@angular/common/http';
import { ResponseVModel } from '../../models/ResponseV.Model';

@Injectable({
  providedIn: 'root'
})
export class ReportModuleService {

  reportDataUrl = Constants.reportsDataBaseURL;
  constructor(private http: HttpClient) { }
  getOPGDashboardReportData() {
    const request = {};
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetOPGDashboardReportData/', request);
  }
  
}
