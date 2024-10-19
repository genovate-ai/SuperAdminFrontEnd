import { Component, OnInit } from '@angular/core';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { PaginationModel } from 'src/app/shared/models/PaginationModel.Model';
import { CreateReportRoleComponent } from './create-reportRole.component';
import { UpdateReportRoleComponent } from './update-reportRole.component';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { STATUS_CODE, ReportColManageRolesEnum, SCREEN_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import { CreateReportRightsComponent } from './create-reportRights.component';
import { ManageReportComponent } from './manage-reportconfg.component';
import { ViewAllRolesUsersComponent } from './view-all-users/view-all-roles-users/view-all-roles-users.component';
import * as d3 from 'd3';

@Component({
  selector: 'app-manage-reportRole',
  templateUrl: './manage-reportRole.component.html'
})
export class ManageReportRoleComponent extends BaseFormComponent implements OnInit {

  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageReportRole;
  showConfirmationFlag: boolean;
  confirmationMessage = '';
  idToDelete: number;
  lstRoles: Array<any> = [];
  pagination: PaginationModel;
  showSearchBar = false;
  roleColName: string = null;
  roleSort: number = 1;
  closeSubscription: any;
  allowReportView: boolean = false;

  tableHeaderData: any;
  rightAlignFields: any;
  lstRenderedFieldsList = [];
  boldText = '';
  isDataLoaded = false;

  resetFilterCount = -1;
  saveFilters = false;

  filterKeysForArray = {
    reportRoleName: 'reportRoleNames',
  };

  filterKeysForLockInDB = {
    reportRoleName: 'reportRoleNames',
  };

  filterKeysForOperators = {
    reportRoleName: 'reportRoleNames',
  };

  filterArraysNObjs: any = {};
  filterTrackerArraysNObjs: any = {};
  filterWildCard: any = {};
  filterTrackerWildCard: any = {};
  filterOptions = {};
  filterOptionsCounts = {};
  resetFilter = {};

  // Object for passing selected values to reuseable filters
  selectedValuesArrays: any = {};
  selectedValueWildcard: any = {};
  selectedOperatorWildcard: any = {};

  orderBy: any;

  // Objects for filter popups
  lstIsFilterLoaded = {};
  lstFiltersOpenClose = {};
  lstFiltersApplied = {};
  filterCleared = false;
  disabledDragScroll = false;

  constructor(
    private manageReportService: ManageReportService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected notification: NotificationServiceService,
    protected accountService: AccountService

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
        this.getReportData();
        this.markFalseLstIsFilterLoaded();
        this.popupController.updateResult(null);
      }

    });

    this.screenPermission = this.IsAccessAllowed(SCREEN_CODE.ManageReportConfg);
    this.allowReportView = this.screenPermission.isViewButtonAllow;
    // MEMO: For Role Security
    this.screenPermission = this.IsAccessAllowed(this.screen);
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
    this.setTableHeaders();
    this.lstRenderedFieldsList = this.tableHeaderData.slice();

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService.getLockedFiltersAdmin(this.screen).subscribe((responseFilters) => {

      this.saveFilters = responseFilters.dataObject.isFilterSaved;

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
        this.getReportData();
      }
      else {
        this.getReportData();
      }
    });

    // this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
    // this.manageReportService
    //   .LoadManageReportRolesMetaData()
    //   .subscribe(response => {

    //     this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    //     this.lstRoles = response.dataObject;
    //   });
  }


  editRole(id) {

    this.translationPipe.getTranslation('manageReportRole.editrole', '').subscribe(response => {
      this.popupController.popupHeader = response;
    });

    this.popupController.updateModalSize('lg');
    this.popupController.parameters = id;
    this.popupController.updateComponent(UpdateReportRoleComponent);
  }

  editRights(id) {
    this.translationPipe.getTranslation('reportRights.editrights', '').subscribe(response => {
      this.popupController.popupHeader = response;
    });
    this.popupController.updateModalSize('lg');
    this.popupController.parameters = id;
    this.popupController.updateComponent(CreateReportRightsComponent);

  }

  DeleteRole(id) {
  }

  positiveDelete() {

  }



  createRole() {
    this.translationPipe.getTranslation('roles.createrole', '').subscribe(response => {
      this.popupController.popupHeader = response;
    });
    this.popupController.updateModalSize('lg');
    this.popupController.updateComponent(CreateReportRoleComponent);

  }

  manageReport() {
    this.translationPipe.getTranslation('reportsConfg.reportgrps', '').subscribe(response => {
      this.popupController.popupHeader = response;
    });
    this.popupController.updateModalSize('lg');
    this.popupController.updateComponent(ManageReportComponent);

  }

  updateParentValue(value) {

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService
      .LoadManageReportRolesMetaData()
      .subscribe(response => {

        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
        this.lstRoles = response.dataObject;

      });

  }

  onPageChange(event) {

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

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
    this.lstRoles = [];
    this.manageReportService
      .LoadSortedManageReportRolesMetaData(objSort)
      .subscribe(response => {

        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);

        this.lstRoles = response.dataObject;

      });


  }

  viewUsers(id) {
    this.translationPipe.getTranslation('rights.viewUsers', '').subscribe(response => {
      this.popupController.popupHeader = response;
    });

    this.popupController.updateModalSize('lg');
    this.popupController.parameters = id;
    this.popupController.updateComponent(ViewAllRolesUsersComponent);
  }
  getColManageRoleEnum() {
    return ReportColManageRolesEnum;
  }

  ngOnDestroy() {

    let domList;
    domList = document.querySelectorAll("body, .app-header, .screen-title, .heading-text, .screen-name");
    for (let i = 0; i < domList.length; ++i) {
      domList[i].classList.remove('background-white');
      domList[i].classList.remove('data-log');
    }

    this.closeSubscription.unsubscribe();

    this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
  }

  setTableHeaders() {
    this.tableHeaderData = [
      {
        label: this.translationPipe.getTraslatedValue("reportRole", "roleName"), metaDataLabel: "", field_name: "reportRoleName", sort_state: "descending", icon_type: "alpha",
        langKey: "reportRole.roleName",
        fieldKey: "reportRoleName", valueType: "text", numeric: "", filterType: 'selection', isWildcard: true,
        th: '', thDiv: '', td: '', tdDiv: '', padd: '', ml_icon: ''
        // th: 'min-w-137px w-137px max-w-137px', thDiv: 'min-w-122px w-122px max-w-122px', td: 'min-w-130px w-130px max-w-130px', tdDiv: 'min-w-122px w-122px max-w-122px', padd: '', ml_icon: ''
      },
      {
        label: this.translationPipe.getTraslatedValue("reportRole", "description"), metaDataLabel: "", field_name: "reportRoleDesc", sort_state: "descending", icon_type: "alpha",
        langKey: "reportRole.description",
        fieldKey: "reportRoleDesc", valueType: "text", numeric: "", filterType: 'none', isWildcard: false,
        th: '', thDiv: '', td: '', tdDiv: '', padd: '', ml_icon: ''
        // th: 'min-w-137px w-137px max-w-137px', thDiv: 'min-w-122px w-122px max-w-122px', td: 'min-w-130px w-130px max-w-130px', tdDiv: 'min-w-122px w-122px max-w-122px', padd: '', ml_icon: ''
      }

    ];
    this.rightAlignFields = this.tableHeaderData.filter((x) => x.numeric == "text-right").map((x) => x.field_name);
  }

  applySort(event, thSort, item, i) {

    event.stopPropagation();
    let th = d3.select(thSort);
    let field_name = th.attr('data-field_name');
    let sort_state = th.attr('data-sort_state');
    let icon_type = th.attr('data-icon_type');


    d3.selectAll('#table-header-report-role-log th')
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
    this.getReportData();

  }

  lockFilters() {
    this.saveFilters = true;
    this.saveFilterstoDB();
  }
  saveFilterstoDB() {

    if (this.saveFilters) {
      this.manageReportService.saveLockedFiltersAdmin(this.getObjectForFiltersPersist()).subscribe(response => {
        this.saveFilters = true;
      });
    }
  }

  removeFiltersfromDB() {
    this.saveFilters = false;
    this.manageReportService.removeAdminFiltersfromDB(this.screen).subscribe(response => {
      this.saveFilters = false;
    });
  }

  getObjectForFiltersPersist() {
    return {
      lockFiltersAdmin: {
        reportRoleNames: this.filterTrackerArraysNObjs.reportRoleName,
        reportRoleNamesWC: this.filterTrackerWildCard.reportRoleName,

        ieScreenID: this.screen,

      },

      lockFiltersOperatorAdmin: {
        reportRoleNames: this.filterTrackerWildCard.reportRoleName,
      }
    };
  }

  getFiltersObjectForPagination() {
    return {

      reportRoleNames: this.filterTrackerArraysNObjs.reportRoleName,
      reportRoleNamesWC: this.filterTrackerWildCard.reportRoleName,

      ieScreenID: this.screen,

      rowNumber: this.lstRoles.length,
      orderBy: this.orderBy,
      CSV: false,
      isFromWeb: true
    };

  }

  resetAllFilter() {

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
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

    let len = this.lstRenderedFieldsList.filter(x => x.filterType !== 'none').length || 0;
    if (len > 0) {
      this.resetFilterCount = len;
    }

    this.saveFilterstoDB();
    this.getReportData();


  }

  getReportData() {

    let param = this.getFiltersObjectForPagination();
    this.manageReportService
      .loadManageReportRolesByFilters(param).subscribe((responseData) => {

        this.lstRoles = [];
        this.lstRoles = responseData.dataObject.lstReportRoles || [];

        this.isDataLoaded = true;
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);

      });

  }

  clickedOutsideFilterDialog(fieldKey) {
    setTimeout(() => {
      this.disabledDragScroll = false;
    }, 0);
    this.lstFiltersOpenClose[fieldKey] = false;
  }

  clearFilter(filterKey) {

    this.filterCleared = true;
    this.resetFilter[filterKey] = true;

  }

  closeAllFilterPopups() {

    for (const keys in this.filterKeysForArray) {
      this.lstFiltersOpenClose[keys] = false;
    }

    this.disabledDragScroll = false;
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
    this.manageReportService.getFilterForReportRole(_param).subscribe(response => {

      this.filterOptions[filterKey] = response.dataObject.lstFilters || [];
      this.filterOptionsCounts[filterKey] = response.dataObject.filtersCount || 0;
      this.lstFiltersOpenClose[filterKey] = true;
      this.lstIsFilterLoaded[filterKey] = true;
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      this.disabledDragScroll = true;
    });

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

    this.saveFilterstoDB();
    this.getReportData();
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
    this.getReportData();
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
    this.getReportData();
  }

  markFalseLstIsFilterLoaded() {
    for (const keys in this.filterKeysForArray) {
      this.lstIsFilterLoaded[keys] = false;
    }
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
  trackById(fieldKey: string, index: number, item: any) {
    return item[fieldKey];
  }
  onLoader(val) {
    if (val)
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    else
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
  }

}
