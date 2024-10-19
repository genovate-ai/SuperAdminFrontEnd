import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AccountService } from '../common/account.service'
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
export class ManageUserLicenseService {

  constructor(private account: AccountService, private http: HttpClient) { }
  baseUrl = Constants.baseUrl;
  adminUrl = Constants.adminBaseURL;

  roles: Array<Role> = []

  UploadEULA(formData) {
    return this.http.post<ResponseVModel>(this.adminUrl + 'UploadEULA/', formData, {reportProgress: true, observe: 'events'});
  }


  LoadManageEULAsMetaData() {
    let request = {};
    return this.http.post<ResponseVModel>(this.adminUrl + 'LoadManageEULAsMetaData/', request);
  }
  LoadRefDataManageEULA() {
    let request = {};
    return this.http.post<ResponseVModel>(this.adminUrl + 'LoadRefDataManageEULA/', request);
  }

  UpdateEULA(eula) {
    return this.http.post<ResponseVModel>(this.adminUrl + 'EditEULA/', eula);
  }

  deleteEULA(id) {
    let requestObject = {};
    requestObject['id'] = id;

    return this.http.post<ResponseVModel>(this.adminUrl + 'DeleteEULA/', requestObject);
  }

  activeDeactiveEULA(eula) {
    return this.http.post<ResponseVModel>(this.adminUrl + 'activeDeactiveEULA/', eula);
  }

  getAllEulaForSignin(id) {
    const request = {
      id
    };
    return this.http.post<ResponseVModel>(this.adminUrl + 'GetAllEulaForSignin/', request);
  }
  getAllUserEulaLog(id) {
    const request = {
      id
    };
    return this.http.post<ResponseVModel>(this.adminUrl + 'GetAllUserEulaLog/', request);
  }

  markAcceptEula(userId, eulaId) {
    const request = {
      id: userId,
      code: eulaId,
      codeTag: new Date()
    };
    return this.http.post<ResponseVModel>(this.adminUrl + 'MarkAcceptEula/', request);
  }

  markRejectEula(userId, eulaId) {
    const request = {
      id: userId,
      code: eulaId,
      codeTag: new Date()
    };
    return this.http.post<ResponseVModel>(this.adminUrl + 'MarkRejectEula/', request);
  }

  saveOrgnTypeWiseUserEulaConfigToDB(lstOrganTypeWiseConfigToSaveInDB) {
    return this.http.post<ResponseVModel>(
      this.adminUrl + 'SaveBulkUserEulaConfigToDBByOrgnType/',
      lstOrganTypeWiseConfigToSaveInDB
    );
  }
  saveOrgnWiseUserEulaConfigToDB(lstOrgnEulaConfigToSaveInDB) {
    return this.http.post<ResponseVModel>(
      this.adminUrl + 'SaveBulkUserEulaConfigToDBByOrgn/',
      lstOrgnEulaConfigToSaveInDB
    );
  }

  saveUserEulaConfigToDB(lstUserEulaConfigToSaveInDB) {
    return this.http.post<ResponseVModel>(
      this.adminUrl + 'SaveBulkUserEulaConfigToDBByUser/',
      lstUserEulaConfigToSaveInDB
    );
  }

}
