import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';
import { FormValidatorsServiceService } from 'src/app/shared/services/common/form-validators.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { AlertModel, AlertType, HeaderType } from 'src/app/shared/models/Alert.Model';
import { MessagesCodes, STATUS_CODE } from 'src/app/shared/helper/Enums';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AuthService } from 'src/app/shared/services/common/auth.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: UntypedFormGroup;
  isNavigated:boolean = false;
  runningid: string;
  isSubmitCalled: boolean;
  islinkValid: boolean = false;
  islinkInValid: boolean = false;
  passNotMatch;
  passUpdate;
  constructor(private formBuilder: UntypedFormBuilder, private formValidators: FormValidatorsServiceService, 
              private translationPipe: TranslationConfigService, private notification: NotificationServiceService, 
              private router: Router, private route: ActivatedRoute, private authService: AuthService )
  { 


    this.route.queryParams.subscribe(params => {
      this.runningid = params['param'];
  });

  }

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      let guid = params['param'];
      this.notification.loading = true;
      this.authService.checkLinkValidicity(guid).subscribe(response => {
        this.notification.loading = false;
        if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
          this.ShowErrorNotification(response.message);
          this.islinkInValid = true;
          this.islinkValid = false;
        } 
        else if (response.statusCode === STATUS_CODE.SUCCESS) {
          this.islinkValid = true;
          this.islinkInValid = false;
         }
      });
  });
  this.translationPipe
  .getTranslation("errorMessages.passNotMatch", "")
  .subscribe((response) => {
    this.passNotMatch = response;
  });
  this.translationPipe
  .getTranslation("errorMessages.passUpadte", "")
  .subscribe((response) => {
    this.passUpdate = response;
  });
    this.resetForm();
    
  }


  ShowErrorNotification(message) {

    const alertEr: AlertModel = { type: AlertType.DANGER, message: message, header: HeaderType.ERROR };
    this.notification.showNotification(alertEr);

  }
  FillMandatoryFieldsNotif() {

    let messageTS: any;
    this.translationPipe.getTranslation(MessagesCodes.MANDATORYREQUIRED.valueOf(), '').subscribe(response => {
      messageTS = response;
      const alertInvalid: AlertModel = { type: AlertType.DANGER, message: messageTS, header: HeaderType.ERROR };
      this.notification.showNotification(alertInvalid);

    });
  }

  submit({
    fcPassword,
    fcRePassword

  }) {

    this.isSubmitCalled =true;
    this.isNavigated = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return false;
    }

    if(fcPassword !== fcRePassword)
    {
      var alert: AlertModel = { type: AlertType.DANGER, message: this.passNotMatch, 
      header: HeaderType.ERROR };

      this.notification.showNotification(alert);

      return false;
    }
    this.authService.resetPass(fcPassword, fcRePassword, this.runningid).subscribe(response => {


      this.notification.loading = false;
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR && response.displayPopup == 1) {
      } else if (response.statusCode === STATUS_CODE.SUCCESS) {

        var alert: AlertModel = { type: AlertType.SUCCESS, message: this.passUpdate, header: HeaderType.SUCCESS };
        this.notification.showNotification(alert);

        this.authService.logout();

        //this.router.navigate(['/auth/sign-in']);
        this.resetForm();
      }
      else {

        var alert: AlertModel = { type: AlertType.DANGER, message: response.message, header: HeaderType.ERROR };
        this.notification.showNotification(alert);
      }


    });

    


  }


  resetForm() {
   
    this.isSubmitCalled = false;
    this.form = this.formBuilder.group({


      fcPassword: ['', [Validators.required, Validators.minLength(8) ,Validators.maxLength(200)]],
      fcRePassword: ['', [Validators.required, Validators.minLength(8) ,Validators.maxLength(200)]]
     
    });
    
    // Access ng-select



  }
}
