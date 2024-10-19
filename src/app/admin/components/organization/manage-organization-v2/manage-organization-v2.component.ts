import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { SCREEN_CODE, API_CALLEVENTGROUP_CODE, STATUS_CODE, ColManageUserEnum, OrganizationTypeEnum } from 'src/app/shared/helper/Enums';
import { AlertModel, AlertType, HeaderType } from 'src/app/shared/models/Alert.Model';
import { DataFormatDetails } from 'src/app/shared/models/dataFormats/dataFormatDetails.Model';
import { UserVModel } from 'src/app/shared/models/users/UserV.Model';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { ShareReportFieldsService } from 'src/app/shared/services/common/share-report-fields.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ManageOrganizationsService } from 'src/app/shared/services/manage-organizations/manage-organizations.service';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import { AdminUserPreferenceFieldsComponent } from '../../admin-user-preference-fields/admin-user-preference-fields.component';

import { CreateOrganizationComponent } from '../create-organization.component';
import { UpdateOrganizationComponent } from '../update-organization.component';

@Component({
  selector: 'app-manage-organization-v2',
  templateUrl: './manage-organization-v2.component.html',
  styleUrls: ['./manage-organization-v2.component.scss']
})
export class ManageOrganizationV2Component extends BaseFormComponent implements OnInit {

  screen = SCREEN_CODE.ManageOrganization;

  closeSubscription: any;

  filterKeysForArray = {
    orgnName: 'orgnName',
    phoneNo: 'phoneNo',
    cityName: 'cityName',
    provinceName: 'provinceName',
    countryName: 'countryName',
    orgnTypeName: 'orgnTypeName',
  };

  filterKeysForLockInDB = {
    orgnName: 'orgnNames',
    phoneNo: 'phoneNos',
    cityName: 'cityNames',
    provinceName: 'provinceNames',
    countryName: 'countryNames',
    orgnTypeName: 'orgnTypeNames',
  };

  filterKeysForOperators = {
    orgnName: 'orgnNames',
    phoneNo: 'phoneNos',
    cityName: 'cityNames',
    provinceName: 'provinceNames',
    countryName: 'countryNames',
    orgnTypeName: 'orgnTypeNames',
  };

  // Objects containg arrays and objects for dynamic filtering of data
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

  resetFilterCount = -1;
  saveFilters = false;

  lstRenderedFieldsList = [];
  lstLookupAssigned = [];
  lstAdminUserAssigned = [];
  rightAlignFields = [];

  totalRecords = 0;

  // Objects for timezone
  timeZoneFormat = '';
  datezoneFormat;
  datezoneFormatMoment: any;
  formattedDateZone: any;
  formattedDateZoneSplitter: any;



  // Object containing all log data receive from response
  reportData: any;
  isDataLoaded = false;

  tableHeaderData: any;
  reportFieldsSubscription: Subscription;


  // csvTableId = '';
  csvFileName = 'Organizations Log';
  // csvAuditFileName = '';
  // xlsxTableId = '';
  xlsxileName = 'Organizations Log';

  // auditModal = true;
  idToDelete = -1;
  isSiteAdmin = false;
  orgnTypeId = 0;
  orgnId = 0;
  isAnceraUser=false;
  constructor(
    private manageOrganizationsService: ManageOrganizationsService,
    protected popupController: PopupControllerService,
    protected notificationService: NotificationServiceService,
    protected translationPipe: TranslationConfigService,
    protected accountService: AccountService,
    protected manageReportService: ManageReportService,
    private datePipe: DatePipe,
    private reportFieldsService: ShareReportFieldsService,
  ) {
    super(translationPipe, popupController, notificationService, accountService);

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
    
    this.screenPermission = this.IsAccessAllowed(this.screen);
    this.isSuperTenant = this.getIsSuperTenant();
    this.isSuperUser = this.getIsSuperUser();
    this.orgnTypeId = this.accountService.user.userOrgnTypeId;

    if(this.orgnTypeId === OrganizationTypeEnum.Ancera.valueOf()) {
      this.orgnId = 0;
      this.isAnceraUser=true;
    } else if( this.orgnTypeId !== OrganizationTypeEnum.Ancera.valueOf()) {
      this.orgnId = this.accountService.user.userOrgnId;
    }

    this.reportFieldsSubscription = this.reportFieldsService.getFieldsParam.subscribe((response: any) => {

      if (response != undefined) {
        if (response.arrLst != null && response.arrLst != undefined) {

          this.lstAdminUserAssigned = response.arrLst.slice();
          this.setRenderableFields();
        }
      }
    });
    this.closeSubscription = this.popupController.getResultOnClose().subscribe(result => {

      if (result !== null && result !== false) {
        this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
        this.getReportData();
        this.markFalseLstIsFilterLoaded();
        this.popupController.updateResult(null);
      }
    });

    this.timeZoneFormat = this.accountService.user.timeZoneCountry;
    this.datezoneFormat = this.accountService.user.userDateFormat;
    var re = /d/gi;
    // this.datezoneFormatMoment = this.datezoneFormat.replace(re, "D");
    this.formattedDateZone = this.datezoneFormatMoment;

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

    // this.lstRenderedFieldsList = this.tableHeaderData.slice();

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService.getLockedFiltersAdmin(this.screen).subscribe((responseFilters) => {

      this.saveFilters = responseFilters.dataObject.isFilterSaved;
      this.lstLookupAssigned = responseFilters.dataObject.lstLookupAssigned;
      this.lstAdminUserAssigned = responseFilters.dataObject.lstAdminUserAssigned;

      this.setRenderableFields();

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



  execMainDataSetResponse() {
    this.getReportData();
  }

  setTableHeaders() {
    this.tableHeaderData = [
      {
        label: 'Organization Name', metaDataLabel: "", field_name: "orgnName", sort_state: "ascending", icon_type: "alpha",
        langKey: "organizations.organizationName",
        fieldKey: "orgnName", valueType: "text", numeric: "", filterType: 'selection', isWildcard: true,
        th: 'min-w-137px w-137px max-w-137px', thDiv: 'min-w-122px w-122px max-w-122px', td: 'min-w-130px w-130px max-w-130px', tdDiv: 'min-w-122px w-122px max-w-122px', padd: '', ml_icon: ''
      },
      {
        label: 'Phone Number', metaDataLabel: "", field_name: "phoneNo", sort_state: "ascending", icon_type: "alpha",
        langKey: "organizations.phoneNum",
        fieldKey: "phoneNo", valueType: "text", numeric: "", filterType: 'selection', isWildcard: true,
        th: 'min-w-137px w-137px max-w-137px', thDiv: 'min-w-122px w-122px max-w-122px', td: 'min-w-130px w-130px max-w-130px', tdDiv: 'min-w-122px w-122px max-w-122px', padd: '', ml_icon: ''
      },
      {
        label: 'Organization Type', metaDataLabel: "", field_name: "orgnTypeName", sort_state: "ascending", icon_type: "alpha",
        langKey: "organizations.organizationType",
        fieldKey: "orgnTypeName", valueType: "text", numeric: "", filterType: 'selection', isWildcard: true,
        th: 'min-w-137px w-137px max-w-137px', thDiv: 'min-w-122px w-122px max-w-122px', td: 'min-w-130px w-130px max-w-130px', tdDiv: 'min-w-122px w-122px max-w-122px', padd: '', ml_icon: ''
      },
      ,

    ];
    this.rightAlignFields = this.tableHeaderData.filter((x) => x.numeric == "text-right").map((x) => x.field_name);
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
        orgnNames: this.filterTrackerArraysNObjs.orgnName,
        orgnNamesWC: this.filterTrackerWildCard.orgnName,

        phoneNos: this.filterTrackerArraysNObjs.phoneNo,
        phoneNosWC: this.filterTrackerWildCard.phoneNo,

        cityNames: this.filterTrackerArraysNObjs.cityName,
        cityNamesWC: this.filterTrackerWildCard.cityName,

        provinceNames: this.filterTrackerArraysNObjs.provinceName,
        provinceNamesWC: this.filterTrackerWildCard.provinceName,

        countryNames: this.filterTrackerArraysNObjs.countryName,
        countryNamesWC: this.filterTrackerWildCard.countryName,

        orgnTypeNames: this.filterTrackerArraysNObjs.orgnTypeName,
        orgnTypeNamesWC: this.filterTrackerWildCard.orgnTypeName,

        ieScreenID: this.screen,

      },

      lockFiltersOperatorAdmin: {
        orgnNames: this.filterTrackerWildCard.orgnName,

        phoneNos: this.filterTrackerWildCard.phoneNo,

        cityNames: this.filterTrackerWildCard.cityName,

        provinceNames: this.filterTrackerWildCard.provinceName,

        countryNames: this.filterTrackerWildCard.countryName,

        orgnTypeNames: this.filterTrackerWildCard.orgnTypeName,

      }
    };
  }

  getFiltersObjectForPagination() {

    return {

      orgnNames: this.filterTrackerArraysNObjs.orgnName,
      orgnNamesWC: this.filterTrackerWildCard.orgnName,

      phoneNos: this.filterTrackerArraysNObjs.phoneNo,
      phoneNosWC: this.filterTrackerWildCard.phoneNo,

      cityNames: this.filterTrackerArraysNObjs.cityName,
      cityNamesWC: this.filterTrackerWildCard.cityName,

      provinceNames: this.filterTrackerArraysNObjs.provinceName,
      provinceNamesWC: this.filterTrackerWildCard.provinceName,

      countryNames: this.filterTrackerArraysNObjs.countryName,
      countryNamesWC: this.filterTrackerWildCard.countryName,

      orgnTypeNames: this.filterTrackerArraysNObjs.orgnTypeName,
      orgnTypeNamesWC: this.filterTrackerWildCard.orgnTypeName,

      ieScreenID: this.screen,

      rowNumber: this.totalRecords,
      orderBy: this.orderBy,
      CSV: false,
      isFromWeb: true,
      siteAdmin: this.isSiteAdmin,
      orgnTypeId: this.orgnTypeId,
      orgnId: this.orgnId
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

  exportCSV() {
    //1. Get column header from DB
    //2. Fetching data from Db according to pagination
    //3. Making data format to export CSV
    //4. destroyObjects to empty used resources
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);


    let tempArr = this.getRenderedFieldsListCSV(
      this.tableHeaderData,
      this.lstAdminUserAssigned
    );
    // tempArr = this.tableHeaderData.slice()

    const heading = tempArr.map((obj) => {
      return this.translationPipe.getTraslatedValue(
        obj.langKey.split(".")[0],
        obj.langKey.split(".")[1]
      );
    });
    const headerKeys = tempArr.map((obj) => obj.field_name);
    const csv = [];
    var row = "";
    for (let r_heading = 0; r_heading < heading.length; r_heading++) {
      row = row + "," + '"' + heading[r_heading] + '"';
    }
    row = row.substring(1); //Removing first ,
    csv.push(row);
    row = "";
    let column_name = "";

    let _param = this.getFiltersObjectForPagination();
    _param.rowNumber = this.totalRecords;
    _param.CSV = true;

    this.manageOrganizationsService.getAllOrgnsByFilters(_param)
      .subscribe((responseData) => {
        const orgn_data = responseData.dataObject.lstOrgnData;
        for (
          let r_coccidia = 0;
          r_coccidia < orgn_data.length;
          r_coccidia++
        ) {
          for (
            let r_headKeys = 0;
            r_headKeys < headerKeys.length;
            r_headKeys++
          ) {

            if (orgn_data[r_coccidia][headerKeys[r_headKeys]] === null) {
              row = row + "," + '"' + "" + '"';
            } else if (headerKeys[r_headKeys] === 'time') {
              row = row + "," + '\"' + this.datePipe.transform(
                this.adjustDateForSystemTimezone(orgn_data[r_coccidia]['source_scanDateTime']),
                'hh:mm a', this.timeZoneFormat
              ) + '\"';
            } else {
              if (headerKeys[r_headKeys] === 'phoneNo') {
                row = row + "," + '"' + '\t' + orgn_data[r_coccidia][headerKeys[r_headKeys]] + '"';
              } else {
                row = row + "," + '"' + orgn_data[r_coccidia][headerKeys[r_headKeys]] + '"';
              }
            }
          }
          row = row.substring(1); //Removing first ,
          csv.push(row);
          row = "";
        }

        const d = new Date();
        const _csvFileName =
          this.csvFileName +
          " - " +
          d.getFullYear() +
          ("0" + (d.getMonth() + 1)).slice(-2) +
          ("0" + d.getDate()).slice(-2) +
          "_" +
          ("0" + d.getHours()).slice(-2) +
          "" +
          ("0" + d.getMinutes()).slice(-2);

        this.downloadCSVFile(csv.join("\n"), _csvFileName);
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
      });
  }

  getRenderedFieldsListCSV(arr1, arr2) {

    return arr1.filter((o1) => {
      return arr2.some((o2) => {
        o1.fieldOrder = o2.fieldOrder || 1;
        return o1.field_name === o2.fieldName.trim();
      });
    }).sort((a, b) => {
      return a.fieldOrder - b.fieldOrder;
    });
  }

  manageOrgnFields() {
    // this.auditModal = true;
    // setTimeout(() => {
    this.popupController.updateParams({ reportTypeId: this.screen, lstDefault: this.lstLookupAssigned, lstUser: this.lstAdminUserAssigned });
    this.popupController.popupHeader = this.translationPipe.getTraslatedValue('userRptFields', 'reportFields');
    this.popupController.updateModalSize('md');
    this.popupController.updateComponent(AdminUserPreferenceFieldsComponent);
    // }, 0);

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
    this.manageOrganizationsService.getFilterForOrgn(_param).subscribe(response => {

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

  onLoader(val) {
    if (val)
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    else
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
  }


  setWidthIfNumericCol(text, widthClass) {
    return text && text != '' ? 'p-r-22px' : '';
  }

  applySort(event, thSort, item, i) {

    event.stopPropagation();
    let th = d3.select(thSort);
    let field_name = th.attr('data-field_name');
    let sort_state = th.attr('data-sort_state');
    let icon_type = th.attr('data-icon_type');


    d3.selectAll('#table-header-orgn-log th')
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

  adjustDateForSystemTimezone(date: any): Date {
    date = new Date(date);
    var timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date
  }

  ngOnDestroy() {
    let domList;
    domList = document.querySelectorAll("body, .app-header, .screen-title, .heading-text, .screen-name");
    for (let i = 0; i < domList.length; ++i) {
      domList[i].classList.remove('background-white');
      domList[i].classList.remove('data-log');
    }

    if(this.reportFieldsSubscription) {
      this.reportFieldsSubscription.unsubscribe();
    }
    if(this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }

    this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
  }

  private downloadCSVFile(data, fileName) {
    // tslint:disable-next-line: no-shadowed-variable
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", fileName + ".csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getReportData() {

    let param = this.getFiltersObjectForPagination();
    this.manageOrganizationsService
      .getAllOrgnsByFilters(param).subscribe((responseData) => {


        this.reportData = responseData.dataObject || [];

        this.totalRecords = this.reportData.lstOrgnData.length;

        this.isDataLoaded = true;
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);

      });

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

  createOrganization() {
    let header = '';
    this.translationPipe
      .getTranslation("dashboard.createOrganization", "")
      .subscribe((response) => {
        header = response;
      });

    this.popupController.updateModalSize('sm');
    this.popupController.popupHeader = header;

    this.popupController.updateComponent(CreateOrganizationComponent);

  }

  editOrganization(id) {
    let header = '';
    this.translationPipe
      .getTranslation("dashboard.eidtOrganization", "")
      .subscribe((response) => {
        header = response;
      });

    this.popupController.updateModalSize('sm');
    this.popupController.popupHeader = header;
    this.popupController.parameters = id;
    this.popupController.updateComponent(UpdateOrganizationComponent);

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
        this.showConfirmationFlag = false;
        this.getReportData();

      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
        this.ShowErrorNotification(response.message);
        this.notificationService.loading = false;
      }

    });
    this.idToDelete = 0;

  }

  setRenderableFields() {

    if (this.lstLookupAssigned.length > 0 && this.lstAdminUserAssigned.length > 0) {
      this.lstRenderedFieldsList = this.getRenderedFieldsList(this.tableHeaderData, this.lstAdminUserAssigned);
    }
  }
  getRenderedFieldsList(arr1, arr2) {

    return arr1.filter((o1) => {
      return arr2.some((o2) => {
        o1.fieldOrder = o2.fieldOrder || 1;
        return o1.field_name === o2.fieldName.trim();
      });
    }).sort((a, b) => {
      return a.fieldOrder - b.fieldOrder;
    });
  }

}

