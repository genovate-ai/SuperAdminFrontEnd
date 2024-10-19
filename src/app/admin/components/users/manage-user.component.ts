import { UserLicenseLogComponent } from './../user-license/user-license-log.component';
import { Component, OnInit, Injectable } from '@angular/core';
import { UserAccountService } from 'src/app/shared/services/user-account-services/user-account.service';
import { ViewUserModel } from 'src/app/shared/models/users/ViewUser.Model';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { CreateUserComponent } from './create-user.component';
import { UpdateUserComponent } from './update-user.component';
import { PaginationModel } from 'src/app/shared/models/PaginationModel.Model';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { UserVModel } from 'src/app/shared/models/users/UserV.Model';
import { LookUpVModel } from 'src/app/shared/models/LookUpV.Model';
import {
  STATUS_CODE,
  OrganizationTypeEnum,
  ColManageUserEnum,
  ColManageOrganizationsEnum,
  SCREEN_CODE,
  EVENTGROUP_CODE,
  EVENT_CODE,
  API_CALLEVENTGROUP_CODE
} from 'src/app/shared/helper/Enums';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import {
  AlertType,
  AlertModel,
  HeaderType
} from 'src/app/shared/models/Alert.Model';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { ScreenVPermission } from 'src/app/shared/models/ScreenPermissionV.Model';
import {
  transition,
  query,
  animate,
  style,
  stagger,
  trigger
} from '@angular/animations';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0 }),
        stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))
      ],
      { optional: true }
    ),
    query(':leave', animate('200ms', style({ opacity: 0 })), { optional: true })
  ])
]);
export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('100ms', style({ opacity: 0 }))
  ])
]);

@Component({
  selector: 'app-manage-user-component',
  templateUrl: './manage-user.component.html',
  animations: [fadeAnimation, listAnimation]
})
@Injectable()
export class ManageUserComponent extends BaseFormComponent implements OnInit {
  // Search box related working on toggle menu #Start
  indexSecond = -1;
  organazationId = -1;
  saveSearchForDisplay = '';

  //recently added user ID
  recentlyAddedUserId = -1;

  // For showing search results
  queryResultsFound = 0; // New
  queryResultsArray = []; // New
  queryResultsArrayLength: number; // New

  showQueryResult = false;
  // For highlighting the search box
  showSearchBoxHighlighting = false;
  // For checking innerToggle is open or not
  innerToggle = false; // New
  valueSearched = false;

  // Search box related working on toggle menu #End

  // FOR HARD CODE DATA
  lstClients: Array<ViewUserModel> = [];
  objClient = new ViewUserModel();
  toggle = {};
  toggle1 = {};
  toggle2 = {};

  showConfirmationFlag: boolean;
  confirmationMessage = '';

  userIdToDelete: number;
  showSearchBar2: boolean = false;
  showSearchBar1: boolean = false;
  displayPopup: boolean = false;
  orgSort: number = 1;
  orgColName: string = null;

  searchQuery: string = '';

  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageUser;
  closeSubscription: any;

  constructor(
    private userAccountService: UserAccountService,
    // private router: Router,
    protected popupController: PopupControllerService,
    protected notificationService: NotificationServiceService,
    // private activatedRou: ActivatedRoute,
    protected translationPipe: TranslationConfigService,
    protected accountService: AccountService
  ) {
    super(
      translationPipe,
      popupController,
      notificationService,
      accountService
    );
  }

  lstUsers: Array<ViewUserModel> = [];

  lstOrganTypes: Array<LookUpVModel> = [];
  lstOrganizations: Array<any> = [];
  lstOrganizationUsers: Array<any> = [];

  pagination: PaginationModel;
  showSearchBar: boolean = false;

  ngOnInit() {
    this.closeSubscription = this.popupController.getResultOnClose().subscribe(result => {
      if (result != null && result !== false) {
        this.highlightCreatedUser(result);
      }
    });
    // MEMO: For Role Security
    this.screenPermission = this.IsAccessAllowed(this.screen);

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.userAccountService
      .LoadManageUserScreenMetaData()
      .subscribe(response => {
        this.hideLoader(
          this.screen,
          API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT
        );
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

  LoadManageUserOrgansLstData(
    organTypeid,
    indexFirst,
    colName,
    isAsc,
    notSorting
  ) {
    this.innerToggleClose(); // Search Box New
    // Search box related working on toggle menu #End

    if (notSorting) {
      this.SetToggle(indexFirst);
    } else {
      // This else is applied to close sub toggles on sorting of organizations
      this.ResetAllToggle1();
    }

    this.lstOrganizations = [];
    var objSort = {
      columnName: colName,
      isAscSort: isAsc
    };

    this.orgColName = colName;
    if (this.toggle[indexFirst]) {

      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
      this.userAccountService
        .LoadManageUserOrgansLstData(organTypeid, objSort)
        .subscribe(response => {
          this.lstOrganizations = response.dataObject; //call GetAllOrganizationsByTypeMO at backend same as on organization screen # new functionality
          this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);

        });
    }
  }
  LoadManageUserUsersData(
    orgnId,
    i,
    indexFirst,
    colName,
    isAsc,
    notSorting
  ) {

    this.organazationId = orgnId;
    if (this.indexSecond !== i) {
      this.indexSecond = i;
      this.innerToggleOpen();
    } else if (this.indexSecond === i) {
      // this.organazationId = orgnId;
      // this.innerToggleOpen();
      this.innerToggleClose();
    } else {
      this.innerToggleClose();
    }
    if (!this.valueSearched) {
      this.searchQuery = '';
    }
    // Search box related working on toggle menu #New #End

    if (notSorting) {
      this.SetToggle1(i);
    }
    this.lstOrganizationUsers = [];
    var objSort = {
      // columnName: colName,
      columnName:  colName === 'userId' ? this.getColManageUserEnum().firstName : colName,
      isAscSort: isAsc
    };

    this.orgColName = colName;
    if (this.toggle1[i]) {
      this.LoadManageUserUsersLstDataCall(orgnId, objSort, i);
    }
  }

  LoadManageUserUsersLstData(
    orgnId,
    i,
    indexFirst,
    colName,
    isAsc,
    notSorting
  ) {
    this.organazationId = orgnId;
    if (this.indexSecond !== i) {
      this.indexSecond = i;
      this.innerToggleOpen();
    } else if (this.indexSecond === i) {
      this.innerToggleClose();
    } else {
      this.innerToggleClose();
    }
    if (!this.valueSearched) {
      this.searchQuery = '';
    }
    // Search box related working on toggle menu #New #End

    if (notSorting) {
      this.SetToggle1(i);
    }
    this.lstOrganizationUsers = [];
    var objSort = {
      columnName: colName,
      isAscSort: isAsc
    };

    this.orgColName = colName;
    if (this.orgSort !== 2) {
      this.orgSort = 2;
    } else {
      this.orgSort = 3;
      objSort.isAscSort = false;
    }
    if (this.toggle1[i]) {
      this.LoadManageUserUsersLstDataCall(orgnId, objSort, i);
    }
  }

  CheckToggle(indexFirst) {
    return this.toggle[indexFirst];
  }

  ShouldShowAnceraUsers(orgnTypeid) {
    if (orgnTypeid === OrganizationTypeEnum.Ancera) {
      ///If want to show Users direct theen return trure below.
      return false;
    } else {
      return false;
    }
  }

  LoadManageUserUsersLstDataCall(orgnId, objSort, i? ) {
    this.lstOrganizationUsers = [];
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
    this.userAccountService
      .LoadManageUserUsersLstData(orgnId, this.searchQuery, objSort)
      .subscribe(response => {
        this.lstOrganizationUsers = response.dataObject;
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
      });
  }

  editUser(id) {
    let header = '';
    this.translationPipe
      .getTranslation("dashboard.editUser", "")
      .subscribe((response) => {
        header = response;
      });
    this.ResetAllToggle();
    this.popupController.parameters = id;
    this.popupController.updateModalSize('sm');
    this.popupController.popupHeader = header;
    this.popupController.updateComponent(UpdateUserComponent);
  }

  deleteUser(id) {
    this.translationPipe
      .getTranslation('Confirm.DeleteUser', '')
      .subscribe(response => {
        this.confirmationMessage = response;
      });

    this.showConfirmationFlag = true;
    this.userIdToDelete = id;
  }
  viewUserEulaLog(id, event: Event) {
    let header = '';
    this.translationPipe
      .getTranslation("app.licenseAgreement", "")
      .subscribe((response) => {
        header = response;
      });
    event.stopPropagation();
    event.preventDefault();
    const user = {
      userId: id
    };
    this.popupController.updateParams(user);
    this.popupController.updateModalSize('sm');
    this.popupController.popupHeader = header;
    this.popupController.updateComponent(UserLicenseLogComponent);
 
  }
  positiveDelete() {
    this.notificationService.loading = true;

    this.userAccountService
      .DeleteUser(this.userIdToDelete)
      .subscribe(response => {
        if (response.statusCode === STATUS_CODE.SUCCESS) {
          var alert: AlertModel = {
            type: AlertType.SUCCESS,
            message: response.message,
            header: HeaderType.SUCCESS
          };
          this.notificationService.showNotification(alert);

          this.ResetAllToggle();

          this.showConfirmationFlag = false;
          // this.close();
        }
        if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
          var alertEr: AlertModel = {
            type: AlertType.DANGER,
            message: response.message,
            header: HeaderType.ERROR
          };
          this.notificationService.showNotification(alertEr);
          // this.close();
        }

        this.notificationService.loading = false;
      });
    this.userIdToDelete = 0;
  }

  createUser() {
    let header = '';
    this.translationPipe
      .getTranslation("dashboard.createUser", "")
      .subscribe((response) => {
        header = response;
      });
    this.ResetAllToggle();
    this.displayPopup = true;
    this.popupController.updateModalSize('sm');
    this.popupController.popupHeader = header;
    this.popupController.updateComponent(CreateUserComponent);
  }

  onPageChange(event) {

    this.pagination.activePageNumber = event;
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
    this.userAccountService
      .getUserByPageNo(this.pagination.activePageNumber)
      .subscribe(data => {
        this.hideLoader(
          this.screen,
          API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT
        );
        this.lstUsers = data.data['lstUsers'];
        this.pagination.pageSize = data.data['pageSize'];
        this.pagination.totalResult = data.data['pageSize'];

      });
  }

  getColManageUserEnum() {
    return ColManageUserEnum;
  }
  getColManageOrganizationsEnum() {
    return ColManageOrganizationsEnum;
  }

  // Search box related working on toggle menu #Start

  searchByUser() {
    let searchValue = (<HTMLInputElement>(
      document.getElementById('userSearchId')
    )).value;

    if (searchValue === '') {
      return false;
    }

    this.showQueryResult = false;
    this.initializaQueryResultsArray();

    this.userAccountService
      .LoadSearchUserByTypeCount(searchValue)
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
    if (this.toggle1[this.indexSecond]) {
      let objSort = {
        columnName: 'userId',
        isAscSort: false
      };

      this.LoadManageUserUsersLstDataCall(this.organazationId, objSort);
    }
  }
  resetSearchByUser() {
    this.DisableSearchChanges();
    if (this.toggle1[this.indexSecond]) {
      let objSort = {
        columnName: 'userId',
        isAscSort: false
      };
      this.LoadManageUserUsersLstDataCall(this.organazationId, objSort);
    }
  }

  getColManageOrganEnum() {
    return ColManageOrganizationsEnum;
  }

  HideDeleteIcon(userVM: UserVModel): Boolean {
    if (
      this.accountService.user.userId != null &&
      this.accountService.user.userId == userVM.userId
    ) {
      return false;
    }
    return true;
  }

  //code written by Ahmad Qasim
  highlightCreatedUser(createUserResponse: any) {
    this.SetToggle(
      this.lstOrganTypes.findIndex(
        x => x.id == createUserResponse.userOrgnTypeId
      )
    );
    var objSort = {
      columnName:  'orgnName',
      isAscSort: true
    };
    //get list of organizations
    this.userAccountService
      .LoadManageUserOrgansLstData(createUserResponse.userOrgnTypeId, objSort)
      .subscribe(response => {
        this.lstOrganizations = response.dataObject; //call GetAllOrganizationsByTypeMO at backend same as on organization screen # new functionality
        this.SetToggle1(
          this.lstOrganizations.findIndex(
            x => x.orgnId === createUserResponse.userOrgnId
          )
        );

        objSort.columnName = 'userId';
        //get list of users against a user
        this.userAccountService
          .LoadManageUserUsersLstData(
            createUserResponse.userOrgnId,
            this.searchQuery,
            objSort
          )
          .subscribe(response => {
            this.lstOrganizationUsers = response.dataObject;
            this.recentlyAddedUserId = createUserResponse.userId;

            let index = this.lstOrganizationUsers.findIndex(
              x => x.userId == createUserResponse.userId
            );
            var elmnt = document.getElementById('' + index);
            elmnt.scrollIntoView();
          });
      });
  }
  onKeyUp() {
    const searchValue = (document.getElementById(
      'userSearchId'
    ) as HTMLInputElement).value;
    this.showSearchBoxHighlighting = searchValue !== '' ? true : false;

    // Search box related working on toggle menu #New #Start

    if (searchValue === '') {
      if (this.valueSearched && this.innerToggle) {
        this.searchQuery = '';

        var objSort = {
          columnName: 'userId',
          isAscSort: false
        };
        this.LoadManageUserUsersLstDataCall(this.organazationId, objSort);
      }
      this.DisableSearchChanges();
    }
  }
  innerToggleOpen() {
    this.innerToggle = true;
  }
  innerToggleClose() {
    this.indexSecond = -1;
    this.innerToggle = false;
  }

  EnableSearchChanges(searchValue: string) {
    this.searchQuery = searchValue;
    this.saveSearchForDisplay = searchValue;
    this.valueSearched = true;
  }

  DisableSearchChanges() {
    this.searchQuery = '';
    this.saveSearchForDisplay = '';
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

  ngOnDestroy() {
    this.closeSubscription.unsubscribe();
  }
}
