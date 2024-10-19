import { Injectable } from '@angular/core';
import { EventModel } from './../../models/Event.Model'
import { ScreenModel } from './../../models/Screen.Model'
import { BehaviorSubject } from 'rxjs/Rx';
import { UserVModel } from '../../models/users/UserV.Model';
import { AccessRightVModel } from '../../models/roles/AccessRightV.Model';
import { ScreenVPermission } from '../../models/ScreenPermissionV.Model';
import { ReportsVModel } from '../../models/reports/Reports.V.Model';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }
  isProfileActive = false; 
  isWeatherActive = false;
  user: UserVModel;
  accessRights: Array<ScreenVPermission>;
  sessionId: string;
  accessToken: string;
  mapboxAccessKey:string;
  events: Array<EventModel>;
  screens: Array<ScreenModel>;
  menulocked: boolean = false;
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)


  clear() {

    this.accessRights = null;
    this.user = null;
    this.sessionId = null;
    this.accessToken = null;
    this.events = null;
    this.screens = null;
    this.menulocked = false;
  }
  getProfileStatus(){
    return this.isProfileActive;
  }
  setProfileStatus(){
    this.isProfileActive = true;
  }
  unsetProfileStatus(){
    return this.isProfileActive = false;
  }
  getWeatherReport(){
    return this.isWeatherActive;
  }
  setWeatherReport(){
    this.isWeatherActive = !this.isWeatherActive;
  }

  updateUserProfileFormats(user) {
     
    this.user.userLanguage= user.userLanguage;
    this.user.userTimeZone= user.userTimeZone;
    this.user.userDateFormat= user.userDateFormat;
  }
}


