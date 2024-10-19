import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AccountService } from './../common/account.service'
import { Constants } from '../../helper/Constants';
import { SCREEN_CODE, EVENT_CODE, EVENTGROUP_CODE } from '../../helper/Enums';
import { Role } from '../../models/roles/Role.Model';
import { ResponseModel } from '../../models/Response.Model';
import { ResponseVModel } from '../../models/ResponseV.Model';
import { RoleVModel } from '../../models/roles/RoleV.Model';
import { AccessRightVModel } from '../../models/roles/AccessRightV.Model';
@Injectable({
  providedIn: 'root'
})
export class ManageRoleService {

  constructor(private account: AccountService, private http: HttpClient) { }
  baseUrl = Constants.baseUrl;
  adminUrl = Constants.adminBaseURL;
  
  roles: Array<Role> = []
  loadRoleScreenMetaData() {
    var request = {}
    request['sessionId'] = this.account.sessionId;
    request['eventGroup'] = EVENTGROUP_CODE.VIEW;
    return this.http.post<ResponseModel>(this.baseUrl + 'LoadManageRoleScreenMetaData/', request)
  }

  LoadManageRolesMetaData() {

    var request = {}
    request['id'] = 0;

    return this.http.post<ResponseVModel>(this.adminUrl + 'LoadManageRolesMetaData/',request);
  }

  LoadSortedManageRolesMetaData(objSort) {

    var request = {}
    request['id'] = 0;
    request['clmnNme'] = objSort.columnName;
    
    request['isAsc'] = objSort.isAscSort;


    return this.http.post<ResponseVModel>(this.adminUrl + 'LoadManageRolesMetaData/',request);
  }
  

  LoadManageRightsMetaData(id) {

    var request = {}
    request['id'] = +id;

    return this.http.post<ResponseVModel>(this.adminUrl + 'GetAccessRightsDataByRole/',request);
  }


  createRole(role: RoleVModel) {

    return this.http.post<ResponseVModel>(this.adminUrl + 'CreateRole/', role)

  }

  EditRoleRights(listRoleRights: Array<AccessRightVModel>) {

    return this.http.post<ResponseVModel>(this.adminUrl + 'EditRoleRights/', listRoleRights)

  }

  updateRole(role: RoleVModel) {
   
    return this.http.post<ResponseVModel>(this.adminUrl + 'EditRole/', role)
  }

  getScreensByRoleId(roleId: number) {
    var request = {}
    request['roleId'] = roleId;
    request['sessionId'] = this.account.sessionId;
    //request['screenId'] = SCREEN_CODE.ManageRole;
    //request['eventId'] = EVENT_CODE.LoadManageRoleScreenMetaData;
    request['eventGroup'] = EVENTGROUP_CODE.VIEW;

    return this.http.post<ResponseModel>(this.baseUrl + 'GetScreensByRoleId/', request)
  }

  LoadRoleByRoleId(roleId: number) {

    var request = {}
    request['id'] = roleId;
    
    return this.http.post<ResponseVModel>(this.adminUrl + 'GetRoleData/', request)
  }

  
  replaceRole(oldRole: Role, newRole: Role) {
    var index = this.roles.indexOf(oldRole)
    this.roles[index] = newRole
  }
  addRole(newRole: Role) {
    this.roles.push(newRole)

  }
  LoadManageAllUsersByRoleMetaData(id,objSort) {

    var request = {}
    request['id'] = +id;
    request['clmnNme'] = objSort.columnName;
    
    request['isAsc'] = objSort.isAscSort;

    return this.http.post<ResponseVModel>(this.adminUrl + 'GetAllUsersByRole/',request);
  }
  GetAllUsersByReportRole(id,objSort){
    var request = {}
    request['id'] = +id;
    request['clmnNme'] = objSort.columnName;
    
    request['isAsc'] = objSort.isAscSort;

    return this.http.post<ResponseVModel>(this.adminUrl + 'GetAllUsersByReportRole/',request);
  }

  getFilterForUserRoles(param) {
    return this.http.post<ResponseVModel>(this.adminUrl + 'GetFilterForRoles/', param);
  }

  getAllRolesByFilter(param:any){
    return this.http.post<ResponseVModel>(this.adminUrl + 'GetAllRolesByFilters/', param);

  }

 
}
