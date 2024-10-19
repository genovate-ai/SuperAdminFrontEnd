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


@Component({
  selector: 'app-view-user-license',
  templateUrl: './view-user-license.component.html'
})
export class ViewUserLicenseComponent extends BaseFormComponent implements OnInit {

  staticFileBaseUrl = Constants.staticFileBaseUrl;

  viewer = 'pdf';
  docUrl = '';

  lstEulas = [];
  userId = 0;
  totalEulas = 0;
  currentEula = 0;
  pdfViewerParams = '?&#toolbar=0&navpanes=0&scrollbar=0&#zoom=FitH';

  showConfirmationFlag = false;
  confirmationMessage = '';

  showButtons = false;


  eventGroup = EVENTGROUP_CODE.VIEW;

  constructor(
    private authService: AuthService,
    private router: Router,
    protected manageUserLicenseService: ManageUserLicenseService,
    private route: ActivatedRoute,
    protected notification: NotificationServiceService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected accountService: AccountService

  ) {
    super(translationPipe, popupController, notification, accountService);

  }


  ngOnInit() {


    if (this.route.snapshot.paramMap.get('id')) { // if this components is called via routing
      this.userId = +this.route.snapshot.paramMap.get('id');
    } else { // if this components is called via popup
      
      const eula: any = this.popupController.getParams();
      if (eula.userId === undefined) {
        
        this.showSingleEula(eula.eulaServePath);
      } else {
        
        this.userId = +eula.userId;
        this.lstEulas = eula.lstEulas || [];
        this.showButtons = true;
        this.showAllEula(this.userId);
      }
    }

  }

  showSingleEula(path: string) {
    
    this.docUrl = this.staticFileBaseUrl + path + this.pdfViewerParams;
  }

  showAllEula(id) {
    if (this.lstEulas.length > 0) {
      this.totalEulas = this.lstEulas.length;
      this.showNextEula();
    } else {
      this.createSessionAndNavigate();
    }

  }

  showNextEula() {
    
    if (this.currentEula < this.totalEulas) {
      this.docUrl = this.staticFileBaseUrl + this.lstEulas[this.currentEula].eulaServePath + this.pdfViewerParams;

    } else {
      this.createSessionAndNavigate();
    }
  }

  markAcceptEula() {
    
    this.notification.loading = true;
    const index = this.currentEula - 1;
    this.manageUserLicenseService.markAcceptEula(this.userId, this.lstEulas[this.currentEula].eulaId).subscribe(response => {
      this.currentEula += 1;
      this.showNextEula();
      this.notification.loading = false;
    }, err => {}
    , () => {});
  }

  rejectEula() {
    this.translationPipe
      .getTranslation("Confirm.rejectEula", "")
      .subscribe(response => {
        this.confirmationMessage = response;
      });

    this.showConfirmationFlag = true;
  }

  markRejectEula() {

    this.notification.loading = true;
    this.manageUserLicenseService.markRejectEula(this.userId, this.lstEulas[this.currentEula].eulaId).subscribe(response => {
      this.authService.logout();
      this.notification.loading = false;
      this.close();
    }, err => {}
    , () => {});
  }

  createSessionAndNavigate() {
    this.authService.createSession();
    this.router.navigate(['/home']);
  }

}
