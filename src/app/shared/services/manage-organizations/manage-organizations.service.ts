import { Injectable } from '@angular/core';
import { Constants } from '../../helper/Constants';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../../models/Response.Model';
import { UserModel } from '../../models/users/User.Model';
import { UserVModel } from '../../models/users/UserV.Model';
import { AccountService } from '../common/account.service';
import { SCREEN_CODE, EVENT_CODE, EVENTGROUP_CODE } from '../../helper/Enums';
import { Role } from '../../models/roles/Role.Model';
import { ResponseVModel } from '../../models/ResponseV.Model';
import { RequestVModel } from '../../models/RequestV.Model.ts';
import { OrganizationVModel } from '../../models/organization/OrganizationV.Model';

@Injectable({
  providedIn: 'root'
})
export class ManageOrganizationsService {
  constructor(private http: HttpClient, private account: AccountService) { }
  baseUrl = Constants.baseUrl;
  adminBaseUrl = Constants.adminBaseURL;

  createOrganization(organ: OrganizationVModel) {

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'CreateOrganization/',
      organ
    );
  }

  loadTestSiteAssociationMetaData() {
    var postData = this.http.post<ResponseVModel>(this.adminBaseUrl + 'LoadRefDataSiteAssociation/', {});
    return postData;
  }

  UpdateTestSites(obj) {
    var postData = this.http.post<ResponseVModel>(this.adminBaseUrl + 'UpdateTestSites/', obj);
    return postData;
  }

  loadCreateOrganizationScreenMetaData() {

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadRefDataManageOrganization/',
      {
        sessionId: this.account.sessionId,
      }
    );

    return postData;
  }
  updateOrganization(user: OrganizationVModel) {
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'EditOrganization/', user);
  }

  LoadManageUserScreenMetaData(userOrgnTypeID) {
    var request = {};
    request['pageNo'] = 1;
    request['id'] = userOrgnTypeID;

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetAllOrganizationTypesMO/',
      request
    );
    return postData;
  }


  LoadEditSiteData(id) {
    var request = {};
    request['id'] = id;

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadEditSiteData/',
      request
    );

    return postData;
  }


  LoadCreateSiteStatesData(id) {
    var request = {};
    request['id'] = id;

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadCreateSiteStatesData/',
      request
    );

    return postData;
  }
  getCountryID(code) {

    var request = {};
    request['code'] = code;

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'getCountryID/',
      request
    );

    return postData;
  }
  getStateID(code) {

    var request = {};
    request['code'] = code;

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'getStateID/',
      request
    );

    return postData;
  }
  getCityID(code) {
    var request = {};
    request['code'] = code;

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'getCityID/',
      request
    );

    return postData;
  }

  LoadCreateSiteCityData(id) {
    var request = {};
    request['id'] = id;

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadCreateSiteCityData/',
      request
    );

    return postData;
  }

  LoadSiteTreeMetaData(id) {
    var request = {};
    request['id'] = id;
    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadSiteTreeRefData/',
      request
    );
    return postData;
  }
  LoadSiteTreeRefDataBulkInsertion(id, code) {
    var request = {};
    request['id'] = id;
    request['code'] = code;
    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadSiteTreeRefDataBulkInsertion/',
      request
    );
    return postData;
  }

  LoadAllCollectionSite(id) {
    var request = {};
    request['id'] = id;
    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadAllCollectionSite/',
      request
    );
    return postData;
  }

  LoadAllSitesRefDataByOrgn(id) {
    var request = {};
    request['id'] = id;
    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadAllSitesRefDataByOrgn/',
      request
    );
    return postData;
  }

  LoadAllSiteTreeRefDataTestingSites() {
    var request = {};
    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadAllSiteTreeRefDataTestingSites/',
      request
    );
    return postData;
  }

  LoadAllSystemSitesRefData(id = 0) {
    var request = {};
    request['id'] = id;
    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadAllSystemSitesRefData/',
      request
    );
    return postData;
  }

  LoadSiteTreeRefDataTestingSites(id) {
    var request = {};
    request['id'] = id;
    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadSiteTreeRefDataTestingSites/',
      request
    );
    return postData;
  }
  LoadSiteTreeRefDataByAssignedOrgn(id) {
    var request = {};
    request['id'] = id;
    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadSiteTreeRefDataByAssignedOrgn/',
      request
    );
    return postData;
  }

  RefreshPiperList() {

    var request = {};
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'RefreshPiperList/', request);
  }
  LoadCreateSiteMetaData() {
    var request = {};
    //request['id'] = 0;

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadCreateSiteRefData/',
      request
    );

    return postData;
  }

  LoadManageUserOrgansLstDataSearch(organId, searchQuery, objSort) {
    var request = {};

    request["id"] = organId;
    request["codeTag"] = searchQuery;

    request["clmnNme"] = objSort.columnName;

    request["isAsc"] = objSort.isAscSort;

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + "GetAllOrganizationsByTypeMO/",
      request
    );
  }

  getAllOrgnsByFilters(param: any) {
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'GetAllOrganizationsByFilters/', param);
  }
  getAllOrganizations() {
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'GetAllOrganizationsData/', {});
  }
  getFilterForOrgn(param) {
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'GetFilterForOrganization/', param);
  }

  // Search Query Call #End
  // Getting count of Search Organization By Type

  LoadSearchOrganizationByTypeCount(searchQuery: string) {
    var request = {};

    request["codeTag"] = searchQuery;

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + "GetSearchOrganizationByTypeCount/",
      request
    );
  }


  LoadManageUserUsersLstData(organId) {

    var request = {};

    request['id'] = organId;

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetAllUsersByOrganization/',
      request
    );
  }



  LoadOrganizationData(organId) {
    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetOrganizationData/',
      {
        id: organId
      }
    );
  }


  getUserByPageNo(pageNo) {
    var request = {};
    request['sessionId'] = this.account.sessionId;
    request['eventGroup'] = 1;
    request['screenId'] = SCREEN_CODE.ManageUser;
    request['pageNo'] = pageNo;
    request['isPageLoad'] = 0;
    request['searchText'] = '';
    return this.http.post<ResponseModel>(
      this.baseUrl + 'LoadManageUserScreenMetaData/',
      request
    );
  }

  DeleteOrganization(id) {
    var RequestObject = {};
    RequestObject['id'] = id;

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'DeleteOrganData/',
      RequestObject
    );
  }

  DeleteSite(id) {
    var RequestObject = {};
    RequestObject['id'] = id;


    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'DeleteSiteData/',
      RequestObject
    );
  }
  RemoveChildSites(id) {
    var RequestObject = {};
    RequestObject['id'] = id;


    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'RemoveChildSites/',
      RequestObject
    );
  }
  UpdateParentSiteOfSite(siteId, parentSiteId) {

    const request = {};

    request['id'] = siteId;
    request['code'] = parentSiteId;
    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'UpdateParentSiteOfSite/',
      request
    );
  }

  loadAllCollectionSites(getuniqueid = false) {
    const request = {};
    request['boolParam'] = getuniqueid;
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'Loadcollectionsite/', request);
  }

  LoadCollectionSiteWithDataSecurity(req) {
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'LoadCollectionSiteWithDataSecurity/', req);
  }

  LoadCollectionSitesPoultry() {
    const request = {};
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'LoadCollectionSitesPoultry/', request);
  }
}
