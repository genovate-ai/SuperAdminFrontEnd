import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { UserVModel } from 'src/app/shared/models/users/UserV.Model';
import { Role } from 'src/app/shared/models/roles/Role.Model';
import { CountryCodes } from 'src/app/shared/models/CountryCodes.Model';
import { SelectBox } from 'src/app/shared/models/SelectBox.Model';
import { UserAccountService } from 'src/app/shared/services/user-account-services/user-account.service';
import { FormValidatorsServiceService } from 'src/app/shared/services/common/form-validators.service';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { SCREEN_CODE, MessagesCodes } from 'src/app/shared/helper/Enums';
import { ManageOrganizationsService } from 'src/app/shared/services/manage-organizations/manage-organizations.service';
import { Constants } from 'src/app/shared/helper/Constants';
import { AlertType, HeaderType, AlertModel } from 'src/app/shared/models/Alert.Model';

// This component just has a controller file. it uses template and stylesheet fron create-user-component.

@Component({
  template: ''
})
export class baseorganizationformcomponent extends BaseFormComponent implements OnInit {

  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageOrganization;

  image64: string;

  isUpdating = true;
  fileData: File = null;
  previewUrl: any = null;
  // fileUploadProgress: string = null;
  uploadedFilePath: string = null;


  form: UntypedFormGroup;
  selectedValueOrgType: any;
  selectedValueCellCode: any;

  selectedRoles: any;
  selectedReportRoles: any;
  selectedEulas: any;


  lstOrgType: Array<SelectBox> = [];
  lstPhoneCode: Array<SelectBox> = [];
  Provinces: Array<SelectBox> = [];
  lstRoles: Array<SelectBox> = [];
  lstReportRoles: Array<SelectBox> = [];
  lstEulas: Array<SelectBox> = [];

  isFromUpdateComponent = false;

  isNavigated = false;
  // This is for Stepper
  stepOne = true;
  stepTwo = false;
  stepThree = false;
  value = 'one';
  selectfile;

  isFromUpdate = false;
  imageSize;
  ImageNotChanged = true;
  workCountryCode = 1;


  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected translationPipe: TranslationConfigService,
    protected popupController: PopupControllerService,
    protected notification: NotificationServiceService,
    protected formValidators: FormValidatorsServiceService,
    protected manageOrganizationsService: ManageOrganizationsService,
    protected accountService: AccountService

  ) {

    super(translationPipe, popupController, notification, accountService);

  }

  ngOnInit() {
    this.translationPipe
      .getTranslation("errorMessages.logofile", "")
      .subscribe((response) => {
        this.selectfile = response;
      });
    this.translationPipe
      .getTranslation("errorMessages.ImageLimit", "")
      .subscribe((response) => {
        this.imageSize = response;
      });

  }
  ngAfterViewInit(): void {
    
  }

  isFieldInValid(field: string) {
    return this.form.get(field).invalid;
  }

  NavigationValidation(newValue) {
    // MEMO: if below will be true message will be shown with each field.
    this.isNavigated = true;

    if (newValue === 'one') {

      this.isNavigated = false;
      return true;

    } else if (newValue === 'two') {
      if (this.isFieldInValid('fcName') || this.isFieldInValid('fcOrganizationType')
        || this.isFieldInValid('fcEmail') || this.isFieldInValid('fcCellCode') || this.isFieldInValid('fcCellNumber')
      ) {
        return false;

      } else {

        this.isNavigated = false;
        return true;
      }

    } else if (newValue === 'three') {

    }


  }

  listClick(event, newValue, isNextNavigation: boolean) {

    if (isNextNavigation === true) {

      if (!this.NavigationValidation(newValue)) {
        return;

      }
    } else {

      this.isNavigated = false;

    }

    this.value = newValue;
    if (newValue === 'one') {
      // this.stepOne = true;
      this.stepTwo = false;
      this.stepThree = false;
    }
    if (newValue === 'two') {
      this.stepTwo = true;
      this.stepThree = false;
    }
    if (newValue === 'three') {
      this.stepTwo = true;
      this.stepThree = true;
    }

  }
  goBack(event) {

    if (this.value === 'two') {
      this.listClick(event, 'one', false);
    }
    if (this.value === 'three') {
      this.listClick(event, 'two', false);
    }
  }

  goNext(event) {



    if (this.value === 'two') {
      this.listClick(event, 'three', true);
    }
    if (this.value === 'one') {
      this.listClick(event, 'two', true);
    }
  }


  tabInternalClick(step, value) {
    this.tabClick(step, value);
    // this.form.markAllAsTouched();
  }

  btnInternalClickNext() {
    // this.form.markAsUntouched();
    this.goNextTab();
  }
  btnInternalClickBack() {
    this.goBackTab();
  }

  tabClick(newValue, isNextNavigation: boolean) {
    if (isNextNavigation === true) {

      if (!this.NavigationValidation(newValue)) {
        this.touchedControls();
        return;
      }
    } else {

      this.isNavigated = false;

    }

    if (newValue === 'one') {
      this.stepOne = true;
      this.stepTwo = false;
      this.stepThree = false;
    }
    if (newValue === 'two') {
      this.stepOne = false;
      this.stepTwo = true;
      this.stepThree = false;
    }

    this.value = newValue;

  }
  goBackTab() {

    if (this.value === 'two') {
      this.tabClick('one', false);
    }
    if (this.value === 'three') {
      this.tabClick('two', false);
    }
  }

  goNextTab() {


    if (this.value === 'two') {
      this.tabClick('three', true);
    }
    if (this.value === 'one') {
      this.tabClick('two', true);
    }
  }


  previewimage(file, callback) {

    const image = file.item(0);
    const fileReader = new FileReader();
    fileReader.onload = (event: any) => {
      callback(event.target.result);
    };

    fileReader.readAsDataURL(image);
  }


  isCellCodeSelected(item = null, clear = true) {

    let isDsbld = this.form.get('fcCellCode').value ? false : true
    if (isDsbld) {
      this.form.controls.fcCellNumber.setValidators([Validators.maxLength(15)])
      this.form.get('fcCellNumber').setValue('');
     // this.form.get('fcCellNumber').disable();
    }
    else {
      this.form.controls.fcCellNumber.setValidators([Validators.required, Validators.maxLength(15)]);
      if (item && clear) {
        this.form.get('fcCellNumber').setValue('');
      }
      this.form.get('fcCellNumber').enable();
      this.form.get('fcCellNumber').markAsPristine();
      this.form.get('fcCellNumber').markAsUntouched();
    }
    this.workCountryCode = this.form.get('fcCellCode').value && item ? item.code : '+1';
  }

  onImageChange(event) {

    const MAX_SIZE = 1048576;

    this.previewimage(event.target.files, callback => {

      if (event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/png') {

        // Set theFile property
        this.image64 = callback;

      } else {

        let alertEr: AlertModel = { type: AlertType.DANGER, message: this.selectfile, header: HeaderType.ERROR, isUserExplicitEvent: true };
        this.notification.showNotification(alertEr);

        this.image64 = Constants.defaultImage64;

      }


      if (event.target.files[0].size < MAX_SIZE) {
        // Set theFile property
        this.image64 = callback;

      } else if (event.target.files[0].size > MAX_SIZE) {

        let alertEr: AlertModel = { type: AlertType.DANGER, message: this.imageSize, header: HeaderType.ERROR, isUserExplicitEvent: true };
        this.notification.showNotification(alertEr);

        this.image64 = Constants.defaultImage64;

      }


    });
  }

  public selectAllRoles(e) {
    if (e.target.checked) {
      const selected = this.lstRoles.map(item => item.codeID);
      this.form.get('fcRoleId').patchValue(selected);
    } else {
      this.form.get('fcRoleId').patchValue([]);
    }

  }
  public selectAllReportRoles(e) {
    if (e.target.checked) {
      const selected = this.lstReportRoles.map(item => item.codeID);
      this.form.get('fcReportRoleId').patchValue(selected);
    } else {
      this.form.get('fcReportRoleId').patchValue([]);
    }

  }
  public selectAllEulas(e) {
    if (e.target.checked) {
      const selected = this.lstEulas.map(item => item.codeID);
      this.form.get('fcEulaId').patchValue(selected);
    } else {
      this.form.get('fcEulaId').patchValue([]);
    }

  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.fileData);
  }


  resetForm(resetControls = false) {
    
    // MEMO: START To select the placeholder below is the workaround.
    this.listClick(null, 'one', false);
    this.selectedValueOrgType = [];
    this.selectedValueCellCode = [];
    this.image64 = Constants.defaultImage64;
    this.selectedRoles = [];
    this.selectedReportRoles = [];
    this.selectedEulas = [];
    // MEMO: END To select the placeholder below is the workaround.

    if (resetControls) {
      this.form.reset();
      this.form.controls.fcIsActive.patchValue('true');
      this.form.markAllAsTouched();
      this.selectedRoles = [];
      this.selectedReportRoles = [];
      this.selectedEulas = [];
    } else {
      this.form = this.formBuilder.group({
        fcName: ['', [Validators.required, Validators.maxLength(100)]],
        fcOrganizationType: ['', [Validators.required]],
        fcOrgID: [''],
        fcEmail: [
          '',
          [
            Validators.maxLength(100),
            this.formValidators.emailValidator
          ]
        ],
        fcCellNumber: ['', [Validators.maxLength(11),Validators.minLength(11)]],
        fcCellCode: [''],


        fcMaxUsers: ['', [Validators.required, Validators.max(50000), Validators.pattern('^[0-9]*$')]],
        fcIsActive: ['true'],
        fcRoleId: ['', [Validators.required]],
        fcReportRoleId: ['', [Validators.required]],
        fcEulaId: ['']
      });
    }

    this.isCellCodeSelected();
    // Access ng-select
    // //MEMO: Role Management
    if (!this.isSaveButtonAllow) {
      this.form.disable();
    }


  }




  public onRolesSelectAll() {
    const selected = this.lstRoles.map(item => item.codeID);
    this.form.get('fcRoleId').patchValue(selected);
  }

  public onRolesClearAll() {

    this.form.get('fcRoleId').patchValue([]);
  }

  /// Common Finctions in Base Screen Form
  CheckFormValid() {
    if (this.form.invalid) {


      return false;
    }
  }

  ProcessSaveSuccess(response) {

    this.ShowSuccessNotification(response.message);
    this.resetForm();
    this.close();
  }

  ProcessSaveFail(response) {

    this.ShowErrorNotification(response.message);

  }

  onWorkCountryCode() {
    this.workCountryCode = this.form.get('fcCellCode').value ? this.form.get('fcCellCode').value : 1;
  }

  touchedControls() {
    switch (this.value) {
      case 'one':
        this.form.controls.fcName.markAsTouched();
        this.form.controls.fcEmail.markAsTouched();
        this.form.controls.fcOrganizationType.markAsTouched();
        this.form.controls.fcCellCode.markAsTouched();
        this.form.controls.fcCellNumber.markAsTouched();
        break;
      case 'two':
        this.form.controls.fcEmail.markAsTouched();
        this.form.controls.fcOrganizationType.markAsTouched();
        this.form.controls.fcOrganization.markAsTouched();
        break;
      case 'three':
        this.form.controls.fcRoleId.markAsTouched();
        this.form.controls.fcReportRoleId.markAsTouched();
        this.form.controls.fcEulaId.markAsTouched();
        break;

      default:
        break;
    }
  }

}


