import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { API_CALLEVENTGROUP_CODE, SCREEN_CODE } from 'src/app/shared/helper/Enums';
import { PaginationModel } from 'src/app/shared/models/PaginationModel.Model';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import { CanopyCaverageService } from 'src/app/shared/services/common/canopy-caverage.service';
import { CreatecanopyComponent } from './create-canopy.component';
import { UpdateCanopyComponent } from './update-canopy.component';

@Component({
  selector: 'app-canopy-coverage',
  templateUrl: './canopy-coverage.component.html',
  styleUrls: ['./canopy-coverage.component.scss']
})
export class CanopyCoverageComponent extends BaseFormComponent implements OnInit {
  screen = SCREEN_CODE.CanopyManagement;
  rowNumber = 0;
  pageNumber = 1;
  activePageNumber = 1;
  rowsOfPage = 100;
  totalRecords = 0;
  maxPageCount = 0;
  orderBy: any;
  disabledDragScroll = false;

  showConfirmationFlag: boolean;
  confirmationMessage = '';
  idToDelete: number;
  canopyCoverageList: Array<any> = [];
  pagination: PaginationModel;
  showSearchBar = false;
  roleColName: string = null;
  roleSort: number = 1;
  closeSubscription: any;
  cropCanopyData: Array<any>;


  filterKeysForArray = {
    userRoleName: 'userFirstName'

  };

  filterKeysForLockInDB = {
    userRoleName: 'userRoleNames'

  };

  filterKeysForOperators = {
    userRoleName: 'userRoleNames'
  };
  filterArraysNObjs: any = {};
  filterTrackerArraysNObjs: any = {};
  filterWildCard: any = {};
  filterTrackerWildCard: any = {};
  filterOptions = {};
  filterOptionsCounts = {};
  resetFilter = {};
  lstIsFilterLoaded = {};
  lstFiltersOpenClose = {};
  lstFiltersApplied = {};
  filterCleared = false;
  resetFilterCount = -1;
  saveFilters = false;
  selectedValuesArrays: any = {};
  selectedValueWildcard: any = {};
  selectedOperatorWildcard: any = {};

  tableHeaderData: any;
  rightAlignFields = [];
  isDataLoaded = false;
  constructor(
    private canopyCoverageService: CanopyCaverageService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected notification: NotificationServiceService,
    protected accountService: AccountService,
    protected manageReportService: ManageReportService,


  ) {

    super(translationPipe, popupController, notification, accountService);
    let domList;
    domList = document.querySelectorAll("body, .app-header, .screen-title");
    for (let i = 0; i < domList.length; ++i) {
      domList[i].classList.add('background-white');
    }
    domList = document.querySelectorAll("body, .app-header, .heading-text, .screen-name");
    for (let i = 0; i < domList.length; ++i) {
      domList[i].classList.add('background-white');
      domList[i].classList.add('data-log');
    }
  }


  ngOnInit() {
    
    
    this.closeSubscription = this.popupController.close.subscribe((item) => {

      if (item !== null && item !== false) {
        this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
        this.getData();
        this.popupController.updateResult(null);
      }

    });
    // MEMO: For Role Security
    this.screenPermission = this.IsAccessAllowed(this.screen);

    // this.setTableHeaders();


    for (const keys in this.filterKeysForArray) {
      this.filterArraysNObjs[keys] = [];
      this.filterWildCard[keys] = 0;
      this.filterTrackerArraysNObjs[keys] = [];
      this.filterTrackerWildCard[keys] = 0;
      this.selectedValuesArrays[keys] = [];

      this.selectedValueWildcard[keys] = [];
      this.selectedOperatorWildcard[keys] = [];

      this.filterOptions[keys] = [];
      this.filterOptionsCounts[keys] = [];
      this.resetFilter[keys] = false;
      this.lstFiltersOpenClose[keys] = false;
      this.lstFiltersApplied[keys] = false;
      this.lstIsFilterLoaded[keys] = false;
    }


    // this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    // this.manageRoleService
    //   .LoadManageRolesMetaData()
    //   .subscribe(response => {

    //     this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    //     this.lstRoles = response.dataObject;

    //   });

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
    this.manageReportService.getLockedFiltersAdmin(this.screen).subscribe((responseFilters) => {

      this.saveFilters = responseFilters.dataObject.isFilterSaved;
      // this.lstLookupAssigned = responseFilters.dataObject.lstLookupAssigned;
      // this.lstAdminUserAssigned = responseFilters.dataObject.lstAdminUserAssigned;

      // this.setRenderableFields();

      if (this.saveFilters) {
        for (let keys in this.filterKeysForArray) {

          if (responseFilters.dataObject.lockFiltersAdmin[this.filterKeysForLockInDB[keys]] !== undefined &&
            responseFilters.dataObject.lockFiltersAdmin[this.filterKeysForLockInDB[keys]] !== null &&
            responseFilters.dataObject.lockFiltersAdmin[this.filterKeysForLockInDB[keys]][0] !== '') {

            let val = responseFilters.dataObject.lockFiltersAdmin[this.filterKeysForLockInDB[keys]].includes('#replace_empty_str#') ?
              responseFilters.dataObject.lockFiltersAdmin[this.filterKeysForLockInDB[keys]].map(function (x) { return x.replace(/#replace_empty_str#/g, ''); }) :
              responseFilters.dataObject.lockFiltersAdmin[this.filterKeysForLockInDB[keys]];
            this.filterArraysNObjs[keys] = (val);
            this.filterTrackerArraysNObjs[keys] = (val);
            this.selectedValuesArrays[keys] = val;
            this.selectedValueWildcard[keys] = val;

            this.filterWildCard[keys] = responseFilters.dataObject.lockFiltersOperatorAdmin[this.filterKeysForOperators[keys]];
            this.filterTrackerWildCard[keys] = responseFilters.dataObject.lockFiltersOperatorAdmin[this.filterKeysForOperators[keys]];
            this.selectedOperatorWildcard[keys] = responseFilters.dataObject.lockFiltersOperatorAdmin[this.filterKeysForOperators[keys]];
            this.lstFiltersApplied[keys] = true;

          }
        }

        this.markFalseLstIsFilterLoaded();
        this.execMainDataSetResponse();
      }
      else {
        this.execMainDataSetResponse();
      }
    });


  }



  createCanopy() {
    let header = '';
    this.translationPipe
      .getTranslation("Add Canopy Benchmark", "")
      .subscribe((response) => {
        header = response;
      });

    this.popupController.updateModalSize('md');
    this.popupController.popupHeader = header;
    this.popupController.updateComponent(CreatecanopyComponent);
  }

  getProfileView() {
    return this.accountService.getProfileStatus();
  }
  getData() {
    let param = this.getFiltersObjectForPagination();
    this.canopyCoverageService
      .getAllCanopyCoverageData({}).subscribe((responseData) => {


        this.canopyCoverageList = responseData.dataObject.canopyCoverageList || [];

        this.totalRecords = this.canopyCoverageList.length;
        this.isDataLoaded = true;
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

      });

  }

  getFiltersObjectForPagination() {
    return {

      userRoleNames: this.filterTrackerArraysNObjs.userRoleName,
      userRoleNamesWC: this.filterTrackerWildCard.userRoleName,


      ieScreenID: this.screen,
      pageNumber: this.pageNumber,
      rowNumber: this.rowNumber,
      orderBy: this.orderBy,
      CSV: false,
      isFromWeb: true
    };

  }

  execMainDataSetResponse() {
    this.getData();
  }

  markFalseLstIsFilterLoaded() {
    for (const keys in this.filterKeysForArray) {
      this.lstIsFilterLoaded[keys] = false;
    }

    function extractMonthFromDate(dateString) {
      try {
        // Parse the date string into a Date object
        const dateObject = new Date(dateString);

        // Extract the month from the Date object
        const month = dateObject.toLocaleString('default', { month: 'long' }); // Use 'short' for abbreviated month names

        return month;
      } catch (error) {
        // Handle the case where the date string is not in the expected format
        return null;
      }
    }
  }


  editCropCanopyCoverage(id) {

    
    let header = '';
    this.translationPipe
      .getTranslation("Edit Canopy BenchMark", "")
      .subscribe((response) => {
        header = response;
      });
    const update = {
      id: id
    }
    this.popupController.updateModalSize('sm');
    this.popupController.popupHeader = header;
    this.popupController.parameters = update;
    this.popupController.updateComponent(UpdateCanopyComponent);
  }


}
