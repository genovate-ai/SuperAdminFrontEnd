import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AccountService } from '../common/account.service'
import { Constants } from '../../helper/Constants';
import { SCREEN_CODE, EVENT_CODE, EVENTGROUP_CODE } from '../../helper/Enums';
import { ResponseVModel } from '../../models/ResponseV.Model';
import { ReportRoleVModel } from '../../models/reports/ReportRoleV.Model';
import { IEReportConfigurationVM } from '../../models/reports/IEReportConfgV.Model';
import { ReportRoleAccessRightVM } from '../../models/reports/ReportRoleAccessRightVM';
import { ReportGroupDataVM } from '../../models/reports/ReportGroupV.Model';
import { AnonymousSubject } from 'rxjs/Rx';

@Injectable({ providedIn: 'root' })
export class ManageReportService {

  constructor(private account: AccountService, private http: HttpClient) { }
  baseUrl = Constants.baseUrl;
  reportUrl = Constants.reportsBaseURL;
  reportDataUrl = Constants.reportsDataBaseURL;

  LoadManageReportConfgMetaData() {
    var request = {}
    request['id'] = 0;
    return this.http.post<ResponseVModel>(this.reportUrl + 'ManagereportConfigurations/', request)
  }
  GetAllIEReportGroups() {
    var request = {}
    return this.http.post<ResponseVModel>(this.reportUrl + 'GetAllIEReportGroups/', request)
  }
  GetAllIEReports() {
    var request = {}
    return this.http.post<ResponseVModel>(this.reportUrl + 'GetAllIEReports/', request)
  }
  ConfigureReport(cnfgReport: IEReportConfigurationVM) {
    return this.http.post<ResponseVModel>(this.reportUrl + 'ConfigureReport/', cnfgReport)
  }
  LoadSortedManageReportMetaData(objSort) {
    var request = {}
    request['id'] = 0;
    request['clmnNme'] = objSort.columnName;
    request['isAsc'] = objSort.isAscSort;

    return this.http.post<ResponseVModel>(this.reportUrl + 'ManagereportConfigurations/', request);
  }
  LoadCnfgReportById(cnfgReportId: number) {

    var request = {}
    request['id'] = cnfgReportId;

    return this.http.post<ResponseVModel>(this.reportUrl + 'GetConfigureReportData/', request)
  }

  updateCnfgReport(cnfgReport: IEReportConfigurationVM) {

    return this.http.post<ResponseVModel>(this.reportUrl + 'EditCnfgReport/', cnfgReport)
  }
  // ReportRole services
  LoadManageReportRolesMetaData() {

    var request = {}
    request['id'] = 0;

    return this.http.post<ResponseVModel>(this.reportUrl + 'LoadManageReportRolesMetaData/', request);
  }

  LoadSortedManageReportRolesMetaData(objSort) {

    var request = {}
    request['id'] = 0;
    request['clmnNme'] = objSort.columnName;

    request['isAsc'] = objSort.isAscSort;


    return this.http.post<ResponseVModel>(this.reportUrl + 'LoadManageReportRolesMetaData/', request);
  }

  loadManageReportRolesByFilters(request) {
    return this.http.post<ResponseVModel>(this.reportUrl + 'LoadManageReportRolesByFilters/', request);
  }

  getFilterForReportRole(param) {
    return this.http.post<ResponseVModel>(this.reportUrl + 'GetFilterForReportRole/', param);
  }

  LoadReportRoleByRoleId(roleId: number) {

    var request = {}
    request['id'] = roleId;

    return this.http.post<ResponseVModel>(this.reportUrl + 'GetReportRoleData/', request)
  }

  updateReportRole(role: ReportRoleVModel) {

    return this.http.post<ResponseVModel>(this.reportUrl + 'EditReportRole/', role)
  }

  createReportRole(role: ReportRoleVModel) {

    return this.http.post<ResponseVModel>(this.reportUrl + 'CreateReportRole/', role)

  }

  LoadManageReportRoleAccessRight(roleId: string) {

    var request = {}
    request['id'] = roleId;
    return this.http.post<ResponseVModel>(this.reportUrl + 'LoadManageReportRoleAccessRight/', request)
  }

  SaveReportRoleAccessRights(obj: ReportRoleAccessRightVM) {

    return this.http.post<ResponseVModel>(this.reportUrl + 'SaveReportRoleAccessRights/', obj)
  }
  // ReportRole services

  LoadReportGroupDataById(groupID: number) {

    var request = {}
    request['id'] = groupID;

    return this.http.post<ResponseVModel>(this.reportUrl + 'GetReportGroupByID/', request)
  }

  UpdateReportGroup(reportGroup: ReportGroupDataVM) {

    return this.http.post<ResponseVModel>(this.reportUrl + 'EditReportGroup/', reportGroup)
  }

  DeleteReportGroup(reportGroupid) {

    var request = {}
    request['id'] = reportGroupid;

    return this.http.post<ResponseVModel>(this.reportUrl + 'DeleteReportGroup/', request)
  }

  DeleteIEReport(reportGroup: IEReportConfigurationVM) {

    return this.http.post<ResponseVModel>(this.reportUrl + 'DeleteIEReport/', reportGroup)
  }

  AddReportGroup(reportGroup: ReportGroupDataVM) {

    return this.http.post<ResponseVModel>(this.reportUrl + 'AddReportGroup/', reportGroup)
  }

  getAllReportsOfReportGroups() {
    const request = {};
    return this.http.post<ResponseVModel>(this.reportUrl + 'GetAllReportsOfReportGroups/', request);
  }

  GetDefaultReportsByUser() {
    const request = {};
    return this.http.post<ResponseVModel>(this.reportUrl + 'GetDefaultReportsByUser/', request);
  }

  UpdateDefaultReport(reportID) {
    const request = { id: reportID };
    return this.http.post<ResponseVModel>(this.reportUrl + 'UpdateDefaultReport/', request);
  }

  // Report Data related API's #Start
  getReportLastMonthData() {
    const request = {};
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetReportLastMonthData/', request);
  }

  getReportDateByDays(tag: string) {

    const request = {
      codeTag: tag
    };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetReportDataByDays/', request);
  }

  getPiperLogReportData(reportID) {
    const request = {
      id: reportID
    };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetReportLastMonthData/', request);
  }
  getSalmonellaLogReportData(requestObjectParam: any) {
    // const request = {
    //   id : reportID
    // };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetSalmonellaReportData/', requestObjectParam);
  }
  getSalmonellaLogReportDataByFilters(requestObjectParam: any) {
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetSalmonellaReportDataByFilters/', requestObjectParam);
  }

  getSalmonellaLogReportFilters(reportID) {
    const request = {
      id: reportID
    };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetSalmonellaReportFilters/', request);
  }
  getExternalSalmonellaLogReportData(requestObjectParam: any) {
    // const request = {
    //   id : reportID
    // };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetExternalSalmonellaReportData/', requestObjectParam);
  }

  getExternalSalmonellaLogReportFilters(reportID) {
    const request = {
      id: reportID
    };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetExternalSalmonellaReportFilters/', request);
  }
  getPiperLogReportDataExternal(reportID) {
    const request = {
      id: reportID
    };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetReportLastMonthDataExternal/', request);
  }

  getCoccidiaLogReportData(requestObjectParam: any) {
    // const request = {
    //   id : reportID,
    //   pageNo:pageNumber,
    //   rowNo:rowNumber
    // };

    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetCoccidiaLogReportData/', requestObjectParam);
  }

  getCoccidiaLogReportDataByFilters(requestObjectParam: any) {
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetCoccidiaLogReportDataByFilters/', requestObjectParam);
  }

  getSitesLogDataByFilters(requestObjectParam: any) {
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetSitesLogDataByFilters/', requestObjectParam);
  }
  getFlockRegistrationDataByFilters(requestObjectParam: any) {
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetFlockRegistrationDataByFilters/', requestObjectParam);
  }

  getCoccidiaLogReportDataFilterWise(reportID, pageNumber, rowNumber, filters) {

    const request = {
      id: reportID,
      pageNo: pageNumber,
      rowNo: rowNumber,
      where: filters
    };

    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetCoccidiaLogReportData/', request);
  }

  getCoccidiaLogReportFilters(reportID) {
    const request = {
      id: reportID
    };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetCoccidiaLogReportFilters/', request);
  }

  getExternalCoccidiaLogReportData(requestObjectParam: any) {
    // const request = {
    //   id : reportID
    // };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetExternalCoccidiaLogReportData/', requestObjectParam);
  }

  getExternalCoccidiaLogReportFilters(reportID) {
    const request = {
      id: reportID
    };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetExternalCoccidiaLogReportFilters/', request);
  }

  GetSitePerformanceData(reportID, siteID) {
    const request = {
      reportID: reportID,
      siteId: siteID
    };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetSitePerformanceData/', request);
  }

  GetSiteOPGCalDayDetail(reportID, siteID) {
    const request = {
      reportID: reportID,
      siteId: siteID
    };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetSiteOPGCalDayDetail/', request);
  }

  GetWeatherTwoMonthsData(reportID, siteID) {
    const request = {
      reportID: reportID,
      siteId: siteID
    };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetWeatherTwoMonthsData/', request);
  }

  getMPNLogReportData(requestObjectParam: any) {
    // const request = {
    //   id : reportID
    // };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetMPNLogReportData/', requestObjectParam);
  }
  getMPNLogReportFilters(reportID) {
    const request = {
      id: reportID
    };

    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetMPNLogReportFilters/', request);
  }
  getMPNLogReportDetailData(request) {

    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetMPNLogReportDetailData/', request);
  }

  getWireframeReportData(reportID, siteID = '-1') {
    const request = {
      id: reportID,
      code: siteID
    };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetWireframeReportData/', request);
  }

  // Report Data related API's #End
  GetFiltersPersist(confgID, subReportId = 0) {
    const request = { id: confgID, code: subReportId };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetFiltersPersist/', request);
  }

  getLockedFilters(confgID, subReportId = 0) {
    const request = { id: confgID, code: subReportId };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetLockedFilters/', request);
  }

  UpdateFiltersPersist(request) {
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'UpdateFiltersPersist/', request);
  }

  saveFilterstoDB(confgID) {
    const request = { id: confgID };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'saveFilterstoDB/', request);
  }

  saveLockedFilterstoDB(lockObject) {
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'SaveLockedFilters/', lockObject);
  }

  saveLockedFiltersAdmin(lockObject) {
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'SaveLockedFiltersAdmin/', lockObject);
  }

  removeLockedFilterstoDB(confgID, isFromWeb) {
    const request = { id: confgID, boolParam: isFromWeb };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'removeFiltersfromDB/', request);
  }
  removeAdminFiltersfromDB(ieScreenID) {
    const request = { id: ieScreenID };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'removeAdminFiltersfromDB/', request);
  }

  removeFiltersfromDB(confgID) {
    const request = { id: confgID };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'removeFiltersfromDB/', request);
  }
  isReportConfgUserActive(confgID, subReportId = 0) {
    const request = { id: confgID, code: subReportId };
    // return this.http.post<ResponseVModel>(this.reportDataUrl + 'isReportConfgUserActive/', request);
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'isReportConfgUserActive/', request);
  }
  reportConfiguration(confgID, subReportId = 0, fromNewDataLog) {
    const request = { id: confgID, code: subReportId, boolParam: fromNewDataLog };
    // return this.http.post<ResponseVModel>(this.reportDataUrl + 'isReportConfgUserActive/', request);
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'reportConfiguration/', request);
  }
  getLockedFiltersAdmin(ieScreenID, boolParam = false) {
    const request = { id: ieScreenID, boolParam };
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetLockedFiltersAdmin/', request);
  }
  GetDummyTestReportData() {
    const request = {};
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetDummyTestReportData/', request);
  }
  GetOPGDashboardReportData() {
    const request = {};
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetOPGDashboardReportData/', request);
  }

  getTableauReportData(reportCode) {
    const request = {
      clmnNme: reportCode
    };

    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetTableauReportData/', request);
  }

  // loadReportTypeList() {
  //   const request = {};
  //   return this.http.post<ResponseVModel>(this.reportUrl + 'GetReporttypes/', request);
  // }

  getReportFields(obj) {

    const request = obj;
    return this.http.post<ResponseVModel>(this.reportUrl + 'GetFieldName/', request);
  }

  getReportFieldsOfUser(reportId) {
    const request = {
      id: reportId
    };
    return this.http.post<ResponseVModel>(this.reportUrl + 'GetFieldReportAccessUser/', request);
  }
  getFieldReportAccessAdminUser(screenId, boolParam = false) {
    const request = {
      id: screenId,
      boolParam: boolParam
    };
    return this.http.post<ResponseVModel>(this.reportUrl + 'GetFieldReportAccessAdminUser/', request);
  }


  saveReportFieldsOfUser(lstReportFields) {
    const request = lstReportFields;
    return this.http.post<ResponseVModel>(this.reportUrl + 'SaveFieldReportAccessUser/', request);
  }
  saveReportFieldsOfAdminUser(lstReportFields) {
    const request = lstReportFields;
    return this.http.post<ResponseVModel>(this.reportUrl + 'SaveFieldReportAccessAdminUser/', request);
  }

  getCoccidiaLogReportDataAuditData(configID, runID) {

    const request = {
      ieReportType: configID,
      runId: runID
    }
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetCoccidiaLogReportDataAuditData/', request);
  }
  getSitesLogAuditData(configID, siteId) {

    const request = {
      ieReportType: configID,
      siteId: siteId
    }
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetSitesLogAuditData/', request);
  }
  getFlockRegistrationAuditData(param) {
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetFlockRegistrationAuditData/', param);
  }

  getSalmonellaLogDataAudit(request) {


    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetSalmonellaLogAuditData/', request);
  }
  getExternalSalmonellaLogDataAudit(request) {


    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetExternalSalmonellaLogAuditData/', request);
  }

  getCoccidiaAuditCSV(configID, lstRunIds) {

    const request = {
      ieReportType: configID,
      runIDs: lstRunIds,
      CSV: true
    }
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetCoccidiaLogReportDataAuditData/', request);
  }
  getSitesLogAuditCSV(configID, siteIds) {

    const request = {
      ieReportType: configID,
      siteIds: siteIds,
      CSV: true
    }
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetSitesLogAuditData/', request);
  }
  getExternalCoccidiaLogReportDataAuditData(configID, runID) {
    const request = {
      ieReportType: configID,
      runId: runID
    }
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetExternalCoccidiaLogReportDataAuditData/', request);
  }
  getExternalCoccidiaAuditCSV(configID, lstRunIds) {

    const request = {
      ieReportType: configID,
      runIDs: lstRunIds,
      CSV: true
    }
    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetExternalCoccidiaLogReportDataAuditData/', request);
  }

  getFilterForReport(param) {

    // const requestParam = {
    //   code: filterName,
    //   boolParam: viewAll,
    //   id: configID,
    //   secondaryId: reportTypeId
    // }

    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetFilterForReport/', param);
  }
  getFilterForFlockReg(param) {

    // const requestParam = {
    //   code: filterName,
    //   boolParam: viewAll,
    //   id: configID,
    //   secondaryId: reportTypeId
    // }

    return this.http.post<ResponseVModel>(this.reportDataUrl + 'GetFilterForFlockReg/', param);
  }

}
