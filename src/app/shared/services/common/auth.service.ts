import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Constants } from '../../helper/Constants';
import { ResponseModel } from '../../models/Response.Model';
import { AccountService } from './account.service';
import { SessionModel } from '../../models/Session.Model';
import { STATUS_CODE, EVENTGROUP_CODE } from '../../helper/Enums';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AlertType } from '../../models/Alert.Model';
import { Router } from '@angular/router';
import { ResponseVModel } from '../../models/ResponseV.Model';
import { AuthVModel } from '../../models/AuthV.Model';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  adminBaseUrl = Constants.adminBaseURL;
  private authStateChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  getChangedAuthState = this.authStateChanged.asObservable();

  constructor(private http: HttpClient, private httpBackend: HttpBackend, private account: AccountService,
    private notificationService: NotificationServiceService, private router: Router) {
    if (this.getSession()) {

      var session: SessionModel = this.getSession();
      this.account.accessToken = session.accessToken;
      this.account.user = session.user;
      this.account.events = session.events;
      this.account.screens = session.screens;
      this.account.sessionId = session.sessionId;
      this.account.accessRights = session.accessRights;
    }
  }

  authToken: string;
  reditectLoginUrl: string;
  baseUrl = Constants.baseUrl;
  AuthURL = Constants.authBaseURL;

  loginRedirectUrl = "";


  login(auth) {

    return this.http.post<ResponseVModel>(this.AuthURL + 'Login/', auth);

  }
  refreshToken(auth: AuthVModel) {
    return this.http.post<ResponseVModel>(this.AuthURL + 'refreshToken/', auth);
  }


  resetPass(password, rePassword, runningid) {

    var request = {};
    request['code'] = runningid;
    request['codeTag'] = password;

    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'UpdatePassword/', request);

  }

  UpdatePin(password, rePassword, runningid) {

    var request = {};
    request['code'] = runningid;
    request['codeTag'] = password;

    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'UpdatePin/', request);

  }

  checkLinkValidicity(guid) {

    var request = {};
    request['code'] = guid;

    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'VerifyResetPasswordLink/', request);

  }


  VerifyResetPinLink(guid) {

    var request = {};
    request['code'] = guid;

    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'VerifyResetPinLink/', request);
  }

  logout() {
    this.notificationService.loading = true;
    this.deleteSession();
    this.account.clear();
    localStorage.setItem('logged_in', '1');
    this.router.navigate(['/auth/sign-in']);
    this.notificationService.loading = false;
    this.toggleAuthState(true);
  }

  logout_tab() {
    this.notificationService.loading = true;
    this.deleteSession();
    this.account.clear();
    this.router.navigate(['/auth/sign-in']);
    this.notificationService.loading = false;
  }
  offlineLogout() {
    this.deleteSession();
    this.account.clear();
    this.router.navigate(['/auth/sign-in']);
  }
  isLoggedIn() {

    if (this.account.accessToken !== '' && this.account.accessToken != null) {
      return true;
    } else {
      return false;
    }
  }
  SetFakelogins(token){
    if(token && token !=null){
      this.account.accessToken = token;
    }
  }

  createSession() {

    const session: SessionModel = {
      user: this.account.user,
      accessToken: this.account.accessToken, events: this.account.events,
      mapboxAccessKey:this.account.mapboxAccessKey,
      sessionId: this.account.sessionId, screens: this.account.screens, accessRights: this.account.accessRights
    };


    this.account.isLoggedIn.next(true);
    localStorage.setItem('session', JSON.stringify(session));
  }
  getSession() {
    if (JSON.parse(localStorage.getItem('session'))) {
      this.account.isLoggedIn.next(true);
    }
    return JSON.parse(localStorage.getItem('session'));
  }

  deleteSession() {
    localStorage.clear();
    this.account.isLoggedIn.next(false);
  }


  forgotPassword(fcEmail) {

    var request = {};
    request['code'] = fcEmail;

    return this.http.post<ResponseVModel>(this.adminBaseUrl + 'ResetForgotEmail/', request);



  }

  // updateLanguagePreferenceInSession(loacle) {
  //   let session: SessionModel = this.getSession();
  //   session.user.userLanguage = loacle;
  //   localStorage.setItem('session', JSON.stringify(session));
  // }

  updateUserFormatsInSession(user) {

    let session: SessionModel = this.getSession();
    session.user.userLanguage = user.userLanguage;
    session.user.userDateFormat = user.userDateFormat;
    session.user.userTimeZone = user.userTimeZone;
    localStorage.setItem('session', JSON.stringify(session));
  }

  zendeskAuth() {

    var data = JSON.parse(localStorage.getItem("session"));
    if (data) {
      var request = {}
      request['userName'] = data.user.userFirstName;
      request['userEmail'] = data.user.userEmail;
      request['userId'] = data.user.userId;

      return this.http.post<ResponseVModel>(this.baseUrl + 'ZenDesk/ZendeskAuthKey', request);//.toPromise().then(

    }
  }
  setZendeskToken(data) {
    localStorage.setItem('zendeskToken', data.token);
  }

  toggleAuthState(state) {
    this.authStateChanged.next(state);
  }

}
