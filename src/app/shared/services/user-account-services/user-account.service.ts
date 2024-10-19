import { Injectable } from '@angular/core';
import { Constants } from '../../helper/Constants';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../../models/Response.Model';
import { AccountService } from '../common/account.service';
import { SCREEN_CODE, EVENT_CODE } from '../../helper/Enums';
import { ResponseVModel } from '../../models/ResponseV.Model';
import { UserVModel } from '../../models/users/UserV.Model';
import { contactusVModel } from '../../models/contactus/contactusV.Model';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {
  constructor(private http: HttpClient, private account: AccountService) { }
  baseUrl = Constants.baseUrl;
  adminBaseUrl = Constants.adminBaseURL;

  createUser(user: UserVModel) {

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'CreateUser/',
      user
    );
  }


  loadCreateUserScreenMetaData() {

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadRefDataCreateUsers/',
      {
        sessionId: this.account.sessionId,
        eventGroup: 1,
        defaultValue: ['USER_PROFILE_IMG_PATH']
      }
    );

    return postData;
  }

  loadRefDataUsersRoleRights() {

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'LoadRefDataUsersRoleRights/',
      {
        sessionId: this.account.sessionId,
        eventGroup: 1,
        defaultValue: ['USER_PROFILE_IMG_PATH']
      }
    );

    return postData;
  }


  LoadRefDataManageProfile() {

    var postData = this.http.post<ResponseVModel>(this.adminBaseUrl + 'LoadRefDataManageProfile/', {});
    return postData;
  }

  GetManageProfileUserData(userID) {
    var req = {
      id: userID
    }

    var postData = this.http.post<ResponseVModel>(this.adminBaseUrl + 'GetManageProfileUserData/', req);
    return postData;
  }

  GetAllRolesForOrganization(orgid) {
    var request = {
      id: orgid
    }
    var postData = this.http.post<ResponseVModel>(this.adminBaseUrl + 'GetAllRolesForOrganization/', request);
    return postData;
  }

  getAllEulasForOrganization(orgid) {
    var request = {
      id: orgid
    }
    var postData = this.http.post<ResponseVModel>(this.adminBaseUrl + 'GetAllEulasForOrganization/', request);
    return postData;
  }

  loadListOrganizationsData(OrganizationID) {

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetAllSitesByOrganization/',
      OrganizationID
    );

    return postData;
  }


  updateUser(user: UserVModel) {
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'EditUser/', user);
  }
  updateUserRolesAndRights(user: UserVModel) {
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'EditUserRolesAndRights/', user);
  }
  UpdateClientSites(obj) {
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'UpdateClientSites/', obj);
  }
  GetClientSites(id, userId) {
    var req = {};
    req['id'] = id;
    req['code'] = userId;
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'GetClientSites/', req);
  }
  SaveUserProfileData(user: UserVModel) {

    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'SaveUserProfileData/', user);
  }
  LoadManageUserScreenMetaData() {

    var request = {};
    request['pageNo'] = 1;

    var postData = this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetAllOrganTypes/',
      request
    );
    return postData;
  }

  LoadManageUserOrgansLstData(organTypeCode, objSort) {
    var request = {};

    request['id'] = organTypeCode;
    request['clmnNme'] = objSort.columnName;

    request['isAsc'] = objSort.isAscSort;
    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetAllOrganizationsByTypeMO/',
      request
    );
  }

  loadManageUserByOrganType(organTypeId) {
    var request = {};

    request['id'] = organTypeId;

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetAllUsersByOrganizationType/',
      request
    );
  }
  getAllUsersByFilters(param: any) {
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'GetAllUsersByFilters/', param);
  }
  getFilterForUser(param) {
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'GetFilterForUser/', param);
  }

  LoadManageUserUsersLstData(organId, searchQuery, objSort) {

    var request = {};

    request['id'] = organId;
    request['codeTag'] = searchQuery;

    request['clmnNme'] = objSort.columnName;

    request['isAsc'] = objSort.isAscSort;

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetAllUsersByOrganization/',
      request
    );
  }

  loadOrganTypesWithEula(eulaId) {
    const request = {};
    request['id'] = eulaId;

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetAllOrganTypesWithEula/',
      request
    );
  }

  loadOrganizationsWithEulaByOrganTypeData(organTypeCode, objSort, eulaId) {
    var request = {};

    request['id'] = organTypeCode;
    request['code'] = eulaId;
    request['clmnNme'] = objSort.columnName;

    request['isAsc'] = objSort.isAscSort;

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetAllOrganizationWithEulaByOrganType/',
      request
    );
  }


  loadUsersWithEulaByOrganizationData(organId, searchQuery, objSort, eulaId) {

    var request = {};

    request['id'] = organId;
    request['code'] = eulaId;

    request['codeTag'] = searchQuery;

    request['clmnNme'] = objSort.columnName;

    request['isAsc'] = objSort.isAscSort;

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetAllUsersWithEulaByOrganization/',
      request
    );
  }

  LoadUserData(userId) {
    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'GetUserData/',
      {
        id: userId
      }
    );
  }


  ResetPassword(userId) {

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'ResetPassword/',
      {
        id: userId
      }
    );
  }

  ResetPin(userId) {

    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'ResetPin/',
      {
        id: userId
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

  DeleteUser(id) {
    var RequestObject = {};
    RequestObject['id'] = id;
    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + 'DeleteUserData/',
      RequestObject
    );
  }

  SendContactUs(contact) {
    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'SendMail/', contact);
  }

  // Getting count of Search User By Type
  LoadSearchUserByTypeCount(searchQuery: string) {
    var request = {};

    request["codeTag"] = searchQuery;

    return this.http.post<ResponseVModel>(
      this.adminBaseUrl + "GetSearchUserByTypeCount/",
      request
    );
  }


}
