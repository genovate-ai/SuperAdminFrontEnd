import { ManageUserLicenseService } from './../../../shared/services/manage-user-license-services/manage-user-license.service';
import { Component, OnInit, Injectable } from '@angular/core';
import { UserAccountService } from 'src/app/shared/services/user-account-services/user-account.service';
import { ViewUserModel } from 'src/app/shared/models/users/ViewUser.Model';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { CreateUserComponent } from './../users/create-user.component';
import { UpdateUserComponent } from './../users/update-user.component';
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
  API_CALLEVENTGROUP_CODE,
} from 'src/app/shared/helper/Enums';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import {
  AlertType,
  AlertModel,
  HeaderType,
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
  trigger,
} from '@angular/animations';
import { Constants } from 'src/app/shared/helper/Constants';
import { ResponseVModel } from 'src/app/shared/models/ResponseV.Model';
import { ViewUserLicenseComponent } from './view-user-license.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0 }),
        stagger('60ms', animate('600ms ease-out', style({ opacity: 1 }))),
      ],
      { optional: true }
    ),
    query(':leave', animate('200ms', style({ opacity: 0 })), {
      optional: true,
    }),
  ]),
]);

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('100ms', style({ opacity: 0 })),
  ]),
]);


@Component({
  selector: 'app-manage-user-license-component',
  templateUrl: './manage-user-license.component.html',
  animations: [fadeAnimation, listAnimation],
})
@Injectable()
export class ManageUserLicenseComponent
  extends BaseFormComponent
  implements OnInit {

  isEulaAlreadyAppliedAtOrgnTypeLevel = false;
  isEulaAlreadyAppliedAtOrgnLevel = false;
  isEulaAlreadyAppliedAtUserLevel = false;

  lstSaveConfigToDB = [];
  openOrgnTypeId = -1;
  openOrgnId = -1;

  formGroupEula: UntypedFormGroup;
  lstEulaFiles = [];
  lstEulaFilesDDL = [];
  selectedEula: any = {};


  stepperStepNames = ['',''];
  stepperActiveStep = 1;

  eulaIdToActiveDeactive = 0;
  eulaIndexWhichDelete = -1;
  eulaForAction = {
    eulaId: 0,
  };

  actionMode = '';
  formGroupApplyEula: UntypedFormGroup;
  lstUserEulaConfigToSaveInDB = [];
  allUsersMarked = false;
  lstOrgnEulaConfigToSaveInDB = [];
  disableSelection = true;
  orgnIdForConfig = 0;
  // Search box related working on toggle menu #Start

  lstOrganTypeWiseConfigToSaveInDB = [];
  levelOnWhichEulaApply = 1;
  firstLevelIndex: any;
  secondLevelIndex: any;

  organizationTypeId = -1;
  indexSecond = -1;
  organazationId = -1;
  saveSearchForDisplay = '';

  // recently added user ID
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
  // For disabling the search box
  // searchBoxDisabling = true;  // Old
  // For filter purpose realted to search when user clear the search box
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
  showSearchBar2 = false;
  showSearchBar1 = false;
  displayPopup = false;
  orgSort = 1;
  orgColName: string = null;
  validUserAgreement;
  searchQuery = '';

  // MEMO: For Role Security
  screen = SCREEN_CODE.ManageUserAgreement;
  eventGroup = EVENTGROUP_CODE.UPDATE;
  closeSubscription: any;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    private userAccountService: UserAccountService,
    // private router: Router,
    protected popupController: PopupControllerService,
    protected notificationService: NotificationServiceService,
    // private activatedRou: ActivatedRoute,
    protected translationPipe: TranslationConfigService,
    protected accountService: AccountService,
    protected manageUserLicenseService: ManageUserLicenseService
  ) {
    super(
      translationPipe,
      popupController,
      notificationService,
      accountService
    );
  }

  lstUsers: Array<ViewUserModel> = [];
  saveChanges;
  lstOrganTypes: Array<any> = [];
  lstOrganizations: Array<any> = [];
  lstOrganizationUsers: Array<any> = [];
  selectPDF;
  pagination: PaginationModel;
  showSearchBar = false;

  async ngOnInit() {
    this.SetRoleSecurity(this.screen, this.eventGroup);
    this.formGroupEula = new UntypedFormGroup({});
    this.resetForm();
    const str1 =  await this.translationPipe.getTranslation('manageEula.uploadUserAgreement', '').toPromise() as string;

    const str =  await this.translationPipe.getTranslation('manageEula.applyUserAgreement', '').toPromise() as string;
    this.stepperStepNames = [str, str1];




    this.translationPipe
         .getTranslation("errorMessages.noChangesSave", "")
         .subscribe((response) => {
           this.saveChanges = response;
         });


    this.translationPipe
         .getTranslation("errorMessages.validAgrrement", "")
         .subscribe((response) => {
           this.validUserAgreement = response;
         });

         this.translationPipe
         .getTranslation("errorMessages.selectPDF", "")
         .subscribe((response) => {
           this.selectPDF = response;
         });
    // MEMO: For Role Security
    this.screenPermission = this.IsAccessAllowed(this.screen);

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
    this.loadManageEULAsMetaDataCall();

  }
  //stepperStepNames = ['Upload User Agreement', 'Apply User Agreement'];

  // async asj () {
  //   return await this.translationPipe.getTranslation('manageEula.uploadUserAgreement', '').toPromise() as string;
  // }

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
    const j = this.toggle1[i];
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

    if (this.isEulaSelected()) {
      return;
    }

    this.openOrgnTypeId = organTypeid;
    this.organizationTypeId = organTypeid;
    this.innerToggleClose(); // Search Box New
    // Search box related working on toggle menu #End

    if (notSorting) {
      this.SetToggle(indexFirst);
    } else {
      // This else is applied to close sub toggles on sorting of organizations
      this.ResetAllToggle1();
    }

    this.lstOrganizations = [];
    const objSort = {
      columnName: colName,
      isAscSort: isAsc,
    };

    this.orgColName = colName;

    if (this.toggle[indexFirst]) {
      this.firstLevelIndex = indexFirst;
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
      this.userAccountService
        .loadOrganizationsWithEulaByOrganTypeData(organTypeid, objSort, this.selectedEula)
        .subscribe((response) => {

          this.lstOrganizations = [];
          this.lstOrganizations = response.dataObject || [];

          this.lstOrganizations.forEach(orgn => {
            orgn.oldboolStatus = orgn.boolStatus;
            if (this.lstOrganTypes[indexFirst].boolStatus) {
              orgn.boolStatus = true;
            }
            const index = this.lstSaveConfigToDB.findIndex(x => x.userOrgnId === orgn.orgnId
                            && x.orgnTypeId === this.openOrgnTypeId && x.userId === null);
            if (index > -1) {
              this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
              this.lstSaveConfigToDB[index].boolStatus = orgn.boolStatus;
            } else {
              this.lstSaveConfigToDB.push({
                eulaId: this.selectedEula,
                orgnTypeId: this.openOrgnTypeId,
                userOrgnId: orgn.orgnId,
                userId: null,
                boolStatus: orgn.boolStatus,
                oldboolStatus: orgn.oldboolStatus
              });
            }
          });

          if (this.lstSaveConfigToDB.filter(obj => {
            return obj.userId === null && obj.userOrgnId !== null
                  && obj.orgnTypeId === this.openOrgnTypeId && obj.boolStatus === true;
          }).length === this.lstOrganizations.length ) {
            this.lstOrganTypes[this.firstLevelIndex].boolStatus = true;
          } else {
            this.lstOrganTypes[this.firstLevelIndex].boolStatus = false;
          }

          const index = this.lstSaveConfigToDB.findIndex(x => x.orgnTypeId ===
                             this.lstOrganTypes[this.firstLevelIndex].id && x.userOrgnId === null && x.userId === null);
          if (index > -1) {
                this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
                this.lstSaveConfigToDB[index].boolStatus = this.lstOrganTypes[this.firstLevelIndex].boolStatus;
          } else {
                this.lstSaveConfigToDB.push({
                  eulaId: this.selectedEula,
                  orgnTypeId: this.lstOrganTypes[this.firstLevelIndex].id,
                  userOrgnId: null,
                  userId: null,
                  boolStatus: this.lstOrganTypes[this.firstLevelIndex].boolStatus,
                });
          }

          this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
        });

      this.levelOnWhichEulaApply = 2;
    } else {
      this.levelOnWhichEulaApply = 1;
    }
  }
  LoadManageUserUsersData(orgnId, i, indexFirst, colName, isAsc, notSorting) {

    if (this.isEulaSelected()) {
      return;
    }
    this.openOrgnId = orgnId;
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
    const objSort = {
      columnName:
        colName === 'userId' ? this.getColManageUserEnum().firstName : colName,
      isAscSort: isAsc,
    };

    this.orgColName = colName;
    if (this.toggle1[i]) {

      this.secondLevelIndex = i;
      this.LoadManageUserUsersLstDataCall(orgnId, objSort, i);
      this.levelOnWhichEulaApply = 3;
    } else {
      this.levelOnWhichEulaApply = 2;
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


    if (this.isEulaSelected()) {
      return;
    }
    this.openOrgnId = orgnId;
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
    const objSort = {
      columnName: colName,
      isAscSort: isAsc,
    };

    this.orgColName = colName;
    if (this.orgSort !== 2) {
      this.orgSort = 2;
    } else {
      this.orgSort = 3;
      objSort.isAscSort = false;
    }
    if (this.toggle1[i]) {

      this.secondLevelIndex = i;
      this.LoadManageUserUsersLstDataCall(orgnId, objSort, i);
      this.levelOnWhichEulaApply = 3;
    } else {
      this.levelOnWhichEulaApply = 2;
    }
  }

  CheckToggle(indexFirst) {
    return this.toggle[indexFirst];
  }

  ShouldShowAnceraUsers(orgnTypeid) {
    if (orgnTypeid === OrganizationTypeEnum.Ancera) {
      /// If want to show Users direct theen return trure below.
      return false;
    } else {
      return false;
    }
  }

  LoadManageUserUsersLstDataCall(orgnId, objSort, i?) {
    this.lstOrganizationUsers = [];
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
    this.userAccountService
      .loadUsersWithEulaByOrganizationData(
        orgnId,
        this.searchQuery,
        objSort,
        this.selectedEula
      )

      .subscribe((response) => {

        this.lstOrganizationUsers = [];
        this.lstOrganizationUsers = response.dataObject || [];

        this.lstOrganizationUsers.forEach(user => {
          user.oldboolStatus = user.boolStatus;
          if (this.lstOrganizations[this.secondLevelIndex].boolStatus) {
            user.boolStatus = true;
          }
          const index = this.lstSaveConfigToDB.findIndex(x => x.userId === user.userId);
          if (index > -1) {
            this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
            this.lstSaveConfigToDB[index].boolStatus = user.boolStatus;
          } else {
            this.lstSaveConfigToDB.push({
              eulaId: this.selectedEula,
              orgnTypeId: this.openOrgnTypeId,
              userOrgnId: this.openOrgnId,
              userId: user.userId,
              boolStatus: user.boolStatus,
              oldboolStatus: user.boolStatus
            });
          }
        });

        // Marking Organization
        if (this.lstSaveConfigToDB.filter(obj => {
          return obj.userId !== null && obj.userOrgnId === this.openOrgnId &&
                  obj.orgnTypeId === this.openOrgnTypeId && obj.boolStatus === true;
        }).length === this.lstOrganizationUsers.length ) {
          this.lstOrganizations[this.secondLevelIndex].boolStatus = true;
          this.allUsersMarked = true;
        } else {
          this.lstOrganizations[this.secondLevelIndex].boolStatus = false;
          this.allUsersMarked = false;
        }

        const index = this.lstSaveConfigToDB.findIndex(x => x.userOrgnId === this.lstOrganizations[this.secondLevelIndex].orgnId
                      && x.orgnTypeId === this.openOrgnTypeId && x.userId === null);
        if (index > -1) {
            this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
            this.lstSaveConfigToDB[index].boolStatus = this.lstOrganizations[this.secondLevelIndex].boolStatus;
        } else {
            this.lstSaveConfigToDB.push({
              eulaId: this.selectedEula,
              orgnTypeId: this.openOrgnTypeId,
              userOrgnId: this.lstOrganizations[this.secondLevelIndex].orgnId,
              userId: null,
              boolStatus: this.lstOrganizations[this.secondLevelIndex].boolStatus,
            });
        }

        if (this.lstSaveConfigToDB.filter(obj => {
          return obj.userId === null && obj.userOrgnId !== null
                && obj.orgnTypeId === this.openOrgnTypeId && obj.boolStatus === true;
        }).length === this.lstOrganizations.length ) {
          this.lstOrganTypes[this.firstLevelIndex].boolStatus = true;
        } else {
          this.lstOrganTypes[this.firstLevelIndex].boolStatus = false;
        }

        const index2 = this.lstSaveConfigToDB.findIndex(x => x.orgnTypeId ===
                           this.lstOrganTypes[this.firstLevelIndex].id && x.userOrgnId === null && x.userId === null);
        if (index2 > -1) {
              this.lstSaveConfigToDB[index2].eulaId = this.selectedEula;
              this.lstSaveConfigToDB[index2].boolStatus = this.lstOrganTypes[this.firstLevelIndex].boolStatus;
        } else {
              this.lstSaveConfigToDB.push({
                eulaId: this.selectedEula,
                orgnTypeId: this.lstOrganTypes[this.firstLevelIndex].id,
                userOrgnId: null,
                userId: null,
                boolStatus: this.lstOrganTypes[this.firstLevelIndex].boolStatus,
              });
        }

        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
      });
  }



  onPageChange(event) {

    this.pagination.activePageNumber = event;
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
    this.userAccountService
      .getUserByPageNo(this.pagination.activePageNumber)
      .subscribe((data) => {
        this.hideLoader(
          this.screen,
          API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT
        );
        this.lstUsers = data.data.lstUsers;
        this.pagination.pageSize = data.data.pageSize;
        this.pagination.totalResult = data.data.pageSize;

      });
  }

  getColManageUserEnum() {
    return ColManageUserEnum;
  }
  getColManageOrganizationsEnum() {
    return ColManageOrganizationsEnum;
  }

  searchByUser() {
    const searchValue = (document.getElementById(
      'userSearchId'
    ) as HTMLInputElement).value;

    if (searchValue === '') {
      return false;
    }

    this.showQueryResult = false;
    this.initializaQueryResultsArray();

    this.userAccountService
      .LoadSearchUserByTypeCount(searchValue)
      .subscribe((response) => {
        const organByTypeCount: any[] = response.dataObject;
        const arrLength = organByTypeCount.length;

        if (arrLength >= 1) {
          this.queryResultsFound = organByTypeCount[arrLength - 1].totalCount;
        }

        if (arrLength > 1) {
          for (let i = 0; i < arrLength - 1; i++) {
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
      const objSort = {
        columnName: 'userId',
        isAscSort: false,
      };

      this.LoadManageUserUsersLstDataCall(this.organazationId, objSort);
    }

  }
  resetSearchByUser() {

    // Search box related working on toggle menu #New #Start
    this.DisableSearchChanges();
    if (this.toggle1[this.indexSecond]) {
      const objSort = {
        columnName: 'userId',
        isAscSort: false,
      };
      this.LoadManageUserUsersLstDataCall(this.organazationId, objSort);
    }
    // Search box related working on toggle menu #New #End

  }

  getColManageOrganEnum() {
    return ColManageOrganizationsEnum;
  }

  onKeyUp() {
    const searchValue = (document.getElementById(
      'userSearchId'
    ) as HTMLInputElement).value;
    this.showSearchBoxHighlighting = searchValue !== '' ? true : false;

    if (searchValue === '') {
      if (this.valueSearched && this.innerToggle) {
        this.searchQuery = '';

        const objSort = {
          columnName: 'userId',
          isAscSort: false,
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
    // this.closeSubscription.unsubscribe();
  }


  // Stepper 2 Funcations

  loadManageUserScreenMetaDataCall() {
    this.userAccountService
    .LoadManageUserScreenMetaData()
    .subscribe((response) => {
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

      this.lstOrganTypes = response.dataObject.lstOrganizationTypes;
      this.queryResultsArrayLength = this.lstOrganTypes.length; // Search Box #New

      this.lstOrganTypes.forEach((organType) => {
        organType.boolStatus = false;
      });

    });
  }

  loadUserEulaConfig() {
    this.disableSelection = false;
    this.ResetAllToggle();
    this.lstSaveConfigToDB = [];

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.userAccountService
      .loadOrganTypesWithEula(this.selectedEula)
      .subscribe((response) => {

        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

        this.lstOrganTypes = response.dataObject.lstOrganizationTypes;
        this.queryResultsArrayLength = this.lstOrganTypes.length; // Search Box #New

        this.lstOrganTypes.forEach(orgnType => {
          // if (orgnType.boolStatus) {
            this.lstSaveConfigToDB.push({
              eulaId: this.selectedEula,
              orgnTypeId: orgnType.id,
              userOrgnId: null,
              userId: null,
              boolStatus: orgnType.boolStatus,
              oldboolStatus: orgnType.boolStatus
            });
            this.isEulaAlreadyAppliedAtOrgnTypeLevel = true;
          // }
        });


      });

  }

  markAllOrgnsWithEula(index, orgnType, event) {

    if (this.isEulaSelected()) {
      return;
    }

    if (event.target.checked) {
      const index = this.lstSaveConfigToDB.findIndex(x => x.orgnTypeId === orgnType.id && x.userOrgnId === null && x.userId === null);
      if (index > -1) {
        this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
        this.lstSaveConfigToDB[index].boolStatus = orgnType.boolStatus;
      } else {
        this.lstSaveConfigToDB.push({
          eulaId: this.selectedEula,
          orgnTypeId: orgnType.id,
          userOrgnId: null,
          userId: null,
          boolStatus: orgnType.boolStatus,
        });
      }

    } else if (!event.target.checked) {

      const index = this.lstSaveConfigToDB.findIndex(x => x.orgnTypeId === orgnType.id && x.userOrgnId === null && x.userId === null);
      if (index > -1) {
        this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
        this.lstSaveConfigToDB[index].boolStatus = orgnType.boolStatus;
      } else {
        this.lstSaveConfigToDB.push({
          eulaId: this.selectedEula,
          orgnTypeId: orgnType.id,
          userOrgnId: null,
          userId: null,
          boolStatus: orgnType.boolStatus,
        });
      }

    }

    if (this.toggle[this.firstLevelIndex] && orgnType.id === this.openOrgnTypeId) {

      this.lstOrganizations.forEach(orgn => {
        orgn.boolStatus = event.target.checked;
        const index = this.lstSaveConfigToDB.findIndex(x => x.userOrgnId === orgn.orgnId
                      && x.orgnTypeId === this.openOrgnTypeId && x.userId === null);
        if (index > -1) {
          this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
          this.lstSaveConfigToDB[index].boolStatus = orgn.boolStatus;
        } else {
          this.lstSaveConfigToDB.push({
            eulaId: this.selectedEula,
            orgnTypeId: this.openOrgnTypeId,
            userOrgnId: orgn.orgnId,
            userId: null,
            boolStatus: orgn.boolStatus,
          });
        }
      });
    }

    if (this.toggle1[this.secondLevelIndex] && this.lstOrganizations[this.secondLevelIndex].orgnId === this.openOrgnId
          && orgnType.id === this.openOrgnTypeId) {
      this.lstOrganizationUsers.forEach(user => {
        if(user.userEulaStatusId !== 2) {
          user.boolStatus = event.target.checked;
        }
        const index = this.lstSaveConfigToDB.findIndex(x => x.userId === user.userId);
        if (index > -1) {
          this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
          this.lstSaveConfigToDB[index].boolStatus = user.boolStatus;
        } else {
          this.lstSaveConfigToDB.push({
            eulaId: this.selectedEula,
            orgnTypeId: this.openOrgnTypeId,
            userOrgnId: this.openOrgnId,
            userId: user.userId,
            boolStatus: user.boolStatus,
          });
        }
      });
      this.allUsersMarked = event.target.checked;
    }
    const index2 = this.lstSaveConfigToDB.findIndex(x => x.orgnTypeId ===
                    orgnType.id && x.userOrgnId === null && x.userId === null);
    if (index2 > -1) {
          this.lstSaveConfigToDB[index2].eulaId = this.selectedEula;
          this.lstSaveConfigToDB[index2].boolStatus = orgnType.boolStatus;
    } else {
          this.lstSaveConfigToDB.push({
            eulaId: this.selectedEula,
            orgnTypeId: this.lstOrganTypes[this.firstLevelIndex].id,
            userOrgnId: null,
            userId: null,
            boolStatus: this.lstOrganTypes[this.firstLevelIndex].boolStatus,
          });
    }

  }

  markOrgnWithEula(orgn, event: any) {

    event.stopPropagation();
    if (event.target.checked) {

      const index = this.lstSaveConfigToDB.findIndex(x => x.userOrgnId === orgn.orgnId
                    && x.orgnTypeId === this.openOrgnTypeId && x.userId === null);
      if (index > -1) {
        this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
        this.lstSaveConfigToDB[index].boolStatus = orgn.boolStatus;
      } else {
        this.lstSaveConfigToDB.push({
          eulaId: this.selectedEula,
          orgnTypeId: this.openOrgnTypeId,
          userOrgnId: orgn.orgnId,
          userId: null,
          boolStatus: orgn.boolStatus,
        });
      }

    } else if (!event.target.checked) {

      const index = this.lstSaveConfigToDB.findIndex(x => x.userOrgnId === orgn.orgnId
                    && x.orgnTypeId === this.openOrgnTypeId && x.userId === null);
      if (index > -1) {
        this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
        this.lstSaveConfigToDB[index].boolStatus = orgn.boolStatus;
      } else {
        this.lstSaveConfigToDB.push({
          eulaId: this.selectedEula,
          orgnTypeId: this.openOrgnTypeId,
          userOrgnId: orgn.orgnId,
          userId: null,
          boolStatus: orgn.boolStatus,
        });
      }

    }

    if (this.toggle1[this.secondLevelIndex] && orgn.orgnId === this.openOrgnId) {
      this.lstOrganizationUsers.forEach(user => {
        if(user.userEulaStatusId !== 2) {
          user.boolStatus = event.target.checked;
        }
        const index = this.lstSaveConfigToDB.findIndex(x => x.userId === user.userId);
        if (index > -1) {
          this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
          this.lstSaveConfigToDB[index].boolStatus = user.boolStatus;
        } else {
          this.lstSaveConfigToDB.push({
            eulaId: this.selectedEula,
            orgnTypeId: this.openOrgnTypeId,
            userOrgnId: this.openOrgnId,
            userId: user.userId,
            boolStatus: user.boolStatus,
          });
        }
      });
      this.allUsersMarked = event.target.checked;
    }

    if (this.lstSaveConfigToDB.filter(obj => {
      return obj.userId === null && obj.userOrgnId !== null
            && obj.orgnTypeId === this.openOrgnTypeId && obj.boolStatus === true;
    }).length === this.lstOrganizations.length ) {
      this.lstOrganTypes[this.firstLevelIndex].boolStatus = true;
    } else {
      this.lstOrganTypes[this.firstLevelIndex].boolStatus = false;
    }

    const index = this.lstSaveConfigToDB.findIndex(x => x.orgnTypeId ===
                       this.lstOrganTypes[this.firstLevelIndex].id && x.userOrgnId === null && x.userId === null);
    if (index > -1) {
          this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
          this.lstSaveConfigToDB[index].boolStatus = this.lstOrganTypes[this.firstLevelIndex].boolStatus;
    } else {
          this.lstSaveConfigToDB.push({
            eulaId: this.selectedEula,
            orgnTypeId: this.lstOrganTypes[this.firstLevelIndex].id,
            userOrgnId: null,
            userId: null,
            boolStatus: this.lstOrganTypes[this.firstLevelIndex].boolStatus,
          });
    }

  }

  markAllUsersWithEula(event) {


    if (event.target.checked) {

    } else if (!event.target.checked) {

    }

    this.lstOrganizationUsers.forEach(user => {
      if(user.userEulaStatusId !== 2) {
        user.boolStatus = event.target.checked;
      }
      const index = this.lstSaveConfigToDB.findIndex(x => x.userId === user.userId);
      if (index > -1) {
        this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
        this.lstSaveConfigToDB[index].boolStatus = user.boolStatus;
      } else {
        this.lstSaveConfigToDB.push({
          eulaId: this.selectedEula,
          orgnTypeId: this.openOrgnTypeId,
          userOrgnId: this.openOrgnId,
          userId: user.userId,
          boolStatus: user.boolStatus,
        });
      }
    });

    // Marking Organization
    if (this.lstSaveConfigToDB.filter(obj => {
      return obj.userId !== null && obj.userOrgnId === this.openOrgnId &&
              obj.orgnTypeId === this.openOrgnTypeId && obj.boolStatus === true;
    }).length === this.lstOrganizationUsers.length ) {
      this.lstOrganizations[this.secondLevelIndex].boolStatus = true;
      setTimeout(() => {
        this.allUsersMarked = true;
      }, 15);
    } else {
      this.lstOrganizations[this.secondLevelIndex].boolStatus = false;
      setTimeout(() => {
        this.allUsersMarked = false;
      }, 15);
    }

    const index = this.lstSaveConfigToDB.findIndex(x => x.userOrgnId === this.lstOrganizations[this.secondLevelIndex].orgnId
                  && x.orgnTypeId === this.openOrgnTypeId && x.userId === null);
    if (index > -1) {
        this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
        this.lstSaveConfigToDB[index].boolStatus = this.lstOrganizations[this.secondLevelIndex].boolStatus;
    } else {
        this.lstSaveConfigToDB.push({
          eulaId: this.selectedEula,
          orgnTypeId: this.openOrgnTypeId,
          userOrgnId: this.lstOrganizations[this.secondLevelIndex].orgnId,
          userId: null,
          boolStatus: this.lstOrganizations[this.secondLevelIndex].boolStatus,
        });
    }

    if (this.lstSaveConfigToDB.filter(obj => {
      return obj.userId === null && obj.userOrgnId !== null
            && obj.orgnTypeId === this.openOrgnTypeId && obj.boolStatus === true;
    }).length === this.lstOrganizations.length ) {
      this.lstOrganTypes[this.firstLevelIndex].boolStatus = true;
    } else {
      this.lstOrganTypes[this.firstLevelIndex].boolStatus = false;
    }

    const index2 = this.lstSaveConfigToDB.findIndex(x => x.orgnTypeId ===
                       this.lstOrganTypes[this.firstLevelIndex].id && x.userOrgnId === null && x.userId === null);
    if (index > -1) {
          this.lstSaveConfigToDB[index2].eulaId = this.selectedEula;
          this.lstSaveConfigToDB[index2].boolStatus = this.lstOrganTypes[this.firstLevelIndex].boolStatus;
    } else {
          this.lstSaveConfigToDB.push({
            eulaId: this.selectedEula,
            orgnTypeId: this.lstOrganTypes[this.firstLevelIndex].id,
            userOrgnId: null,
            userId: null,
            boolStatus: this.lstOrganTypes[this.firstLevelIndex].boolStatus,
          });
    }

  }

  markUserWithEula(user, event: any) {

    event.stopPropagation();
    // event.preventDefault();
    if (user.userEulaStatusId === 2) {
      return false;
    }

    if (event.target.checked) {
      const index = this.lstSaveConfigToDB.findIndex(x => x.userId === user.userId);
      if (index > -1) {
        this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
        this.lstSaveConfigToDB[index].boolStatus = user.boolStatus;
      } else {
        this.lstSaveConfigToDB.push({
          eulaId: this.selectedEula,
          orgnTypeId: this.openOrgnTypeId,
          userOrgnId: this.openOrgnId,
          userId: user.userId,
          boolStatus: user.boolStatus,
        });
      }

    } else if (!event.target.checked) {
      const index = this.lstSaveConfigToDB.findIndex(x => x.userId === user.userId);
      if (index > -1) {
        this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
        this.lstSaveConfigToDB[index].boolStatus = user.boolStatus;
      } else {
        this.lstSaveConfigToDB.push({
          eulaId: this.selectedEula,
          orgnTypeId: this.openOrgnTypeId,
          userOrgnId: this.openOrgnId,
          userId: user.userId,
          boolStatus: user.boolStatus,
        });
      }
    }

    // Marking Organization
    if (this.lstSaveConfigToDB.filter(obj => {
      return obj.userId !== null && obj.userOrgnId === this.openOrgnId &&
              obj.orgnTypeId === this.openOrgnTypeId && obj.boolStatus === true;
    }).length === this.lstOrganizationUsers.length ) {
      this.lstOrganizations[this.secondLevelIndex].boolStatus = true;
      this.allUsersMarked = true;
    } else {
      this.lstOrganizations[this.secondLevelIndex].boolStatus = false;
      this.allUsersMarked = false;
    }

    const index = this.lstSaveConfigToDB.findIndex(x => x.userOrgnId === this.lstOrganizations[this.secondLevelIndex].orgnId
                  && x.orgnTypeId === this.openOrgnTypeId && x.userId === null);
    if (index > -1) {
        this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
        this.lstSaveConfigToDB[index].boolStatus = this.lstOrganizations[this.secondLevelIndex].boolStatus;
    } else {
        this.lstSaveConfigToDB.push({
          eulaId: this.selectedEula,
          orgnTypeId: this.openOrgnTypeId,
          userOrgnId: this.lstOrganizations[this.secondLevelIndex].orgnId,
          userId: null,
          boolStatus: this.lstOrganizations[this.secondLevelIndex].boolStatus,
        });
    }
    ///////////////

    if (this.lstSaveConfigToDB.filter(obj => {
      return obj.userId === null && obj.userOrgnId !== null
            && obj.orgnTypeId === this.openOrgnTypeId && obj.boolStatus === true;
    }).length === this.lstOrganizations.length ) {
      this.lstOrganTypes[this.firstLevelIndex].boolStatus = true;
    } else {
      this.lstOrganTypes[this.firstLevelIndex].boolStatus = false;
    }

    const index2 = this.lstSaveConfigToDB.findIndex(x => x.orgnTypeId ===
                       this.lstOrganTypes[this.firstLevelIndex].id && x.userOrgnId === null && x.userId === null);
    if (index > -1) {
          this.lstSaveConfigToDB[index2].eulaId = this.selectedEula;
          this.lstSaveConfigToDB[index2].boolStatus = this.lstOrganTypes[this.firstLevelIndex].boolStatus;
    } else {
          this.lstSaveConfigToDB.push({
            eulaId: this.selectedEula,
            orgnTypeId: this.lstOrganTypes[this.firstLevelIndex].id,
            userOrgnId: null,
            userId: null,
            boolStatus: this.lstOrganTypes[this.firstLevelIndex].boolStatus,
          });
    }

  }

  saveUserEulaConfigToDB() {

    if (this.formGroupApplyEula.invalid) {
      this.isNavigated = true;
      return;
    }

    switch (this.levelOnWhichEulaApply) {
      case 1:

          let arrForOrgnType = this.lstSaveConfigToDB.filter(obj =>
            obj.orgnTypeId !== null && obj.userOrgnId === null && obj.userId === null);
          if (arrForOrgnType.filter( x => x.oldboolStatus === x.boolStatus).length === arrForOrgnType.length) {
            const alertEr: AlertModel = { type: AlertType.WARNING, message: this.saveChanges, header: HeaderType.ERROR, isUserExplicitEvent: true };
            this.notification.showNotification(alertEr);
            arrForOrgnType = [];
            return;
          }

          this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
          this.manageUserLicenseService
          .saveOrgnTypeWiseUserEulaConfigToDB(arrForOrgnType)
          .subscribe(response => {

            if (response.statusCode === STATUS_CODE.SUCCESS) {

              this.ShowSuccessNotification(response.message);
              this.lstSaveConfigToDB = [];
              this.lstSaveConfigToDB = arrForOrgnType.map(obj => {
                obj.oldboolStatus = obj.boolStatus;
                return obj;
              });
              arrForOrgnType = [];

              this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
            } else if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
              this.ShowErrorNotification(response.message);
            }
          });
          break;
      case 2:
        let arrForOrgn = this.lstSaveConfigToDB.filter(obj =>
          obj.orgnTypeId !== null && obj.userId === null);

        if (arrForOrgn.filter( x => x.oldboolStatus === x.boolStatus).length === arrForOrgn.length) {
          const alertEr: AlertModel = { type: AlertType.WARNING, message: this.saveChanges, header: HeaderType.ERROR, isUserExplicitEvent: true };
          this.notification.showNotification(alertEr);
          arrForOrgn = [];
          return;
        }

        this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
        this.manageUserLicenseService
          .saveOrgnWiseUserEulaConfigToDB(arrForOrgn)
          .subscribe(response => {
            if (response.statusCode === STATUS_CODE.SUCCESS) {

              this.ShowSuccessNotification(response.message);
              this.lstSaveConfigToDB = [];
              this.lstSaveConfigToDB = arrForOrgn
              .filter(obj => obj.orgnTypeId !== null && obj.userOrgnId === null && obj.userId === null)
              .map(obj => {
                obj.oldboolStatus = obj.boolStatus;
                return obj;
              });
              arrForOrgn = [];
              this.getCountsAfterSavingConfig();

            } else if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
              this.ShowErrorNotification(response.message);
            }
          });
        break;
      case 3:
        let arrForUsers = this.lstSaveConfigToDB.filter(obj => obj.userId !== null);

        if (arrForUsers.filter( x => x.oldboolStatus === x.boolStatus).length === arrForUsers.length) {
          const alertEr: AlertModel = { type: AlertType.WARNING, message: this.saveChanges, header: HeaderType.ERROR, isUserExplicitEvent: true };
          this.notification.showNotification(alertEr);
          arrForOrgn = [];
          return;
        }
        this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
        this.manageUserLicenseService
          .saveUserEulaConfigToDB(arrForUsers)
          .subscribe(response => {
            if (response.statusCode === STATUS_CODE.SUCCESS) {
              this.ShowSuccessNotification(response.message);
              // Not getting values from arrForUsers like arrForOrgans bcoz arrForUsers contain only users.
              this.lstSaveConfigToDB = this.lstSaveConfigToDB
              .filter(obj => obj.orgnTypeId !== null && obj.userOrgnId === null && obj.userId === null)
              .map(obj => {
                obj.oldboolStatus = obj.boolStatus;
                return obj;
              });
              arrForUsers = [];
              this.getCountsAfterSavingConfig();

            } else if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
              this.ShowErrorNotification(response.message);
            }
          });
        break;

      default:
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
        break;
    }



  }

  getCountsAfterSavingConfig() {

    if (this.toggle[this.firstLevelIndex]) {
      const objSort = {
        columnName: this.getColManageOrganEnum().orgnName,
        isAscSort: true,
      };

      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
      this.userAccountService
        .loadOrganizationsWithEulaByOrganTypeData(this.organizationTypeId, objSort, this.selectedEula)
        .subscribe((response) => {

          this.lstOrganizations = [];
          this.lstOrganizations = response.dataObject || [];

          this.lstOrganizations.forEach(orgn => {
            orgn.oldboolStatus = orgn.boolStatus;
            if (this.lstOrganTypes[this.firstLevelIndex].boolStatus) {
              orgn.boolStatus = true;
            }
            const index = this.lstSaveConfigToDB.findIndex(x => x.userOrgnId === orgn.orgnId
                            && x.orgnTypeId === this.openOrgnTypeId && x.userId === null);
            if (index > -1) {
              this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
              this.lstSaveConfigToDB[index].boolStatus = orgn.boolStatus;
            } else {
              this.lstSaveConfigToDB.push({
                eulaId: this.selectedEula,
                orgnTypeId: this.openOrgnTypeId,
                userOrgnId: orgn.orgnId,
                userId: null,
                boolStatus: orgn.boolStatus,
                oldboolStatus: orgn.oldboolStatus
              });
            }
          });

          if (this.lstSaveConfigToDB.filter(obj => {
            return obj.userId === null && obj.userOrgnId !== null
                  && obj.orgnTypeId === this.openOrgnTypeId && obj.boolStatus === true;
          }).length === this.lstOrganizations.length ) {
            this.lstOrganTypes[this.firstLevelIndex].boolStatus = true;
          } else {
            this.lstOrganTypes[this.firstLevelIndex].boolStatus = false;
          }

          const index = this.lstSaveConfigToDB.findIndex(x => x.orgnTypeId ===
                             this.lstOrganTypes[this.firstLevelIndex].id && x.userOrgnId === null && x.userId === null);
          if (index > -1) {
                this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
                this.lstSaveConfigToDB[index].boolStatus = this.lstOrganTypes[this.firstLevelIndex].boolStatus;
          } else {
                this.lstSaveConfigToDB.push({
                  eulaId: this.selectedEula,
                  orgnTypeId: this.lstOrganTypes[this.firstLevelIndex].id,
                  userOrgnId: null,
                  userId: null,
                  boolStatus: this.lstOrganTypes[this.firstLevelIndex].boolStatus,
                });
          }

          if (this.toggle1[this.secondLevelIndex]) {
            this.userAccountService
              .loadUsersWithEulaByOrganizationData(
                this.openOrgnId,
                '',
                {
                  columnName: this.getColManageUserEnum().firstName,
                  isAscSort: true,
                },
                this.selectedEula
              )
              .subscribe((response) => {

                this.lstOrganizationUsers = [];
                this.lstOrganizationUsers = response.dataObject || [];

                this.lstOrganizationUsers.forEach(user => {
                  user.oldboolStatus = user.boolStatus;
                  if (this.lstOrganizations[this.secondLevelIndex].boolStatus) {
                    user.boolStatus = true;
                  }
                  const index = this.lstSaveConfigToDB.findIndex(x => x.userId === user.userId);
                  if (index > -1) {
                    this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
                    this.lstSaveConfigToDB[index].boolStatus = user.boolStatus;
                  } else {
                    this.lstSaveConfigToDB.push({
                      eulaId: this.selectedEula,
                      orgnTypeId: this.openOrgnTypeId,
                      userOrgnId: this.openOrgnId,
                      userId: user.userId,
                      boolStatus: user.boolStatus,
                      oldboolStatus: user.boolStatus
                    });
                  }
                });

                // Marking Organization
                if (this.lstSaveConfigToDB.filter(obj => {
                  return obj.userId !== null && obj.userOrgnId === this.openOrgnId &&
                          obj.orgnTypeId === this.openOrgnTypeId && obj.boolStatus === true;
                }).length === this.lstOrganizationUsers.length ) {
                  this.lstOrganizations[this.secondLevelIndex].boolStatus = true;
                  this.allUsersMarked = true;
                } else {
                  this.lstOrganizations[this.secondLevelIndex].boolStatus = false;
                  this.allUsersMarked = false;
                }

                const index = this.lstSaveConfigToDB.findIndex(x => x.userOrgnId === this.lstOrganizations[this.secondLevelIndex].orgnId
                              && x.orgnTypeId === this.openOrgnTypeId && x.userId === null);
                if (index > -1) {
                    this.lstSaveConfigToDB[index].eulaId = this.selectedEula;
                    this.lstSaveConfigToDB[index].boolStatus = this.lstOrganizations[this.secondLevelIndex].boolStatus;
                } else {
                    this.lstSaveConfigToDB.push({
                      eulaId: this.selectedEula,
                      orgnTypeId: this.openOrgnTypeId,
                      userOrgnId: this.lstOrganizations[this.secondLevelIndex].orgnId,
                      userId: null,
                      boolStatus: this.lstOrganizations[this.secondLevelIndex].boolStatus,
                    });
                }
                ///////////////

                if (this.lstSaveConfigToDB.filter(obj => {
                  return obj.userId === null && obj.userOrgnId !== null
                        && obj.orgnTypeId === this.openOrgnTypeId && obj.boolStatus === true;
                }).length === this.lstOrganizations.length ) {
                  this.lstOrganTypes[this.firstLevelIndex].boolStatus = true;
                } else {
                  this.lstOrganTypes[this.firstLevelIndex].boolStatus = false;
                }

                const index2 = this.lstSaveConfigToDB.findIndex(x => x.orgnTypeId ===
                                  this.lstOrganTypes[this.firstLevelIndex].id && x.userOrgnId === null && x.userId === null);
                if (index2 > -1) {
                      this.lstSaveConfigToDB[index2].eulaId = this.selectedEula;
                      this.lstSaveConfigToDB[index2].boolStatus = this.lstOrganTypes[this.firstLevelIndex].boolStatus;
                } else {
                      this.lstSaveConfigToDB.push({
                        eulaId: this.selectedEula,
                        orgnTypeId: this.lstOrganTypes[this.firstLevelIndex].id,
                        userOrgnId: null,
                        userId: null,
                        boolStatus: this.lstOrganTypes[this.firstLevelIndex].boolStatus,
                      });
                }

                this.levelOnWhichEulaApply = 3
                this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
              });

          } else {
            this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
            this.levelOnWhichEulaApply = 2;
          }
        });

    } else {
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      this.levelOnWhichEulaApply = 1;
    }
  }

  private isEulaSelected() {

    // if (this.selectedEula === undefined || this.selectedEula === null) {
    if (typeof this.selectedEula === 'object') {
      const alertEr: AlertModel = { type: AlertType.DANGER, message:this.validUserAgreement, header: HeaderType.ERROR, isUserExplicitEvent: true };
      this.notification.showNotification(alertEr);
      return true;
    }
  }

  // First Functions

  resetForm() {
    this.formGroupApplyEula = new UntypedFormGroup({});
    this.formGroupApplyEula = this.formBuilder.group({
      fcApplyEula: ['', Validators.required],
    });

  }

  resetAllStates() {

    this.resetForm();
    this.selectedEula = {};
    this.ResetAllToggle();
    this.firstLevelIndex = -1;
    this.levelOnWhichEulaApply = 1;
    this.lstOrganTypes = [];
    this.disableSelection = true;
    this.lstSaveConfigToDB = [];
  }

  onStepChange(step) {
    if (step === 1) {

      this.resetAllStates();

      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
      this.loadManageEULAsMetaDataCall();

    } else if (step === 2) {

      this.resetAllStates();
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

      this.manageUserLicenseService.LoadRefDataManageEULA().subscribe(response => {
        this.lstEulaFilesDDL = [];
        this.lstEulaFilesDDL = response.dataObject;
        this.loadManageUserScreenMetaDataCall();
      });

    }
    this.stepperActiveStep = step;
  }

    // Uploading Eula relating work

    loadManageEULAsMetaDataCall() {

      this.manageUserLicenseService
        .LoadManageEULAsMetaData()
        .subscribe((response) => {
          this.lstEulaFiles = [];
          this.formGroupEula = new UntypedFormGroup({});
          this.formGroupEula = this.createGroup(response.dataObject);
          this.lstEulaFiles = response.dataObject;
          this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
        });
    }

    createGroup(dataSet) {

      const group = this.formBuilder.group({});
      dataSet.forEach((control) =>
        group.addControl(
          control.eulaId.toString(),
          this.formBuilder.control(control.isActive.toString())
        )
      );
      return group;
    }

    handleFileInput(event, files: FileList) {
      for (let i = 0; i < files.length; i++) {
        this.postFile(event, files[i], files.item(i), files.length);
      }
      event.target.value = '';
    }

    async postFile(event, fileData, file, count) {

      if (file.type !== 'application/pdf') {
        const alertEr: AlertModel = {
          type: AlertType.DANGER,
          message: this.selectPDF,
          header: HeaderType.ERROR,
          isUserExplicitEvent: true
        };
        this.notification.showNotification(alertEr);
        return;
      }

      const formData = new FormData();
      formData.append('file', file, file.name);
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);

      const responseData: any = await this.manageUserLicenseService
        .UploadEULA(formData)
        .toPromise();

      if (responseData.body !== undefined || responseData.body != null) {
        let derivedObject: ResponseVModel = new ResponseVModel();
        derivedObject = responseData.body;

        if (derivedObject.statusCode === STATUS_CODE.SUCCESS) {
          this.ShowSuccessNotification(derivedObject.message);
          this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
          this.loadManageEULAsMetaDataCall();
        }

        if (derivedObject.statusCode === STATUS_CODE.CUSTOM_ERROR) {
          this.ShowErrorNotification(derivedObject.message);
        }
      }

      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    }

    UpdateEulaName(event: Event, newEulaName: string, index: number, eula: any) {
      const oldEulaName = eula.eulaName.trim();
      newEulaName = newEulaName.trim();

      if (newEulaName.trim() === '') {
        document.getElementById(
          `eula-name-${eula.eulaId}`
        ).innerText = oldEulaName;
        return;
      } else if (oldEulaName === newEulaName) {
        document.getElementById(
          `eula-name-${eula.eulaId}`
        ).innerText = oldEulaName;
        return;
      }

      document.getElementById(`eula-name-${eula.eulaId}`).innerText = newEulaName;
      this.lstEulaFiles[index].eulaName = newEulaName;

      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      this.manageUserLicenseService.UpdateEULA(eula).subscribe((response) => {
        if (response.statusCode === STATUS_CODE.SUCCESS) {
          // this.ShowSuccessNotification(response.message);
        }
        if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
          this.ShowErrorNotification(response.message);
          this.lstEulaFiles[index].eulaName = oldEulaName;
        }

        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
      });
    }

    activeDeactiveRemove(
      mode: string,
      index: number,
      id: any,
      eula: any,
      event: Event
    ) {

      if (mode === 'remove') {
        this.translationPipe
          .getTranslation('Confirm.deleteEula', '')
          .subscribe((response) => {
            this.confirmationMessage = response;
          });
        this.eulaIndexWhichDelete = index;
      } else {
        if (this.formGroupEula.controls[id.toString()].value === 'true') {
          this.translationPipe
            .getTranslation('Confirm.activeEula', '')
            .subscribe((response) => {
              this.confirmationMessage = response;
            });
        } else {
          this.translationPipe
            .getTranslation('Confirm.deActiveEula', '')
            .subscribe((response) => {
              this.confirmationMessage = response;
            });
        }
        this.eulaIdToActiveDeactive = id.toString();
      }

      this.showConfirmationFlag = true;
      this.eulaForAction = eula;
      this.actionMode = mode;
    }

    trackByEulaId(index: number, eula: any): string {
      return eula.eulaId;
    }

    positiveAction() {

      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
      if (this.actionMode === 'remove') {
        this.manageUserLicenseService
          .deleteEULA(this.eulaForAction['eulaId'])
          .subscribe((response) => {
            if (response.statusCode === STATUS_CODE.SUCCESS) {
              this.ShowSuccessNotification(response.message);
              this.loadManageEULAsMetaDataCall();
            }
            if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
              this.ShowErrorNotification(response.message);
              this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.DELETE_EVENT);
            }
          });
      } else {


        const eula = {
          eulaId: this.eulaForAction['eulaId'],
          eulaName: this.eulaForAction['eulaName'],
          isActive: this.eulaForAction['isActive'] ? false : true
        };
        this.manageUserLicenseService.UpdateEULA(eula).subscribe((response) => {
          if (response.statusCode === STATUS_CODE.SUCCESS) {
            this.ShowSuccessNotification(response.message);
            this.loadManageEULAsMetaDataCall();
          }
          if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
            this.ShowErrorNotification(response.message);
            this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.DELETE_EVENT);
          }
        });
      }

      this.showConfirmationFlag = false;
      this.eulaIdToActiveDeactive = 0;
      this.eulaIndexWhichDelete = -1;
      this.eulaForAction = null;
      this.actionMode = '';
    }

    negativeAction() {

      if (this.actionMode === 'remove') {
      } else {
        if (this.formGroupEula.controls[this.eulaIdToActiveDeactive.toString()].value === 'true') {
          this.formGroupEula.controls[this.eulaIdToActiveDeactive.toString()].setValue('false');
        } else {
          this.formGroupEula.controls[this.eulaIdToActiveDeactive.toString()].setValue('true');
        }
      }

      this.showConfirmationFlag = false;
      this.eulaIdToActiveDeactive = 0;
      this.eulaIndexWhichDelete = -1;
      this.eulaForAction = null;
      this.actionMode = '';
    }

    viewEula(index: number, eula: any, event: Event) {
      event.stopPropagation();
      // event.preventDefault();

      const eulaParam = {
        eulaServePath: eula.eulaServePath,
      };
      this.ResetAllToggle();
      this.displayPopup = true;
      this.popupController.updateModalSize('lg');
      this.popupController.popupHeader = eula.eulaName;

      this.popupController.updateParams(eulaParam);
      this.popupController.updateComponent(ViewUserLicenseComponent);
    }

    private makeObjectForConfig() {

    }

}
