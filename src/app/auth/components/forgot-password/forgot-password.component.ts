import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AuthService } from 'src/app/shared/services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidatorsServiceService } from 'src/app/shared/services/common/form-validators.service';
import { MessagesCodes, STATUS_CODE } from 'src/app/shared/helper/Enums';
import { HeaderType, AlertModel, AlertType } from 'src/app/shared/models/Alert.Model';

@Component({
  selector: 'app-forgot-password-component',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  checkEmail;
  isBlur;
  userNotReg; 
  form: UntypedFormGroup;
  isNavigated:boolean = false;
  isSubmitCalled: boolean;
  isSaveButtonAllow: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, private formValidators: FormValidatorsServiceService, 
              private translationPipe: TranslationConfigService, private notification: NotificationServiceService, 
              private router: Router, private route: ActivatedRoute, private authService: AuthService )
  {   }

  ngOnInit() {
    this.resetForm();
    this.translationPipe
    .getTranslation("errorMessages.checkemail", "")
    .subscribe((response) => {
      this.checkEmail = response;
    });
    this.translationPipe
    .getTranslation("errorMessages.Usernotregistered", "")
    .subscribe((response) => {
      this.userNotReg = response;
    });
  }


  FillMandatoryFieldsNotif() {

    let messageTS: any;
    this.translationPipe.getTranslation(MessagesCodes.MANDATORYREQUIRED.valueOf(), '').subscribe(response => {
      messageTS = response;
      const alertInvalid: AlertModel = { type: AlertType.DANGER, message: messageTS, header: HeaderType.ERROR };
      this.notification.showNotification(alertInvalid);

    });
  }

  submit({ fcEmail }) {

    this.isSubmitCalled =true;
    this.isNavigated = true;
    // stop here if form is invalid
    if (this.form.invalid) {

      // this.FillMandatoryFieldsNotif();
      return false;
    }

    
    this.authService.forgotPassword(fcEmail).subscribe(response => {

      this.notification.loading = false;
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR && response.displayPopup == 1) { }
      
      else if (response.statusCode === STATUS_CODE.SUCCESS) {
        var alert: AlertModel = { type: AlertType.SUCCESS, message:   this.checkEmail , header: HeaderType.SUCCESS };
        this.notification.showNotification(alert);

        this.router.navigate(['/auth/sign-in']);
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

      fcEmail: [
        '',
        [
          Validators.required,
          Validators.maxLength(300),
          this.formValidators.emailValidator
        ]
      ],
     
    });
  }
}
