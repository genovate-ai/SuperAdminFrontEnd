import { Component, OnInit } from '@angular/core';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { ManageRoleService } from 'src/app/shared/services/manage-role-services/manage-role-service.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { PaginationModel } from 'src/app/shared/models/PaginationModel.Model';
import { CreateRoleComponent } from './create-role.component';
import { UpdateRoleComponent } from './update-role.component';
import { CreateRightsComponent } from './create-rights.component';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AccountService } from 'src/app/shared/services/common/account.service';

import { STATUS_CODE, ColManageRolesEnum, SCREEN_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { ViewAllUsersComponent } from './view-allusers.component';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html'
})
export class ManageRoleComponent extends BaseFormComponent implements OnInit {

  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageRole;
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
  lstRoles: Array<any> = [];
  pagination: PaginationModel;
  showSearchBar = false;
  roleColName: string = null;
  roleSort: number = 1;
  closeSubscription: any;


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
    private manageRoleService: ManageRoleService,
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
    // this.closeSubscription = this.popupController.close.subscribe((item) => this.updateParentValue(item));
    this.closeSubscription = this.popupController.close.subscribe((item) => {

      if (item !== null && item !== false) {
        this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
        this.getData();
        this.markFalseLstIsFilterLoaded();
        this.popupController.updateResult(null);
      }

    });
    // MEMO: For Role Security
    this.screenPermission = this.IsAccessAllowed(this.screen);

    this.setTableHeaders();


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
  markFalseLstIsFilterLoaded() {
    for (const keys in this.filterKeysForArray) {
      this.lstIsFilterLoaded[keys] = false;
    }
  }


  execMainDataSetResponse() {
    this.getData();
  }

  getData() {
    let param = this.getFiltersObjectForPagination();
    this.manageRoleService
      .getAllRolesByFilter(param).subscribe((responseData) => {


        this.lstRoles = responseData.dataObject.lstRoles || [];

        this.totalRecords = this.lstRoles.length;
        // this.maxPageCount = Math.ceil(this.totalRecords / this.rowNumber);

        this.isDataLoaded = true;
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

      });

  }
  editRole(id) {
    let header = '';
    this.translationPipe
      .getTranslation("manageRole.editrole", "")
      .subscribe((response) => {
        header = response;
      });

    this.popupController.updateModalSize('sm');
    this.popupController.popupHeader = header;
    this.popupController.parameters = id;
    this.popupController.updateComponent(UpdateRoleComponent);


  }

  editRights(id) {
    this.translationPipe.getTranslation('rights.editrights', '').subscribe(response => {
      this.popupController.popupHeader = response;
    });
    this.popupController.parameters = id;
    this.popupController.updateComponent(CreateRightsComponent);
  }

  DeleteRole(id) {
  }

  positiveDelete() {

  }

  setTableHeaders() {
    this.tableHeaderData = [
      {
        label: this.translationPipe.getTraslatedValue("roles", "roleName"), metaDataLabel: "", field_name: "userRoleName", sort_state: "ascending", icon_type: "alpha",
        langKey: "roles.roleName",
        fieldKey: "userRoleName", valueType: "text", numeric: "", filterType: 'selection', isWildcard: true,
        th: 'min-w-137px w-137px max-w-137px', thDiv: 'min-w-122px w-122px max-w-122px', td: 'min-w-130px w-130px max-w-130px', tdDiv: 'min-w-122px w-122px max-w-122px', padd: '', ml_icon: ''
      },
      {
        label: this.translationPipe.getTraslatedValue("roles", "description"), metaDataLabel: "", field_name: "userRoleDesc", sort_state: "ascending", icon_type: "alpha",
        langKey: "roles.description",
        fieldKey: "userRoleDesc", valueType: "text", numeric: "", filterType: 'none', isWildcard: false,
        th: 'min-w-137px w-137px max-w-137px', thDiv: 'min-w-122px w-122px max-w-122px', td: 'min-w-130px w-130px max-w-130px', tdDiv: 'min-w-122px w-122px max-w-122px', padd: '', ml_icon: ''
      }


    ];
    this.rightAlignFields = this.tableHeaderData.filter((x) => x.numeric == "text-right").map((x) => x.field_name);
  }

  createRole() {
    // this.translationPipe.getTranslation('roles.createrole', '').subscribe(response => {
    //   this.popupController.popupHeader = response;
    //  });
    // this.popupController.updateModalSize('md');
    // this.popupController.updateComponent(CreateRoleComponent);
    let header = '';
    this.translationPipe
      .getTranslation("roles.createrole", "")
      .subscribe((response) => {
        header = response;
      });

    this.popupController.updateModalSize('sm');
    this.popupController.popupHeader = header;
    this.popupController.updateComponent(CreateRoleComponent);
  }

  updateParentValue(value) {

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageRoleService
      .LoadManageRolesMetaData()
      .subscribe(response => {

        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
        this.lstRoles = response.dataObject;

      });

  }

  onPageChange(event) {

  }

  viewUsers(id) {
    this.translationPipe.getTranslation('rights.viewUsers', '').subscribe(response => {
      this.popupController.popupHeader = response;
    });

    this.popupController.updateModalSize('lg');
    this.popupController.parameters = id;
    this.popupController.updateComponent(ViewAllUsersComponent);
  }
  LoadManageRolesLstData(colName, isAsc, notSorting) {

    var objSort = {
      columnName: colName,
      isAscSort: isAsc
    };

    this.roleColName = colName;


    if (this.roleSort !== 2) {
      this.roleSort = 2;
    }
    else {
      this.roleSort = 3;
      objSort.isAscSort = false;
    }

    this.lstRoles = [];

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);

    this.manageRoleService
      .LoadSortedManageRolesMetaData(objSort)
      .subscribe(response => {

        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);

        this.lstRoles = response.dataObject;

      });


  }


  getColManageRoleEnum() {
    return ColManageRolesEnum;
  }
  getProfileView() {
    return this.accountService.getProfileStatus();
  }

  ngOnDestroy() {
    this.closeSubscription.unsubscribe();
  }
  showFilterPopup(filterKey, viewAll = false) {

    if (this.lstFiltersOpenClose[filterKey]) {
      this.closeAllFilterPopups();
      return;
    }

    this.closeAllFilterPopups();

    if (this.lstIsFilterLoaded[filterKey]) {
      this.lstFiltersOpenClose[filterKey] = true;
      return;
    }

    let _param: any = {};

    _param = this.getFiltersObjectForPagination();
    _param['filterName'] = filterKey;
    _param['viewAll'] = viewAll;

    let filterAppliedCount = 0;
    for (const keys in this.filterKeysForArray) {
      if (this.lstFiltersApplied[keys]) {
        filterAppliedCount = filterAppliedCount + 1;
      }
      if (filterAppliedCount > 1) {
        break;
      }
    }

    if (filterAppliedCount === 1 && this.lstFiltersApplied[filterKey]) {
      _param['loadAllOptions'] = true
    }


    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageRoleService.getFilterForUserRoles(_param).subscribe(response => {

      this.filterOptions[filterKey] = response.dataObject.lstFilters || [];
      this.filterOptionsCounts[filterKey] = response.dataObject.filtersCount || 0;
      this.lstFiltersOpenClose[filterKey] = true;
      this.lstIsFilterLoaded[filterKey] = true;
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      this.disabledDragScroll = true;
    });

  }

  closeAllFilterPopups() {

    for (const keys in this.filterKeysForArray) {
      this.lstFiltersOpenClose[keys] = false;
    }

    this.disabledDragScroll = false;
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
  clickedOutsideFilterDialog(fieldKey) {
    setTimeout(() => {
      // this.disabledDragScroll = false;
    }, 0);
    this.lstFiltersOpenClose[fieldKey] = false;
  }


  wildcardSearch(obj, filterKey) {

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.closeAllFilterPopups();
    this.lstFiltersApplied[filterKey] = true;

    this.filterArraysNObjs[filterKey] = obj.value;
    this.filterWildCard[filterKey] = obj.wildcard;

    for (const keys in this.filterKeysForArray) {
      this.filterTrackerArraysNObjs[keys] = this.filterArraysNObjs[keys];
      this.filterTrackerWildCard[keys] = this.filterWildCard[keys];
    }
    this.markFalseLstIsFilterLoaded();
    this.saveFilterstoDB();
    this.getData();
  }

  saveFilterstoDB() {

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

    if (this.saveFilters) {
      this.manageReportService.saveLockedFiltersAdmin(this.getObjectForFiltersPersist()).subscribe(response => {
        this.saveFilters = true;
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

      });
    }
  }
  getObjectForFiltersPersist() {

    return {
      lockFiltersAdmin: {
        userRoleNames: this.filterTrackerArraysNObjs.userRoleName,
        userRoleNamesWC: this.filterTrackerWildCard.userRoleName,



        ieScreenID: this.screen,

      },

      lockFiltersOperatorAdmin: {
        userRoleNames: this.filterTrackerWildCard.userRoleName,



      }
    };
  }

  applyListofFilters(list: Array<any>, filterKey) {

    if (this.resetFilterCount > 0) {
      this.resetFilterCount = this.resetFilterCount - 1;
      if (this.resetFilterCount === 0) {
        setTimeout(() => {
          for (const keys in this.filterKeysForArray) {
            this.resetFilter[keys] = false;
          }
          for (const keys in this.filterKeysForArray) {
            this.resetFilter[keys] = false;
          }
          this.filterCleared = false;
        }, 0);
      }
      return;
    }
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

    if (!this.filterCleared) {
      this.closeAllFilterPopups();
      this.lstFiltersApplied[filterKey] = true;
      this.markFalseLstIsFilterLoaded();
    } else {
      setTimeout(() => {
        this.closeAllFilterPopups();
        this.lstFiltersApplied[filterKey] = false;
        this.resetFilter[filterKey] = false;
        this.markFalseLstIsFilterLoaded();
      }, 1);
    }
    this.filterCleared = false;

    this.filterArraysNObjs[filterKey] = this.saveStringValuesForFiltersBRVM(list,
      this.filterTrackerArraysNObjs[filterKey]);

    this.filterWildCard[filterKey] = list.length > 0 ? 1 : 0;

    for (const keys in this.filterKeysForArray) {
      this.filterTrackerArraysNObjs[keys] = this.filterArraysNObjs[keys];
      this.filterTrackerWildCard[keys] = this.filterWildCard[keys];
    }


    // this.clearControls();
    this.saveFilterstoDB();
    this.getData();
  }
  saveStringValuesForFiltersBRVM(lstRef: any, filterArrRef: Array<any>) {
    if (lstRef.length > 0) {
      filterArrRef = [];
      lstRef.forEach((d) => {
        switch (d.name.trim()) {
          case '':
            filterArrRef.push('');
            break;
          default:
            filterArrRef.push(d.code);
            break;
        }
      });
    } else {
      filterArrRef = [];
    }
    return filterArrRef;
  }



  clearFilter(filterKey) {

    this.filterCleared = true;
    this.resetFilter[filterKey] = true;

  }

  resetAllFilter() {

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.resetFilterCount = 0;
    this.filterCleared = true;

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
      this.resetFilter[keys] = true;
      this.lstFiltersOpenClose[keys] = false;
      this.lstIsFilterLoaded[keys] = false;
      this.lstFiltersApplied[keys] = false;
    }



    this.saveFilterstoDB();
    this.getData();


  }
  lockFilters() {
    this.saveFilters = true;
    this.saveFilterstoDB();
  }

  removeFiltersfromDB() {
    this.saveFilters = false;
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

    this.manageReportService.removeAdminFiltersfromDB(this.screen).subscribe(response => {
      this.saveFilters = false;
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

    });
  }

  clearListOfComponent(list, filterKey) {

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

    this.filterArraysNObjs[filterKey] = this.saveStringValuesForFiltersBRVM(list,
      this.filterTrackerArraysNObjs[filterKey]);
    this.filterWildCard[filterKey] = list.length > 0 ? 1 : 0;

    for (const keys in this.filterKeysForArray) {
      this.filterTrackerArraysNObjs[keys] = this.filterArraysNObjs[keys];
      this.filterTrackerWildCard[keys] = this.filterWildCard[keys];
    }

    // setTimeout(() => {
    this.lstFiltersApplied[filterKey] = false;
    this.markFalseLstIsFilterLoaded();
    // }, 1);
    this.closeAllFilterPopups();

    this.saveFilterstoDB();
    this.getData();
  }

  onLoader(val) {
    if (val)
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    else
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
  }

  applySort(event, thSort, item, i) {

    event.stopPropagation();
    let th = d3.select(thSort);
    let field_name = th.attr('data-field_name');
    let sort_state = th.attr('data-sort_state');
    let icon_type = th.attr('data-icon_type');


    d3.selectAll('#table-header-user-log th')
      .selectAll('span.th-sort-img')
      .style('visibility', 'hidden')
      .style('opacity', '0');

    this.orderBy = field_name + ' ' + (sort_state === "ascending" ? "desc" : "asc");
    sort_state = sort_state === 'ascending' ? 'descending' : 'ascending';
    const isAscendingOrder = sort_state === 'ascending';

    th.attr('data-sort_state', sort_state);

    const sortIconArr = ['fas fa-sort-amount-down-alt', 'fas fa-sort-amount-down']

    const activeSpan = th
      .select('span.th-sort-img')
      .style('visibility', 'visible')
      .style('opacity', '1')
      .select('i')
      .attr('class', '')
      .attr('class', () => {
        return isAscendingOrder ? sortIconArr[0] : sortIconArr[1];
      });

    d3.select(thSort).classed('sort_asc', false);
    d3.select(thSort).classed('sort_desc', false);

    // if (imgSrc.length > 0) {
    if (isAscendingOrder) {
      d3.select(thSort).classed('sort_asc', true);
    } else {
      d3.select(thSort).classed('sort_desc', true);
    }
    // }

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.getData();

  }


}
