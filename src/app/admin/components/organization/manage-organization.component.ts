import { Component, OnInit } from '@angular/core';
import { LookUpVModel } from 'src/app/shared/models/LookUpV.Model';
import { UserModel } from 'src/app/shared/models/users/User.Model';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { CreateOrganizationComponent } from './create-organization.component';
import { OrganizationTypeEnum, STATUS_CODE, ColManageOrganizationsEnum, SCREEN_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { ViewUserModel } from 'src/app/shared/models/users/ViewUser.Model';
import { OrganizationVModel } from 'src/app/shared/models/organization/OrganizationV.Model';
import { ManageOrganizationsService } from 'src/app/shared/services/manage-organizations/manage-organizations.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { PaginationModel } from 'src/app/shared/models/PaginationModel.Model';
import { AlertType, AlertModel, HeaderType } from 'src/app/shared/models/Alert.Model';
import { UpdateOrganizationComponent } from './update-organization.component';

import { AccountService } from 'src/app/shared/services/common/account.service';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { ScreenVPermission } from 'src/app/shared/models/ScreenPermissionV.Model';

@Component({
  selector: 'app-manage-organization',
  templateUrl: './manage-organization.component.html'
})
export class ManageOrganizationComponent extends BaseFormComponent implements OnInit {
  // Search box related working on toggle menu #Start

  // Save values for search
  indexFirst = -1;
  organazationId = -1;
  saveSearchForDisplay = "";
  searchQuery = "";

  // For showing search results
  queryResultsFound = 0; // New
  queryResultsArray = []; // New
  queryResultsArrayLength: number; // New

  showQueryResult = false;
  // For highlighting the search box
  showSearchBoxHighlighting = false;
  // For checking innerToggle is open or not
  innerToggle = false;
  //For filter purpose realted to search when user clear the search box
  valueSearched = false;

  // Search box related working on toggle menu #End

  lstClients: Array<ViewUserModel> = [];
  objClient = new ViewUserModel();
  toggle = {};
  toggle1 = {};
  toggle2 = {};

  showConfirmationFlag: boolean;
  confirmationMessage = "";

  idToDelete: number;
  showSearchBar2: boolean = false;
  showSearchBar1: boolean = false;
  orgColName: string = null;
  orgSort: number = 1;

  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageOrganization;

  constructor(
    protected manageOrganizationsService: ManageOrganizationsService,
    protected router: Router,
    protected popupController: PopupControllerService,
    protected notificationService: NotificationServiceService,
    protected activatedRou: ActivatedRoute, protected translationPipe: TranslationConfigService, protected accountService: AccountService
  ) {

    super(translationPipe, popupController, notificationService, accountService);

  }

  lstUsers: Array<ViewUserModel> = [];

  lstOrganTypes: Array<LookUpVModel> = [];
  lstOrganizations: Array<any> = [];
  lstOrganizationUsers: Array<any> = [];

  pagination: PaginationModel;
  showSearchBar: boolean = false;

  // MEMO: For Role Security
  siteScreenPermission: ScreenVPermission = {
    screenId: 0,
    isCreateAllow: false,
    isUpdateAllow: false,
    isViewAllow: false,

    isCreateButtonAllow: false,
    isEditButtonAllow: false,
    isDeleteButtonAllow: false,
    isViewButtonAllow: false,
    //isEditSaveButtonAllow: false
  };

  ngOnInit() {

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    let userOrgnTypeID = this.accountService.user.userOrgnTypeId;
    // MEMO: For Role Security
    this.screenPermission = this.IsAccessAllowed(this.screen);
    this.siteScreenPermission = this.IsAccessAllowed(SCREEN_CODE.ManageSite);

    this.manageOrganizationsService
      .LoadManageUserScreenMetaData(userOrgnTypeID)
      .subscribe(response => {
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

        this.lstOrganTypes = response.dataObject.lstOrganizationTypes;
        this.queryResultsArrayLength = this.lstOrganTypes.length; // Search Box #New

      });
  }

  SetToggle(indexFirst) {
    this.toggle[indexFirst] = !this.toggle[indexFirst];
    this.ResetToggle(indexFirst);
    this.ResetAllToggle1();

  }
  ResetToggle(indexFirst) {
    for (let i = 0; i < this.lstOrganTypes.length; i++) {
      if (indexFirst !== i) {
        this.toggle[i] = false;
      }
    }

  }

  ResetAllToggle() {

    for (let i = 0; i < this.lstOrganTypes.length; i++) {
      this.toggle[i] = false;
    }
    this.innerToggleClose(); // Search Box #New
    this.DisableSearchChanges(); // Search Box #New
  }

  SetToggle1(i) {

    let j = this.toggle1[i];
    this.ResetAllToggle1();

    this.toggle1[i] = j;
    this.toggle1[i] = !this.toggle1[i];

  }

  ResetAllToggle1() {
    for (let count = 0; count < this.lstOrganizations.length; count++) {

      this.toggle1[count] = false;
    }
  }

  LoadManageOrgansLstData(organTypeid, indexFirst, colName, isAsc, notSorting) {
    // Search box related working on toggle menu #New #Start
    this.organazationId = organTypeid;
    if (this.indexFirst !== indexFirst) {
      this.indexFirst = indexFirst;
      this.innerToggleOpen();
    } else if (this.indexFirst === indexFirst) {
      this.innerToggleClose();
    } else {
      this.innerToggleClose();
    }

    if (!this.valueSearched) {
      this.searchQuery = "";
    }

    // Search box related working on toggle menu #New #End


    if (notSorting) {
      this.SetToggle(indexFirst);
    }
    else {
      // This else is applied to close sub toggles on sorting of organizations  
      this.ResetAllToggle1();
    }
    var objSort = {
      columnName:  colName === "orgnId" ? this.getColManageOrganEnum().orgnName : colName,
      isAscSort: isAsc
    };
    this.orgColName =  colName


    this.lstOrganizations = [];

    if (this.toggle[indexFirst]) {
      this.LoadManageUserOrgansLstDataCall(organTypeid, objSort); // Search Box #New

    
    }
  }
  LoadManageUserOrgansLstData(organTypeid, indexFirst, colName, isAsc, notSorting) {
    // Search box related working on toggle menu #New #Start
    this.organazationId = organTypeid;
    if (this.indexFirst !== indexFirst) {
      this.indexFirst = indexFirst;
      this.innerToggleOpen();
    } else if (this.indexFirst === indexFirst) {
      this.innerToggleClose();
    } else {
      this.innerToggleClose();
    }

    if (!this.valueSearched) {
      this.searchQuery = "";
    }

    // Search box related working on toggle menu #New #End


    if (notSorting) {
      this.SetToggle(indexFirst);
    }
    else {
      // This else is applied to close sub toggles on sorting of organizations  
      this.ResetAllToggle1();
    }
    var objSort = {
      columnName:  colName === "orgnId" ? this.getColManageOrganEnum().orgnName : colName,
      isAscSort: isAsc
    };
    this.orgColName =  colName


    if (this.orgSort !== 2) {
      this.orgSort = 2;
    }
    else {
      this.orgSort = 3;
      objSort.isAscSort = false;
    }

    this.lstOrganizations = [];

    if (this.toggle[indexFirst]) {
      this.LoadManageUserOrgansLstDataCall(organTypeid, objSort); // Search Box #New
    }
  }
  // Search box related working on toggle menu #New #Start

  LoadManageUserOrgansLstDataCall(organTypeid, objSort) {
    this.lstOrganizations = [];
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
    this.manageOrganizationsService
      .LoadManageUserOrgansLstDataSearch(organTypeid, this.searchQuery, objSort)
      .subscribe(response => {
        
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
        this.lstOrganizations = response.dataObject;

        
      });
  }

  // Search box related working on toggle menu #New #Start

  CheckToggle(indexFirst) {
    return this.toggle[indexFirst];
  }

  ShouldShowAnceraUsers(orgnTypeid) {

    return false;

  }


  editOrganization(id) {
    let header = '';
    this.translationPipe
      .getTranslation("dashboard.eidtOrganization", "")
      .subscribe((response) => {
        header = response;
      });
    this.ResetAllToggle();
    this.popupController.updateModalSize('sm');
    this.popupController.popupHeader = header;
    this.popupController.parameters = id;
    this.popupController.updateComponent(UpdateOrganizationComponent);
    // this.router.navigate(["/home/admin/update-user/", id]);
  }

  DeleteOrganization(id) {


    this.translationPipe.getTranslation('Confirm.DeleteOrganization', '').subscribe(response => {
      this.confirmationMessage = response;
    });

    this.showConfirmationFlag = true;
    this.idToDelete = id;

  }

  

  positiveDelete() {
    this.notificationService.loading = true;


    this.manageOrganizationsService.DeleteOrganization(this.idToDelete).subscribe(response => {

      if (response.statusCode === STATUS_CODE.SUCCESS) {

        this.ShowSuccessNotification(response.message);
        this.ResetAllToggle();

        this.showConfirmationFlag = false;
        // this.close();
      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
        this.ShowErrorNotification(response.message);

        // this.close();

      }

      this.notificationService.loading = false;
    });
    this.idToDelete = 0;

  }



  createOrganization() {
    let header = '';
    this.translationPipe
      .getTranslation("dashboard.createOrganization", "")
      .subscribe((response) => {
        header = response;
      });
    // this.router.navigate(["/home/admin/create-user"]);
    this.popupController.updateModalSize('sm');
    this.popupController.popupHeader = header;
    this.ResetAllToggle();
    this.popupController.updateComponent(CreateOrganizationComponent);

  }

  onPageChange(event) {

    this.pagination.activePageNumber = event;
    this.notificationService.loading = true;
    this.manageOrganizationsService
      .getUserByPageNo(this.pagination.activePageNumber)
      .subscribe(data => {
        this.notificationService.loading = false;
        this.lstUsers = data.data['lstUsers'];
        this.pagination.pageSize = data.data['pageSize'];
        this.pagination.totalResult = data.data['pageSize'];

      });
  }
  getColManageOrganEnum() {
    return ColManageOrganizationsEnum;
  }
  // Search box related working on toggle menu #New #Start
  searchByUser() {
    let searchValue = (<HTMLInputElement>(
      document.getElementById("organSearchId")
    )).value;

    if (searchValue === "") {
      return false;
    }

    this.showQueryResult = false;
    this.initializaQueryResultsArray();

    this.manageOrganizationsService
      .LoadSearchOrganizationByTypeCount(searchValue)
      .subscribe(response => {

        const organByTypeCount: any[] = response.dataObject;
        const arrLength = organByTypeCount.length;

        if (arrLength >= 1) {
          this.queryResultsFound = organByTypeCount[arrLength - 1].totalCount;
        }

        if (arrLength > 1) {
          for (let i = 0; i < arrLength - 1; i++) {
            // tslint:disable-next-line: prefer-for-of
            for (let j = 0; j < this.queryResultsArray.length; j++) {
              if (
                this.queryResultsArray[j].typeId === organByTypeCount[i].typeId
              ) {
                this.queryResultsArray[j].count = organByTypeCount[i].count;
              }
            }
          }
        }

        this.showQueryResult = true;
      });

    this.EnableSearchChanges(searchValue);
    if (this.toggle[this.indexFirst]) {
      let objSort = {
        columnName: "orgnName",
        isAscSort: true
      };
      this.LoadManageUserOrgansLstDataCall(this.organazationId, objSort);
    }
  }

  resetSearchByUser() {
    this.DisableSearchChanges();
    if (this.toggle[this.indexFirst]) {
      let objSort = {
        columnName: "orgnName",
        isAscSort: true
      };

      this.LoadManageUserOrgansLstDataCall(this.organazationId, objSort);
    }
  }

  onKeyUp() {
    const searchValue = (document.getElementById(
      "organSearchId"
    ) as HTMLInputElement).value;
    this.showSearchBoxHighlighting = searchValue !== "" ? true : false;  // OLD

    if (searchValue === "") {
      if (this.valueSearched && this.innerToggle) {
        this.searchQuery = '';
        var objSort = {
          columnName: "orgnName",
          isAscSort: true
        };
        this.LoadManageUserOrgansLstDataCall(this.organazationId, objSort);
      }
      this.DisableSearchChanges();
    }
  }

  innerToggleOpen() {
    this.innerToggle = true;
  }
  innerToggleClose() {
    this.indexFirst = -1;
    this.innerToggle = false;
  }

  EnableSearchChanges(searchValue: string) {
    this.searchQuery = searchValue;
    this.saveSearchForDisplay = searchValue;
    this.valueSearched = true;
  }

  DisableSearchChanges() {
    this.searchQuery = "";
    this.saveSearchForDisplay = "";
    this.showQueryResult = false;
    this.valueSearched = false;
  }

  initializaQueryResultsArray() {
    this.queryResultsFound = 0;
    this.queryResultsArray = [];
    if (this.queryResultsArrayLength > 0) {
      for (let i = 0; i < this.queryResultsArrayLength; i++) {
        const obj = { typeId: this.lstOrganTypes[i].id, count: 0 };
        this.queryResultsArray.push(obj);
      }
    }
  }

  // Search box related working on toggle menu #New #End
}
