import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { OrganizationTypeEnum, STATUS_CODE } from 'src/app/shared/helper/Enums';
import { AlertModel, AlertType, HeaderType } from 'src/app/shared/models/Alert.Model';
import { UserVModel } from 'src/app/shared/models/users/UserV.Model';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { ShareReportFieldsService } from 'src/app/shared/services/common/share-report-fields.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ManageOrganizationsService } from 'src/app/shared/services/manage-organizations/manage-organizations.service';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import { UserAccountService } from 'src/app/shared/services/user-account-services/user-account.service';

@Component({
  selector: 'app-user-roles-rights',
  templateUrl: './user-roles-rights.component.html',
  styleUrls: ['./user-roles-rights.component.scss']
})
export class UserRolesRightsComponent extends BaseFormComponent implements OnInit {

  form: UntypedFormGroup;

  lstOrganizations = [];
  lstRoles = [];
  lstReportRoles = [];
  lstSites = [];

  selectedValueOrganization;
  selectedRoles = [];
  selectedReportRoles;

  lstAllUserSitesIDs = [];
  lstAllCollectionSitesIDs = [];
  lstAllExtraSitesIDs = [];
  lstAllTestingSitesIDs = [];

  lstAllSites = [];
  sitesMap = new Map()
  siteDetails = new Map();
  taggedData: any = [];

  lstTestingSites = [];
  lstClientSites = [];

  values: number[];

  OrgAndSiteIds = [];
  savedOrgnAndSites = [];
  lstUserSitesAssn: any;

  mainScreenObj = null;
  userVModel: UserVModel;

  boldText = '';
  disableBold = true;
  apiParam = null;
  disableSiteSelection = true;
  showSitesTree = false;
  isSiteAdmin = false;
  orgnTypeId = 0;
  orgnId = 0;
  roleClearable = true;
  constructor(
    private userAccountService: UserAccountService,
    protected popupController: PopupControllerService,
    protected notificationService: NotificationServiceService,
    protected accountService: AccountService,
    protected manageReportService: ManageReportService,
    private datePipe: DatePipe,
    private reportFieldsService: ShareReportFieldsService,
    protected formBuilder: UntypedFormBuilder,
    private translationService: TranslationConfigService,
    private manageOrganizationsService: ManageOrganizationsService,
  ) {
    super(translationService, popupController, notificationService, accountService);
  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit() {

    this.mainScreenObj = this.popupController.getParams() as object;

    this.resetForm();
    this.notification.loading = true;

    this.orgnTypeId = this.accountService.user.userOrgnTypeId;

    this.userAccountService
      .loadRefDataUsersRoleRights()
      .subscribe(response => {
        
        if (this.orgnTypeId === OrganizationTypeEnum.Ancera.valueOf()) {
          this.lstOrganizations = response.dataObject.lstOrganizationVM;
          this.orgnId = 0;
        } else if (this.orgnTypeId !== OrganizationTypeEnum.Ancera.valueOf()) {
          this.orgnId = this.accountService.user.userOrgnId;
          let obj = response.dataObject.lstOrganizationVM.find(x => x.codeID === this.orgnId);
          let arr = [];
          if (obj) {
            arr.push(obj);
          }
          this.lstOrganizations = arr.slice();
        }
        // if (this.orgnTypeId === OrganizationTypeEnum.Ancera.valueOf()) {
        this.lstRoles = response.dataObject.lstRoleVM || [];
        this.lstReportRoles = response.dataObject.lstReportRoleVM || [];
        // }
        this.lstSites = response.dataObject.lstSiteVM;
        this.saveMapOfSites(this.lstSites, false);
        if (this.mainScreenObj.bulk) {
          this.notification.loading = false;
          this.disableBold = true;
          if (this.orgnTypeId !== OrganizationTypeEnum.Ancera.valueOf()) {
            this.lstRoles = [];
            this.lstReportRoles = [];
          }
        } else {
          this.disableBold = false;
          this.userAccountService.LoadUserData(this.mainScreenObj.userIds[0]).subscribe(data => {
            
            this.roleClearable = false;
            this.userVModel = data.dataObject;
            if (this.orgnTypeId !== OrganizationTypeEnum.Ancera.valueOf()) {
              this.lstRoles = [];
              this.lstRoles = data.dataObject.lstRoleVM;
              this.lstReportRoles = [];
              this.lstReportRoles = data.dataObject.lstReportRoleVM;

              this.lstRoles.forEach(element => {
                let obj = this.userVModel.lstRoleIDS.includes(element.codeID);
                if (obj) {
                  element.allowRemove = true;
                }
              });

            }

            this.OrgAndSiteIds = this.userVModel.orgSites;
            this.lstUserSitesAssn = this.userVModel.lstUserSitesAssn;
            let sites = [];
            for (let i = 0; i < this.lstUserSitesAssn.length; i++) {
              sites.push(this.lstUserSitesAssn[i].siteId);
            }
            this.lstTestingSites = sites;
            this.taggedData = this.lstUserSitesAssn;
            this.savedOrgnAndSites = [];
            if (this.OrgAndSiteIds) {
              for (let i = 0; i < this.OrgAndSiteIds.length; i++) {
                this.savedOrgnAndSites.push({
                  userId: this.OrgAndSiteIds[i].userId,
                  orgnId: this.OrgAndSiteIds[i].orgnId,
                  siteId: this.OrgAndSiteIds[i].siteId
                });
              }
            }
            if (this.OrgAndSiteIds) {
              for (let i = 0; i < this.OrgAndSiteIds.length; i++) {
                this.lstClientSites = this.OrgAndSiteIds[i].siteId.concat(this.lstClientSites);
              }
            }
            this.lstAllUserSitesIDs = data.dataObject.lstUserSiteIDs;
            this.lstAllTestingSitesIDs = data.dataObject.lstTestingSiteIDs;
            this.lstAllCollectionSitesIDs = data.dataObject.lstCollectionSitesIDs;
            this.lstAllExtraSitesIDs = data.dataObject.lstExtraSitesIDs;
            this.lstAllSites = this.lstTestingSites.concat(this.userVModel.lstSiteIDS, this.lstClientSites);
            this.saveMapOfSites(this.lstSites, true)
            this.values = this.userVModel.lstSiteIDS;
            this.disableSiteSelection = false;
            this.FillFCFromModel();
            this.notification.loading = false;
          });
        }



      });
  }

  resetForm() {

    // MEMO: END To select the placeholder below is the workaround.

    this.form = this.formBuilder.group({

      fcOrganization: ['', [Validators.required]],
      fcRoleId: ['', [Validators.required]],
      fcReportRoleId: [''],

    });

  }

  FillFCFromModel() {

    this.form = this.formBuilder.group({

      fcOrganization: [this.userVModel.userOrgnId, [Validators.required]],
      fcRoleId: [this.userVModel.lstRoleIDS, [Validators.required]],
      fcReportRoleId: [this.userVModel.lstReportRoleIDS[0]],  // Due to report-role fields access this implementation change from list to single object at front-end but it doesn't change on backend. IE-437
    });


    this.selectedValueOrganization = this.userVModel.userOrgnId;

    this.selectedRoles = this.userVModel.lstRoleIDS;
    this.selectedReportRoles = this.userVModel.lstReportRoleIDS[0]; // Due to report-role fields access this implementation change from list to single object at front-end but it doesn't change on backend. IE-437

  }

  public selectAllRoles(e) {
    if (e.target.checked) {
      const selected = this.lstRoles.map(item => item.codeID);
      this.form.get('fcRoleId').patchValue(selected);
    } else {
      this.form.get('fcRoleId').patchValue([]);
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
    // if (this.lstTestingSites.length > 0) {
    //   this.isPiperUser = true;
    // }
    // else {
    //   this.isPiperUser = false;
    // }

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
    // this.siteDetails
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
    // if (this.lstTestingSites.length > 0) {
    //   this.isPiperUser = true;
    // }
    // else {
    //   this.isPiperUser = false;
    // }
    this.siteDetails.delete(event);
  }

  submit({

    fcOrganization,
    fcRoleId,
    fcReportRoleId,

  }) {

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return;
    }

    if (this.mainScreenObj.bulk && this.lstClientSites.length == 0 && this.lstTestingSites.length == 0) {
      let msg = this.translationService.getTraslatedValue("userRolesRights", "missingSitesValidations");
      const alertEr: AlertModel = { type: AlertType.DANGER, message: msg, header: HeaderType.ERROR, isUserExplicitEvent: true };
      this.notification.showNotification(alertEr);
      return
    }
    const user: any = {
      userOrgnId: fcOrganization,
      lstRoleIDS: fcRoleId,
      lstReportRoleIDS: fcReportRoleId ? [fcReportRoleId] : [],  // Due to report-role fields access this implementation change from list to single object at front-end but it doesn't change on backend. IE-437
      lstOrganizationIDS: [],
      lstSiteIDS: this.values,
      lstEulaIDS: [],
      lstPiperIDS: [],
      orgSites: this.OrgAndSiteIds || [],
      lstTestSitesIDS: this.lstTestingSites || [],
      lstClientIDS: this.lstClientSites || [],
      lstUserIDs: this.mainScreenObj.userIds
    };
    this.apiParam = user;

    if (this.mainScreenObj.bulk) {
      this.boldText = '';
      this.confirmationMessage = '';
      this.confirmationMessage = this.confirmationMessage + this.translationService.getTraslatedValue("userRolesRights", "confirmMultipleRoleRights");
      this.confirmationMessage = this.confirmationMessage + this.translationService.getTraslatedValue("symbols", "questionMark");

    } else {
      this.boldText = '';
      this.boldText = (' ' + this.mainScreenObj.name || '');
      this.confirmationMessage = '';
      this.confirmationMessage = this.translationService.getTraslatedValue("userRolesRights", "confirmSingleRoleRights");
      this.confirmationMessage = this.confirmationMessage + this.boldText;
      this.confirmationMessage = this.confirmationMessage + this.translationService.getTraslatedValue("symbols", "questionMark");
    }
    this.showConfirmationFlag = true;


  }

  saveDataToServer() {
    this.notification.loading = true;
    this.userAccountService.updateUserRolesAndRights(this.apiParam).subscribe(response => {

      if (response.statusCode === STATUS_CODE.SUCCESS) {
        this.popupController.updateResult(true);
        response.message = this.translationService.getTraslatedValue("userRolesRights", "rolesRightsUpdated");
        this.ProcessSaveSuccess(response);
      } else {

        this.ProcessSaveFail(response);
        this.notification.loading = false;
      }
    });
  }

  public LoadAllSitesRefData(organId) {
    if (organId == null) {
      this.disableSiteSelection = true;
      return;
    }
    this.notification.loading = true;
    this.manageOrganizationsService
      .LoadAllSitesRefDataByOrgn(organId)
      .subscribe(response => {
        
        this.selectedRoles = [];
        this.selectedReportRoles = [];

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
        this.notification.loading = false;
      });
  }

}
