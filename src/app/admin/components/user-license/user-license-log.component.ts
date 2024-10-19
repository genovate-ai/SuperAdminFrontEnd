import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,

  FormArray,
  FormControl,

} from '@angular/forms';
import { FormValidatorsServiceService } from 'src/app/shared/services/common/form-validators.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { HelperFunctionsServiceService } from 'src/app/shared/services/common/helper-functions.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ManageRoleService } from 'src/app/shared/services/manage-role-services/manage-role-service.service';
import { AccessRightVModel } from 'src/app/shared/models/roles/AccessRightV.Model';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { STATUS_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { Constants } from 'src/app/shared/helper/Constants';
import { ManageUserLicenseService } from 'src/app/shared/services/manage-user-license-services/manage-user-license.service';
import { AuthService } from 'src/app/shared/services/common/auth.service';
import { UserProfileService } from 'src/app/shared/services/common/user-profile.service';
import { Subscription } from 'rxjs/Rx';


@Component({
  selector: 'app-user-license-log',
  templateUrl: './user-license-log.component.html'
})
export class UserLicenseLogComponent extends BaseFormComponent implements OnInit {



  lstUserEulaLog = [];
  
  userId: any;
  totalEulas = 0;
  currentEula = 0;
  pdfViewerParams = '?&#toolbar=0&navpanes=0&scrollbar=0&#zoom=FitH';

  showConfirmationFlag = false;
  confirmationMessage = '';
  
  timeZone;
  timeZoneFormat;
  dateFormatFilters;
  datezoneFormat;

  showButtons = false;
  userSubscription: Subscription;
  closeSubscription:any;


  eventGroup = EVENTGROUP_CODE.VIEW;

  regionDateFormat = '';
  
  constructor(
    private authService: AuthService,
    private router: Router,
    protected manageUserLicenseService: ManageUserLicenseService,
    private route: ActivatedRoute,
    protected notification: NotificationServiceService,
    protected popupController: PopupControllerService,
    public translationPipe: TranslationConfigService,
    protected accountService: AccountService,
    private userProfileService: UserProfileService,


  ) {
    super(translationPipe, popupController, notification, accountService);

  }


  ngOnInit() {
    // this.userSubscription = this.userProfileService.getUserParam.subscribe(response => {
    //    
    //   if(response.dateFormat != '' && response.dateFormat != undefined && response.dateFormat != null) {
    //     this.datezoneFormat = response.dateFormat || this.accountService.user.userDateFormat;
    //     this.timeZoneFormat = response.timeZoneFormat || this.accountService.user.userTimeZone;  
    //   }
    // });
     
    this.timeZoneFormat=this.accountService.user.userTimeZone;  
    this.datezoneFormat=this.accountService.user.userDateFormat;
    // this.datezoneFormat=this.account.user.userDateFormat;
    // this.regionDateFormat = this.translationPipe.getDateFormatKey(); 



    if (this.route.snapshot.paramMap.get('id')) { // if this components is called via routing
      this.userId = +this.route.snapshot.paramMap.get('id');
    } else { // if this components is called via popup
      
      const user: any = this.popupController.getParams();
      if (user.userId === undefined) {
        this.userId = 0;
      } else {
        this.userId = user.userId;
      }
      this.showUserEulaLog(this.userId);
    }
    // 
    // this.translationPipe
    //   .getTraslatedValue("dateFormat.dateForm", "")
    //   .subscribe((response) => {
    //     this.customFormat = response;
    //   });


  }

  showUserEulaLog(id) {
      this.notification.loading = true;
      this.manageUserLicenseService.getAllUserEulaLog(id).subscribe(response => {
            
            this.notification.loading = false;
            this.lstUserEulaLog = response.dataObject || [];
        }, err => {}
        , () => {} );
  }
  ngOnDestroy() {
  }

}
