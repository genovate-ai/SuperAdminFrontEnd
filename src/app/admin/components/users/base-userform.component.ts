import { style } from '@angular/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { SCREEN_CODE, API_CALLEVENTGROUP_CODE, STATUS_CODE, OrganizationTypeEnum } from 'src/app/shared/helper/Enums';
import { ManageOrganizationsService } from 'src/app/shared/services/manage-organizations/manage-organizations.service';
import { TreeviewItem, TreeviewConfig, TreeItem, TreeviewI18nDefault, TreeviewComponent } from 'ngx-treeview';
import { SampleObject } from 'src/app/shared/helper/SampleObject';
import { AlertModel, AlertType, HeaderType } from 'src/app/shared/models/Alert.Model';
import { AuthService } from 'src/app/shared/services/common/auth.service';
// This component just has a controller file. it uses template and stylesheet fron create-user-component.

@Component({
  template: ''
})
export class BaseUserFormComponent extends BaseFormComponent implements OnInit {
  disableSiteSelection;
  showSiteRequiredErr;
  passwordText = "";
  lstUserSitesAssn: any;
  lstAllUserSitesIDs;
  lstAllCollectionSitesIDs;
  lstAllExtraSitesIDs;
  lstAllTestingSitesIDs;
  lstTestingSites = [];
  lstClientSites = [];
  sitesSelected: any;
  taggedData: any = [];
  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageUser;
  createScreen = false;
  notEvenCheckedOne = false;
  minDate: Date;
  selectedValue: any;
  selectedValueSite: any;
  selectedValueOrganization: any;
  selectedValueOrgType: any;
  selectedValuePhoneCode: any;
  selectedValueCellCode: any;

  selectedClients: any;
  selectedClients2 = [];
  selectedRoles: any;
  selectedReportRoles: any;
  selectedValuePipers: any;
  selectedEulas = [];
  selectedTehsils = [];
  selectedRoleCategory;

  isDsbld = true;
  roles: Array<Role> = [];
  countryCodes: Array<CountryCodes> = [];
  lstSites: Array<SelectBox> = [];
  lstSitesFiltered: Array<SelectBox> = [];
  lstOrganizations: Array<SelectBox> = [];
  lstOrganizationsFiltered: Array<SelectBox> = [];
  lstMyClientsFiltered: Array<SelectBox> = [];
  lstMyClientsFiltered2: Array<SelectBox> = [];
  lstOrgType: Array<SelectBox> = [];
  lstPipers: Array<SelectBox> = [];
  lstEulas: Array<any> = [];

  lstOrganizationWiseUserRoles: Array<any> = [];
  lstOrganizationWiseUserReportRoles: Array<any> = [];
  lstEulasWithStatus: Array<any> = [];

  lstPhoneCode: Array<SelectBox> = [];

  lstRoles: Array<SelectBox> = [];
  lstRolesFiltered: Array<SelectBox> = [];
  lstReportRolesFiltered: Array<SelectBox> = [];

  lstRoleCategory: Array<SelectBox> = [];
  lstTehsils: Array<SelectBox> = [];
  lstReportRoles: Array<SelectBox> = [];
  isFromUpdateComponent = false;
  isFromCreateComponent = false;
  renderLstEulas = false;
  isEulasInDBSelected = false;
  isBlur = false;
  sitesMap = new Map()
  siteDetails = new Map()
  showRoleCategoryName = false;
  showTehsilId = false;

  // This is for Stepper
  stepOne = true;
  stepTwo = false;
  stepThree = false;
  // Stepper Ends here

  showTreeDiv = false;
  form: UntypedFormGroup;
  roleId: string;
  userVModel: UserVModel;
  // isNavigated: boolean = false;
  value = 'one';
  setPlaceholder;
  setPlaceholderForSites;
  itemsLst: TreeviewItem[] = [];
  itemsLst2: TreeviewItem[] = [];
  lstSitesTree: any = [];
  values: number[];
  values2: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  buttonClass = 'apl-btn btn-ok';
  cellCountryCode = '+1';
  workCountryCode = '+1';
  viewPipers: any;
  selectedSites = [];
  ValueChangedIndicator = false;
  showConfirmationFlag = false;
  showConfirmationFlag2 = false;

  @ViewChild('NgSelectGroup', { static: true })
  private NgSelectGroupContainerRef: ElementRef;
  confirmationMessage = "";
  confirmationMessage2 = "";
  previousClient: any;
  closeForcefully: boolean = false;
  OrgAndSiteIds = [];
  savedOrgnAndSites = [];
  showErrorSites: boolean;
  disableSave: boolean;
  lstAllSites: any;
  isPiperUser: boolean;
  showSitesTree = false;

  isAnceraUser = false;
  isSiteAdmin = false;
  orgnTypeId = 0;
  orgnId = 0;
  // orgnIdOri = 0;
  roleClearable = true;

  constructor(
    protected manageOrganizationsService: ManageOrganizationsService,
    protected formBuilder: UntypedFormBuilder,
    protected translationPipe: TranslationConfigService,
    protected popupController: PopupControllerService,
    protected notification: NotificationServiceService,
    protected formValidators: FormValidatorsServiceService,
    protected userAccountService: UserAccountService,
    protected accountService: AccountService

  ) {

    super(translationPipe, popupController, notification, accountService);

  }

  ngOnInit() {
  }

  getPrevVal($event) {
    this.previousClient = this.selectedClients2;
  }
  showTree(item) {
    this.showErrorSites = false;
    this.form.controls['fcClientId2'].enable();
    this.translationPipe.getTranslation('Confirm.changesclientsSites', '').subscribe(response => {
      this.confirmationMessage = response;
    });
    this.translationPipe.getTranslation('Confirm.changesclientsSitesDropdown', '').subscribe(response => {
      this.confirmationMessage2 = response;
    });
    this.selectedClients2 = [];
    this.itemsLst2 = [];
    this.lstMyClientsFiltered2 = this.lstOrganizations.filter(
      rec => rec.tag === OrganizationTypeEnum.Clients.valueOf() && this.selectedClients.includes(rec.codeID));
    this.showTreeDiv = true;
  }
  resetForm(resetControls = false) {
    this.sitesMap = new Map();
    this.siteDetails = new Map();
    this.isPiperUser = false;
    this.lstClientSites = [];
    this.values = [];
    this.lstTestingSites = [];
    this.lstAllSites = [];
    // MEMO: START To select the placeholder below is the workaround.
    this.lstAllSites = [];
    this.lstAllUserSitesIDs = [];
    this.lstAllTestingSitesIDs = [];
    this.listClick('one', false);
    this.viewPipers = false;
    this.selectedValueSite = [];
    this.selectedValuePipers = [];
    this.values = [];
    this.lstSitesFiltered = [];
    this.itemsLst = [];
    this.selectedValueOrganization = [];
    this.selectedValueOrgType = [];
    this.selectedValuePipers = [];
    this.selectedValuePhoneCode = [];
    this.selectedValueCellCode = [];

    this.selectedClients = [];
    this.selectedRoles = [];
    this.selectedReportRoles = [];
    this.lstPipers = [];
    this.selectedEulas = [];
    this.selectedTehsils = [];

    // MEMO: END To select the placeholder below is the workaround.
    if (resetControls) {
      this.form.reset();
      this.form.controls.fcIsActive.patchValue('true');
      this.form.controls.fcPrimaryContact.patchValue('true');
      this.form.controls.fcPiperUser.patchValue('false');
      this.form.controls.fcSiteAdministrator.patchValue('false'),
        this.form.controls.fcPipers.patchValue([]);
      this.selectedRoles = [];
      this.selectedReportRoles = [];
      this.selectedEulas = [];
      this.selectedRoleCategory = null;
      this.showRoleCategoryName = false;
      this.form.controls.fcEmail.markAsUntouched();
    } else {
      this.form = this.formBuilder.group({
        fcFirstName: ['', [Validators.required, Validators.maxLength(100)]],
        fcLastName: ['', [Validators.required, Validators.maxLength(100)]],
        fcEmail: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            this.formValidators.emailValidator
          ]
        ],
        fcIsActive: ['true'],
        fcCellNumber: ['', [Validators.maxLength(11), Validators.minLength(11)]],
        fcCellCode: [0],
        fcPhoneCode: [0],
        fcPhoneNumber: ['', [Validators.maxLength(11), Validators.minLength(11)]],
        fcOrganizationType: ['', [Validators.required]],
        fcOrganization: ['', [Validators.required]],
        fcRoleId: ['', [Validators.required]],
        fcClientId: [''],
        fcClientId2: [''],
        fcPrimaryContact: ['true'],
        fcDesignation: [''],
        fcReportRoleId: [''],
        fcEulaId: [''],
        fcPiperUser: ['false'],
        fcPipers: [[]],
        fcRoleCategoryId: [null],
        fcRoleCategoryName: [null, [Validators.maxLength(100)]],
        fcSiteAdministrator: ['false'],
        fcTehsilId: [null]
      });
    }


    this.isCellCodeSelected();
    this.isWorkCodeSelected();
    // //MEMO: Role Management
    if (!this.isSaveButtonAllow) {
      this.form.disable();
    }
    // Access ng-select

  }

  markPiperUser(isPiperUser) {

    if (isPiperUser == null) {
      if (this.form.controls['fcPiperUser'].value == 'false') {
        isPiperUser = false;
      }
      else {
        isPiperUser = true;
      }
    }
    this.viewPipers = isPiperUser;
    if (isPiperUser) {
      // this.form.controls.fcPipers.setValidators([Validators.required]);
      this.form.controls['fcPipers'].updateValueAndValidity();
    }
    else {
      this.selectedValuePipers = [];
      this.form.controls['fcPipers'].setValue([]);
      this.form.controls['fcPipers'].markAsUntouched();
      this.form.controls['fcPipers'].clearValidators();
      this.form.controls['fcPipers'].updateValueAndValidity();
    }
    this.form.controls.fcPipers.value;
  }


  CheckFormValid() {
    if (this.form.invalid) {


      return false;
    }
  }

  ProcessSaveSuccess(response, status = false) {

    this.ShowSuccessNotification(response.message);
    this.resetForm();
    if (status) {
      this.popupController.updateResult(true);
    } else {
      this.popupController.updateResult(response.dataObject);
    }
    this.close();
  }

  ProcessSaveFail(response) {

    this.ShowErrorNotification(response.message);

  }

  ////// For Stepper///////////////


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
      if (this.isFieldInValid('fcFirstName') || this.isFieldInValid('fcLastName')
        || this.isFieldInValid('fcPhoneCode') || this.isFieldInValid('fcPhoneNumber')
        || (this.isFieldInValid('fcCellCode') || this.isFieldInValid('fcCellNumber'))
        || this.isFieldInValid('fcEmail') || this.isFieldInValid('fcRoleCategoryName')
        || this.isFieldInValid('fcTehsilId')) {
        return false;

      } else {

        this.isNavigated = false;
        return true;
      }

    } else if (newValue === 'three') {
      if (this.isFieldInValid('fcFirstName') || this.isFieldInValid('fcLastName')
        || this.isFieldInValid('fcPhoneCode') || this.isFieldInValid('fcPhoneNumber')
        || (this.isFieldInValid('fcCellCode') || this.isFieldInValid('fcCellNumber')) || this.isFieldInValid('fcEmail')
        || this.isFieldInValid('fcOrganizationType') || this.isFieldInValid('fcOrganization') || this.isFieldInValid('fcRoleCategoryName')
        || this.isFieldInValid('fcTehsilId')) {
        return false;

      } else {

        this.isNavigated = false;
        return true;
      }

    }


  }

  isCellCodeSelected(item = null) {

    let isDsbld = this.form.get('fcCellCode').value ? false : true
    if (isDsbld) {
      this.form.controls.fcCellNumber.setValidators([Validators.maxLength(15)])
      this.form.get('fcCellNumber').setValue('');
      // this.form.get('fcCellNumber').disable();
    }
    else {
      this.form.controls.fcCellNumber.setValidators([Validators.required, Validators.maxLength(15)]);
      if (item) {
        this.form.get('fcCellNumber').setValue('');
      }
      this.form.get('fcCellNumber').enable();
      this.form.get('fcCellNumber').markAsPristine();
      this.form.get('fcCellNumber').markAsUntouched();
    }
    this.cellCountryCode = this.form.get('fcCellCode').value && item ? item.code : '+1';
  }
  isWorkCodeSelected(item = null) {

    let isDsbld = this.form.get('fcPhoneCode').value ? false : true
    if (isDsbld) {
      this.form.controls.fcPhoneNumber.setValidators([Validators.maxLength(15)])
      this.form.get('fcPhoneNumber').setValue('');
      // this.form.get('fcPhoneNumber').disable();
    }
    else {
      this.form.controls.fcPhoneNumber.setValidators([Validators.required, Validators.maxLength(15)]);
      if (item) {
        this.form.get('fcPhoneNumber').setValue('');
      }
      this.form.get('fcPhoneNumber').enable();
      this.form.get('fcPhoneNumber').markAsPristine();
      this.form.get('fcPhoneNumber').markAsUntouched();
    }
    this.workCountryCode = this.form.get('fcPhoneCode').value && item ? item.code : '+1';
  }
  listClick(newValue, isNextNavigation: boolean) {

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
      this.isSiteAdmin = this.form.get('fcSiteAdministrator').value == 'true';
      if (this.orgnTypeId === OrganizationTypeEnum.Ancera.valueOf()) {
        this.orgnId = 0;
      } else if (this.orgnTypeId !== OrganizationTypeEnum.Ancera.valueOf()) {
        this.orgnId = this.form.get('fcOrganization').value || 0;
      }
    }

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
    if (newValue === 'three') {

      this.stepOne = false;
      this.stepTwo = false;
      this.stepThree = true;
      // this.isSiteAdmin = this.form.get('fcSiteAdministrator').value == 'true';

      if (this.orgnTypeId === OrganizationTypeEnum.Ancera.valueOf()) {
        if (this.form.get('fcSiteAdministrator').value == 'true') {
          this.orgnId = this.form.get('fcOrganization').value || 0;
        } else {
          this.orgnId = 0;
        }
      } else if (this.orgnTypeId !== OrganizationTypeEnum.Ancera.valueOf()) {
        this.orgnId = this.form.get('fcOrganization').value || 0;
      }

    }
    this.value = newValue;

  }
  goBack() {

    if (this.value === 'two') {
      this.listClick('one', false);
    }
    if (this.value === 'three') {
      this.listClick('two', false);
    }
  }

  goBackTab() {

    if (this.value === 'two') {
      this.tabClick('one', false);
    }
    if (this.value === 'three') {
      this.tabClick('two', false);
    }
  }


  goNext() {


    if (this.value === 'two') {
      this.listClick('three', true);
    }
    if (this.value === 'one') {
      this.listClick('two', true);
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

  public onRolesSelectAll() {
    const selected = this.lstRoles.map(item => item.codeID);
    this.form.get('fcRoleId').patchValue(selected);
  }

  public onRolesClearAll() {
    this.form.get('fcRoleId').patchValue([]);
  }


  public selectAllClients(e) {
    if (e.target.checked) {
      const selected = this.lstMyClientsFiltered.map(item => item.codeID);
      this.form.get('fcClientId').patchValue(selected);
    }
    else {
      this.form.get('fcClientId').patchValue([]);
    }

  }


  public selectAllRoles(e) {
    if (e.target.checked) {
      const selected = this.lstRoles.map(item => item.codeID);
      this.form.get('fcRoleId').patchValue(selected);
    } else {
      this.form.get('fcRoleId').patchValue([]);
    }

  }

  public selectAllTehsils(e) {
    if (e.target.checked) {
      const selected = this.lstTehsils.map(item => item.codeID);
      this.form.get('fcTehsilId').patchValue(selected);
    } else {
      this.form.get('fcTehsilId').patchValue([]);
    }

  }

  selectAllReportRoles(e) {
    if (e.target.checked) {
      const selected = this.lstReportRoles.map(item => item.codeID);
      this.form.get('fcReportRoleId').patchValue(selected);
    } else {
      this.form.get('fcReportRoleId').patchValue([]);
    }
  }

  selectAllPipers(e) {
    if (e.target.checked) {
      const selected = this.lstPipers.map(item => item.codeID);
      this.form.get('fcPipers').patchValue(selected);
    } else {
      this.form.get('fcPipers').patchValue([]);
    }
  }

  selectAllEulas(e) {
    if (e.target.checked) {
      const selected = this.lstEulas.map(item => item.codeID);
      this.form.get('fcEulaId').patchValue(selected);
    } else {
      const arr = this.lstEulas.filter(x => {
        return x.tag === 2;
      }).map(item => item.codeID);
      this.form.get('fcEulaId').patchValue(arr);
    }
  }


  // ValueChanged(value: number[], isClientData) {
  //   let _this = this;
  //   TreeviewI18nDefault.prototype.getText = function (selection) {
  //     // return 'Sites';
  //     return _this.sitesLabel();
  //   };
  //   TreeviewComponent.prototype.onItemCheckedChange = function (item, checked) {
  //     this.raiseSelectedChange();
  //   };
  //   TreeviewComponent.prototype.raiseSelectedChange = function () {
  //     this.generateSelection();
  //     const values: number[] = [];
  //     const items = this.items;
  //     _this.calculateCheckedValues(items, values);
  //     this.selectedChange.emit(values);
  //   };

  //   if(!isClientData){
  //     this.values = value;
  //   }else{
  //     this.notEvenCheckedOne = false;
  //     this.values2 = value;
  //     if(this.selectedClients2 && this.selectedClients2.length != 0){
  //       this.disableSave = false;
  //     let foundVal = false;
  //     for(let i = 0; i < this.OrgAndSiteIds.length; i++){
  //       if(this.OrgAndSiteIds[i] && this.OrgAndSiteIds[i].orgnId == this.selectedClients2){
  //          this.OrgAndSiteIds[i].siteId = this.values2;
  //          foundVal = true;
  //       }
  //     }
  //     if(!foundVal){
  //       this.OrgAndSiteIds.push({
  //         userId : 0,
  //         orgnId : this.selectedClients2,
  //         siteId: this.values2
  //       })
  //     }
  //     if(this.values2.length == 0){
  //       this.showErrorSites = true;
  //     }
  //     else{
  //       this.showErrorSites = false;
  //     }
  //   }
  //   else{
  //     this.disableSave = true;
  //     this.selectedSites = [];
  //     this.values2 = []
  //   }
  // }
  //   console.log('values:', this.values);
  // }

  // calculateCheckedValues(obj: any, values: number[]) {
  //   if (obj == null) {
  //     return;
  //   }
  //   else {
  //     for (const i of obj) {
  //       if (i.internalChecked) {
  //         values.push(i.value)
  //       }
  //       this.calculateCheckedValues(i.internalChildren, values);
  //     }
  //   }
  // }

  // onFilterChange(value: string) {
  //   console.log('filter:', value);
  // }
  // public LoadLocationTree(organId, setPlaceholderForSites, lsChecked, isClientData) {
  //   // this.taggedData = [];
  //   if(organId == null){
  //     return;
  //   }
  //   if(!isClientData){
  //   this.lstSitesFiltered = this.lstSites.filter(
  //     rec => rec.tag === organId);
  //   if (setPlaceholderForSites === true) {
  //     this.ClearSitesList();
  //     }
  //   }


  //   this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
  //   this.manageOrganizationsService
  //     .LoadSiteTreeMetaData(organId)
  //     .subscribe(response => {
  //       this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
  //       this.lstSitesTree = response.dataObject;
  //       if(!isClientData){
  //       this.itemsLst = [];
  //       }else{
  //         this.itemsLst2 = [];
  //       }

  //       this.formData(this.lstSitesTree, lsChecked, setPlaceholderForSites,isClientData)

  //     });

  // if(!isClientData){
  //   this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
  //   this.userAccountService
  //     .GetAllRolesForOrganization(organId)
  //     .subscribe(response => {

  //       this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
  //       this.lstRoles = response.dataObject;
  //     });

  //   this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
  //   this.userAccountService
  //     .getAllEulasForOrganization(organId)
  //     .subscribe(response => {
  //       this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

  //       if (response.dataObject != null) {
  //           if (this.isFromCreateComponent) {
  //               this.selectedEulas = response.dataObject.lstEulaIDS;
  //             }
  //           if (this.isEulasInDBSelected) {
  //             let tempArr = [];
  //             tempArr = response.dataObject.lstEulaIDS;
  //             this.selectedEulas = this.lstEulasWithStatus.filter(obj => obj.statusId === 2)
  //                                     .map(obj => obj.eulaId).concat(tempArr);
  //           }
  //           this.isEulasInDBSelected = true;
  //         }
  //     });
  //   }

  // }

  // formData(sitesTree, lsChecked, setPlaceholderForSites, isClientData) {
  //   const list: SampleObject[] = new Array<SampleObject>();
  //   this.fillDataRecursively(sitesTree, list);

  //   const treeViewItem: TreeviewItem = new TreeviewItem(list[0]);
  //   console.log(treeViewItem)
  //   if (!setPlaceholderForSites) {
  //     for (const ob of lsChecked) {
  //       if (ob === treeViewItem.value) {
  //         treeViewItem.checked = true;
  //       }
  //     }
  //     this.fillCheckedDataRecursively(treeViewItem.children, lsChecked)
  //   } else {
  //     treeViewItem.checked = true;
  //     this.fillDataRecursivelyChecked(treeViewItem.children)
  //   }
  //   if(!isClientData){
  //   this.itemsLst = [treeViewItem];
  //   }else{
  //     this.itemsLst2 = [treeViewItem];
  //   }
  // }

  // fillCheckedDataRecursively(obj: any, list: any) {
  //   if (obj == null) {
  //     return;
  //   } else {
  //     for (const i of obj) {
  //       for (const ob of list) {
  //         if (ob === i.value) {
  //           i.checked = true;
  //         }
  //       }
  //       this.fillCheckedDataRecursively(i.children, list);
  //     }
  //   }
  // }

  // fillDataRecursivelyChecked(obj: any) {
  //   if (obj == null) {
  //     return;
  //   } else {
  //     for (const i of obj) {
  //       i.checked = true;
  //       this.fillDataRecursivelyChecked(i.children);
  //     }
  //   }
  // }


  // fillDataRecursively(obj: any, list: SampleObject[]) {
  //   if (obj == null) {
  //     return;
  //   }
  //   else {
  //     for (const i of obj) {
  //       const text = i.item.siteName;
  //       const value = i.item.siteId;

  //       const item1: SampleObject = new SampleObject();
  //       item1.text = text;
  //       item1.value = value;
  //       item1.checked = false;     ///////////////////////////////////////////// //////////
  //       if (i.children.length > 0)
  //         item1.children = new Array<SampleObject>();
  //       list.push(item1);
  //       this.fillDataRecursively(i.children, item1.children);
  //     }
  //   }
  // }
  public LoadAllSitesRefData(organId) {
    if (organId == null) {
      this.disableSiteSelection = true;
      return;
    }
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageOrganizationsService
      .LoadAllSitesRefDataByOrgn(organId)
      .subscribe(response => {

        this.selectedRoles = [];
        this.selectedReportRoles = null;

        if (this.orgnTypeId !== OrganizationTypeEnum.Ancera.valueOf()) {
          this.lstRoles = response.dataObject.lstRoleVM || [];
          this.lstReportRoles = response.dataObject.lstReportRoleVM || [];
        }

        this.lstAllUserSitesIDs = response.dataObject.lstUserSiteIDs;
        this.lstAllTestingSitesIDs = response.dataObject.lstTestingSiteIDs;
        this.lstAllCollectionSitesIDs = response.dataObject.lstCollectionSitesIDs;
        this.lstAllExtraSitesIDs = response.dataObject.lstExtraSitesIDs;

        let allSites = [...this.lstAllSites];
        for (let i = 0; i < this.lstTestingSites.length; i++) {
          let ind = allSites.indexOf(this.lstTestingSites[i]);
          allSites.splice(ind, 1);
        }

        this.values = [];
        for (let i = 0; i < this.lstAllUserSitesIDs.length; i++) {
          if (allSites.includes(this.lstAllUserSitesIDs[i])) {
            this.values.push(this.lstAllUserSitesIDs[i]);
            let ind = allSites.indexOf(this.lstAllUserSitesIDs[i]);
            allSites.splice(ind, 1);
          }
        }
        this.lstClientSites = allSites;


        this.disableSiteSelection = false;
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      });
  }

  populateSitelist(organId, setPlaceholderForSites: boolean) {

    const OrganizationID = {
      id: organId
    }
    this.lstSitesFiltered = this.lstSites.filter(
      rec => rec.tag === organId);
    if (setPlaceholderForSites === true) {

      this.ClearSitesList();

    }

  }

  ClearSitesList() {
    this.selectedValueSite = null;
    // this.values = [];

  }

  selectedOrgType(orgnTypeId, setPlaceholder: boolean) {
    
    // this.taggedData = [];
    if (orgnTypeId == 2 && this.accountService.user.userOrgnTypeId == 2 && setPlaceholder) {
      if (this.selectedClients.length == 0) {
        this.selectedClients = [this.accountService.user.userOrgnId];

      }
      else {
        this.selectedClients.push(this.accountService.user.userOrgnId);
      }
    }
    // this.values = [];
    this.lstSitesFiltered = [];
    this.itemsLst = [];
    this.form.controls['fcOrganization'].markAsUntouched();
    this.lstOrganizationsFiltered = this.lstOrganizations.filter(
      rec => rec.tag === orgnTypeId);
    if (setPlaceholder === true) {

      this.selectedValueOrganization = null;
      this.ClearSitesList();
    }


  }

  selectedOrg(orgnId, setPlaceholder: boolean) {
    
    this.form.get('fcRoleId').patchValue([]);
    this.form.get('fcReportRoleId').patchValue([]);
    this.lstRolesFiltered = new Array<SelectBox>;
    this.lstReportRolesFiltered =new Array<SelectBox>;
    let commaSeparatedRolesGivenToOrganization: Array<any>;
    let commaSeparatedReportRolesGivenToOrganization: Array<any>;
    //this.lstRoles

    //organizationId
    //commaSeparatedUserRoleIds

    //commaSeparatedRolesGivenToOrganization
    let ids = this.lstOrganizationWiseUserRoles.filter(x => x.organizationId === orgnId).map(item => {
      return item.commaSeparatedUserRoleIds;
    })[0];
    if (ids != null) {
      commaSeparatedRolesGivenToOrganization = ids.split(",")
      for (let i = 0; i < commaSeparatedRolesGivenToOrganization.length; i++) {
        this.lstRoles.map((data) => {
          if (data.code === commaSeparatedRolesGivenToOrganization[i]) {
            this.lstRolesFiltered.push(data);
          }
        })
      }
      
    } else {
      this.lstRolesFiltered = this.lstRoles.slice()
      this.lstReportRolesFiltered = this.lstReportRoles.slice();
    }

    ids = this.lstOrganizationWiseUserReportRoles.filter(x => x.organizationId === orgnId).map(item => {
      return item.commaSeparatedUserRoleIds;
    })[0];
    if (ids != null) {
      commaSeparatedReportRolesGivenToOrganization = ids.split(",")
      for (let i = 0; i < commaSeparatedReportRolesGivenToOrganization.length; i++) {
        this.lstReportRoles.map((data) => {
          if (data.code == commaSeparatedReportRolesGivenToOrganization[i]) {
            this.lstReportRolesFiltered.push(data);
          }
        })
      }
      
    } else {
      this.lstReportRolesFiltered = this.lstReportRoles.slice();
    }

    

  }


  refreshPipersList() {
    this.lstPipers = [];
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageOrganizationsService
      .RefreshPiperList()
      .subscribe(response => {
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT)
        this.lstPipers = response.dataObject;
      });
  }

  setNgSelectGroupWidth() {
    const width = this.NgSelectGroupContainerRef.nativeElement.offsetWidth;
  }

  setNgSelectIconHeight() {
    const div = this.NgSelectGroupContainerRef.nativeElement;
    const valueContainer = (div.querySelectorAll('.ng-value-container') as HTMLDivElement); //matches all
  }

  public validateStepperNavigation(stepNum) {

    // MEMO: if below will be true message will be shown with each field.
    this.isNavigated = true;

    switch (stepNum) {
      case 1:
        this.isNavigated = false;
        return true;

      case 2:
        if (this.isFieldInValid('fcFirstName') || this.isFieldInValid('fcLastName')
          || this.isFieldInValid('fcPhoneCode') || this.isFieldInValid('fcPhoneNumber')
          || (!this.isDsbld && this.isFieldInValid('fcCellNumber'))) {

          return false;
        } else {
          this.isNavigated = false;
          return true;
        }

      case 3:
        if (this.isFieldInValid('fcFirstName') || this.isFieldInValid('fcLastName')
          || this.isFieldInValid('fcPhoneCode') || this.isFieldInValid('fcPhoneNumber')
          || (!this.isDsbld && this.isFieldInValid('fcCellNumber')) || this.isFieldInValid('fcEmail')
          || this.isFieldInValid('fcOrganizationType') || this.isFieldInValid('fcOrganization')) {
          return false;
        } else {
          this.isNavigated = false;
          return true;
        }

      default:
        break;
    }

  }

  public showActiveStepOfStepper(stepperListParam: any[]) {
  }

  checkSitesSelected() {
    if (this.selectedClients.length == 0 || this.selectedClients == null) {
      this.notEvenCheckedOne = false;
    }
    else {
      for (let i = 0; i < this.selectedClients.length; i++) {
        let foundKey = false;
        for (let j = 0; j < this.savedOrgnAndSites.length; j++) {
          if (this.selectedClients[i] == this.savedOrgnAndSites[j].orgnId && this.savedOrgnAndSites[j].siteId.length > 0) {
            foundKey = true;
          }
        }
        if (!foundKey) {
          this.notEvenCheckedOne = true;
        }
        else {
          this.notEvenCheckedOne = false;
        }
      }
    }
    for (let i = 0; i < this.savedOrgnAndSites.length; i++) {
      let foundKey = false;
      for (let j = 0; j < this.selectedClients.length; j++) {
        if (this.selectedClients[j] == this.savedOrgnAndSites[i].orgnId) {
          foundKey = true;
        }
      }
      if (!foundKey) {
        this.savedOrgnAndSites.splice(i, 1);
        i = i - 1;
      }
    }
    for (let i = 0; i < this.OrgAndSiteIds.length; i++) {
      let foundKey = false;
      for (let j = 0; j < this.selectedClients.length; j++) {
        if (this.selectedClients[j] == this.OrgAndSiteIds[i].orgnId) {
          foundKey = true;
        }
      }
      if (!foundKey) {
        this.OrgAndSiteIds.splice(i, 1);
        i = i - 1;
      }
    }
  }

  removeTree() {

    for (let i = 0; i < this.savedOrgnAndSites.length; i++) {
      let foundKey = false;
      for (let j = 0; j < this.selectedClients.length; j++) {
        if (this.selectedClients[j] == this.savedOrgnAndSites[i].orgnId) {
          foundKey = true;
        }
      }
      if (!foundKey) {
        this.savedOrgnAndSites.splice(i, 1);
        i = i - 1;
      }
    }
    for (let i = 0; i < this.OrgAndSiteIds.length; i++) {
      let foundKey = false;
      for (let j = 0; j < this.selectedClients.length; j++) {
        if (this.selectedClients[j] == this.OrgAndSiteIds[i].orgnId) {
          foundKey = true;
        }
      }
      if (!foundKey) {
        this.OrgAndSiteIds.splice(i, 1);
        i = i - 1;
      }
    }
  }
  saveMapOfSites(Sites, callUpdate) {

    for (let i of Sites) {
      if (this.sitesMap.has(i.orgnId)) {
        this.sitesMap.get(i.orgnId).lstSites.push(i.siteId);
      }
      else {
        this.sitesMap.set(i.orgnId, {
          siteIdOrgnType: 0,
          siteNameOrgnType: "",
          lstSites: [i.siteId]
        })
      }
      if (i.parentSiteId == 0) {
        this.sitesMap.get(i.orgnId).siteIdOrgnType = i.siteId;
        this.sitesMap.get(i.orgnId).siteNameOrgnType = i.siteName;
      }
    }
    if (callUpdate) {
      this.updateSites(this.lstAllSites);
    }
  }
  removeOrgnSites(event) {
    for (let i = 0; i < this.siteDetails.get(event).lstTestingSites.length; i++) {
      let id = this.siteDetails.get(event).lstTestingSites[i];
      let ind = this.lstTestingSites.indexOf(id);
      if (ind > -1) {
        this.lstTestingSites.splice(ind, 1);
      }
      ind = this.lstAllSites.indexOf(id);
      if (ind > -1) {
        this.lstAllSites.splice(ind, 1);
      }

      ind = this.values.indexOf(id);
      if (ind > -1) {
        this.values.splice(ind, 1);
      }

      ind = this.lstClientSites.indexOf(id);
      if (ind > -1) {
        this.lstClientSites.splice(ind, 1);
      }
    }

    for (let i = 0; i < this.siteDetails.get(event).lstCollectionSites.length; i++) {
      let id = this.siteDetails.get(event).lstCollectionSites[i];
      let ind = this.lstTestingSites.indexOf(id);
      if (ind > -1) {
        this.lstTestingSites.splice(ind, 1);
      }
      ind = this.lstAllSites.indexOf(id);
      if (ind > -1) {
        this.lstAllSites.splice(ind, 1);
      }

      ind = this.values.indexOf(id);
      if (ind > -1) {
        this.values.splice(ind, 1);
      }

      ind = this.lstClientSites.indexOf(id);
      if (ind > -1) {
        this.lstClientSites.splice(ind, 1);
      }
    }
    if (this.lstTestingSites.length > 0) {
      this.isPiperUser = true;
    }
    else {
      this.isPiperUser = false;
    }
    this.siteDetails.delete(event);
  }
  loadTaggedData() {
    this.siteDetails = new Map();

    for (let [key, value] of this.sitesMap) {
      for (let site of this.lstAllSites) {
        if (this.sitesMap.get(key).lstSites.includes(site)) {
          let testingSite = false;
          if (this.lstAllTestingSitesIDs.includes(site)) {
            testingSite = true;
          }
          if (!this.siteDetails.has(+key)) {
            if (testingSite) {
              this.siteDetails.set(+key, {
                siteIdOrgnType: this.sitesMap.get(key).siteIdOrgnType,
                siteNameOrgnType: this.sitesMap.get(key).siteNameOrgnType,
                lstCollectionSites: [],
                lstTestingSites: [site]
              })
            }
            else {
              this.siteDetails.set(+key, {
                siteIdOrgnType: this.sitesMap.get(key).siteIdOrgnType,
                siteNameOrgnType: this.sitesMap.get(key).siteNameOrgnType,
                lstCollectionSites: [site],
                lstTestingSites: []
              })
            }
          }
          else {
            if (testingSite) {
              this.siteDetails.get(+key).lstTestingSites.push(site);
            }
            else {
              this.siteDetails.get(+key).lstCollectionSites.push(site);
            }
          }
        }
      }
    }
    this.siteDetails
  }
  updateSites(event) {
    this.lstAllSites = event;
    this.loadTaggedData()
    let allSites = [...this.lstAllSites];

    this.lstTestingSites = [];
    for (let i = 0; i < this.lstAllTestingSitesIDs.length; i++) {
      if (allSites.includes(this.lstAllTestingSitesIDs[i])) {
        this.lstTestingSites.push(this.lstAllTestingSitesIDs[i]);
        let ind = allSites.indexOf(this.lstAllTestingSitesIDs[i]);
        allSites.splice(ind, 1);
      }
    }

    this.values = [];
    for (let i = 0; i < this.lstAllUserSitesIDs.length; i++) {
      if (allSites.includes(this.lstAllUserSitesIDs[i])) {
        this.values.push(this.lstAllUserSitesIDs[i]);
        let ind = allSites.indexOf(this.lstAllUserSitesIDs[i]);
        allSites.splice(ind, 1);
      }
    }

    this.lstClientSites = allSites;
    if (this.lstTestingSites.length > 0) {
      this.isPiperUser = true;
    }
    else {
      this.isPiperUser = false;
    }
    // if(this.lstTestingSites.length > 0){
    //   this.showSiteRequiredErr = false;
    // }
    // else{
    //   this.showSiteRequiredErr = true;
    // }
  }


  sitesLabel() {
    const str = this.translationPipe.getTraslatedValue('userAccount', 'sites');
    return str;
  }

  tabInternalClick(step, value) {
    this.tabClick(step, value);
    // this.form.markAllAsTouched();
  }

  btnInternalClickNext() {
    // this.form.markAsUntouched();
    this.touchedControls();
    this.goNextTab();
  }
  btnInternalClickBack() {
    // this.touchedControls();
    // this.form.markAllAsTouched();
    this.goBackTab();
  }

  touchedControls() {
    switch (this.value) {
      case 'one':
        this.form.controls.fcFirstName.markAsTouched();
        this.form.controls.fcLastName.markAsTouched();
        this.form.controls.fcDesignation.markAsTouched();
        this.form.controls.fcCellCode.markAsTouched();
        this.form.controls.fcCellNumber.markAsTouched();
        this.form.controls.fcPhoneCode.markAsTouched();
        this.form.controls.fcPhoneNumber.markAsTouched();
        this.form.controls.fcEmail.markAsTouched();
        this.form.controls.fcRoleCategoryId.markAsTouched();
        this.form.controls.fcRoleCategoryName.markAsTouched();
        break;
      case 'two':

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

  changeRoleCategory(item) {
    if (item && (item.name || '').toLowerCase() === 'other') {
      this.showRoleCategoryName = true;
      this.form.controls['fcRoleCategoryName'].setValidators([Validators.required, Validators.maxLength(200)]);
      this.form.controls['fcRoleCategoryName'].setValue(null);
      this.form.controls['fcTehsilId'].setValidators([]);
      this.form.controls['fcTehsilId'].setValue(null);

    } else if (item && (item.name || '').toLowerCase() === 'field agent') {
      this.showTehsilId = true;
      this.showRoleCategoryName = false;
      this.form.controls['fcTehsilId'].setValidators([Validators.required]);
      this.form.controls['fcTehsilId'].setValue(null);
      this.form.controls['fcRoleCategoryName'].setValidators(null);
      this.form.controls['fcRoleCategoryName'].setValue(null);
    }

    else if (item && item.name) {
      this.showRoleCategoryName = false;
      this.showTehsilId = false;
      this.form.controls['fcRoleCategoryName'].setValidators([Validators.maxLength(200)]);
      this.form.controls['fcRoleCategoryName'].setValue(item.name);
      this.form.controls['fcTehsilId'].setValidators(null);
      this.form.controls['fcTehsilId'].setValue(null);
    } else {
      this.showRoleCategoryName = false;
      this.showTehsilId = false;
      this.form.controls['fcRoleCategoryName'].setValidators(null);
      this.form.controls['fcRoleCategoryName'].setValue(null);
      this.form.controls['fcTehsilId'].setValidators(null);
      this.form.controls['fcTehsilId'].setValue(null);
    }
    this.form.controls['fcRoleCategoryName'].markAsUntouched();
    this.form.controls['fcRoleCategoryName'].markAsPristine();
  }

}
