import { MessagesCodes } from 'src/app/shared/helper/Enums';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse, HttpXsrfTokenExtractor
} from '@angular/common/http';
import { NotificationServiceService } from './notification.service'
import { Observable, throwError, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/Rx';
import { retry, catchError, map, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AlertType, HeaderType } from '../../models/Alert.Model';
import { STATUS_CODE, EVENTGROUP_CODE, ErrorMessages } from '../../helper/Enums';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { ResponseVModel } from '../../models/ResponseV.Model';
import { AuthVModel } from '../../models/AuthV.Model';
import { Router } from '@angular/router';
import { SessionModel } from '../../models/Session.Model';
import { TranslationConfigService } from './translation-config.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private notification: NotificationServiceService, private xsrf: HttpXsrfTokenExtractor, private account: AccountService, private auth: AuthService,private router: Router,protected translationPipe: TranslationConfigService) {
  }
  token = ""
  crfToken = ""
  private refreshTokenInProgress = false;
  authModel : AuthVModel = {

    EmailId: '',
    Password: '',
    token:  this.token,
    systemIp: ''

  };
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //start intercepting
    if (this.account.accessToken != '' && this.account.accessToken != null) {
      this.token = this.account.accessToken;
    }
    return next.handle(request.clone({
      headers: request.headers.append('Authorization', 'Bearer ' + this.token)
    }))
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
            this.notification.loading = false; //if loading notification is on
            this.notification.showNotification({ type: AlertType.DANGER, message: error.error.message, header: HeaderType.ERROR })
          } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            this.notification.loading = false;
            if (error.status == 403) {
              this.notification.showNotification({ type: AlertType.DANGER, message: ErrorMessages.AUTHORIZATION, header: HeaderType.ERROR })

              this.auth.offlineLogout()
            }
            else if (error.status == 401)
            {
              return this.handleUnauthorized(request, next);
            }
             else {
              var _msg = "Please contact Administrator";
              this.translationPipe
              .getTranslation("errormessage.exception", "")
              .subscribe((response) => {​​​​​​​
                _msg = response;
              }​​​​​​​);
              _msg  =_msg.replace("####",STATUS_CODE.CONTROLLER_EXCEPTION);
              this.notification.showNotification({ type: AlertType.DANGER, message:_msg, header: HeaderType.ERROR })

            }
          }


          return throwError(errorMessage);
        }), map(event => {

          if (event instanceof HttpResponse) {

            if (event.status != 200) {
              this.notification.showNotification({ type: AlertType.DANGER, message: event.body, header: HeaderType.ERROR })
            } else {
              if (typeof event.body.statusCode  !== 'undefined' && (event.body.statusCode == STATUS_CODE.EXCEPTION ||
                event.body.statusCode == STATUS_CODE.SQL_EXCEPTION || event.body.statusCode == STATUS_CODE.DIAPER_EXCEPTION
                || event.body.statusCode == STATUS_CODE.DIVIDE_BY_ZERO_EXCEPTION || event.body.statusCode == STATUS_CODE.OVERFLOW
                || event.body.statusCode ==STATUS_CODE.ARITHMATIC_EXCEPTION || event.body.statusCode ==STATUS_CODE.INDEX_OUT_OF_RANGE_EXCEPTION
                || event.body.statusCode == STATUS_CODE.ARRAY_TYPE_MISMATCH_EXCEPTION || event.body.statusCode == STATUS_CODE.INVALID_CAST_EXCEPTION
                || event.body.statusCode == STATUS_CODE.NULL_REFERENCE_EXCEPTION || event.body.statusCode == STATUS_CODE.OUT_OF_MEMORY_EXCEPTION
                || event.body.statusCode ==STATUS_CODE.TIMEOUT_EXCEPTION || event.body.statusCode ==STATUS_CODE.ARGUMENT_OUT_OF_EXCEPTION)
                || event.body.statusCode == STATUS_CODE.TIMEOUT_SQL_EXCEPTION) {
                  var _msg = "Please contact Administrator";
                  this.translationPipe
                  .getTranslation("errormessage.exception", "")
                  .subscribe((response) => {​​​​​​​
                    _msg = response;
                  }​​​​​​​);
                  _msg  =_msg.replace("####",event.body.statusCode);
                  this.notification.showNotification({ type: AlertType.DANGER, message:_msg, header: HeaderType.ERROR })
                this.notification.loading = false;
                throw new Error(event.body.displayMessageCode);
              }
              else if (event.body.statusCode == STATUS_CODE.SUCCESS) {
                var _msg = "";
                this.translationPipe
                .getTranslation("messageCode."+event.body.messageCode, "")
                .subscribe((response) => {​​​​​​​
                  _msg = response;
                }​​​​​​​);
                if(event.body.fileName != null){
                   _msg =  _msg.replace("####",event.body.fileName); // code for sampleMetaFile upload
                }
                event.body.message = _msg;
                if(request.body == null){

                }else{
                  if (request.body.eventGroup != EVENTGROUP_CODE.VIEW && request.body.eventGroup != EVENTGROUP_CODE.LOGIN && request.body.eventGroup != EVENTGROUP_CODE.LOGOUT) {

                    //this.notification.showNotification({ type: AlertType.SUCCESS, message: ErrorMessages.SUCCESSMESSAGE, header: HeaderType.SUCCESS })
                  } else if (request.body.eventGroup == EVENTGROUP_CODE.LOGIN) {
                    this.notification.showNotification({ type: AlertType.SUCCESS, message: ErrorMessages.LOGIN, header: HeaderType.SUCCESS })
                  } else if (request.body.eventGroup == EVENTGROUP_CODE.LOGOUT) {
                    this.notification.showNotification({ type: AlertType.SUCCESS, message: ErrorMessages.LOGOUT, header: HeaderType.SUCCESS })
                  }
                }

              }
              else if (event.body.statusCode == STATUS_CODE.ALREADY_LOGOUT_ERROR || event.body.statusCode == STATUS_CODE.EXCEPTION || event.body.statusCode == STATUS_CODE.INVALID_CODE || event.body.statusCode == STATUS_CODE.INVALID_SESSION || event.body.statusCode == STATUS_CODE.INVALID_USER) {
                this.notification.showNotification({ type: AlertType.DANGER, message: event.body.displayMessageCode, header: HeaderType.ERROR })
                this.notification.loading = false;
                throw new Error(event.body.displayMessageCode);
              }
            }
          }
          return event
        })
      )
  }


  private addAuthenticationToken(request: HttpRequest<any>,model: ResponseVModel): HttpRequest<any> {
    this.token=model.dataObject.token;
    this.account.accessToken = model.dataObject.token;
    this.createSession();
    return request.clone({
      headers: request.headers.append('Authorization', 'Bearer ' + model.dataObject.token)
    });
  }
  handleUnauthorized (req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.authModel.token=this.token;
        if (!this.refreshTokenInProgress) {
            this.refreshTokenInProgress = true;

            this.refreshTokenSubject.next(null);
            // get a new token via auth.refreshToken
            return this.auth.refreshToken(this.authModel)
                .pipe(switchMap((newToken: ResponseVModel) => {
                  if(newToken && newToken.dataObject.token === this.token)
                  {
                    this.auth.deleteSession();
                    this.account.clear();
                    this.router.navigate(['/auth/sign-in']);

                    return of(req);

                  }
                    // did we get a new token retry previous request
                    else if(newToken) {
                        this.refreshTokenSubject.next(newToken);
                        return next.handle(this.addAuthenticationToken(req, newToken));
                    }
                    else {
                      this.auth.deleteSession();
                      this.account.clear();
                      this.router.navigate(['/auth/sign-in']);

                      return of(req);
                    }
                })
                    , finalize(() => {
                        this.refreshTokenInProgress = false;
                    })
                );
        } else {
            return this.refreshTokenSubject
                .pipe(
                    filter(token => token != null)
                    , take(1)
                    , switchMap(token => {
                        return next.handle(this.addAuthenticationToken(req, token));
                    })
                );
        }
    }

    createSession() {

      var session: SessionModel = { user: this.account.user,
        accessToken: this.account.accessToken, events: this.account.events,
        sessionId: this.account.sessionId, screens: this.account.screens, accessRights: this.account.accessRights };
        sessionStorage.setItem('session', JSON.stringify(session));
    }

}
