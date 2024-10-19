import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,

  UntypedFormArray,
  UntypedFormControl,

} from '@angular/forms';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { ActivatedRoute } from '@angular/router';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { STATUS_CODE, EVENTGROUP_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { BaseReportRoleFormComponent } from './base-reportRoleform.component';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import { ReportRoleAccessRightVM } from 'src/app/shared/models/reports/ReportRoleAccessRightVM';
import { ReportGroupAccessRightVM } from 'src/app/shared/models/reports/ReportGroupAccessRightV.Model';
import { ReportAccessRightVM } from 'src/app/shared/models/reports/ReportAccessRightV.Model';
import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { element } from 'protractor';


@Component({
  selector: 'app-create-reportRights',
  templateUrl: './create-reportRights.component.html',
  animations: [
    trigger('flyInOut', [
      // transition('void => *', [
      //   style({ height: '0px', opacity: '0' }), //
      //   animate(250),
      // ]),
      transition('* => void', [
        animate(250, style({ height: '0px', opacity: '0' })),
      ]),
    ]),
  ],
})
export class CreateReportRightsComponent extends BaseReportRoleFormComponent implements OnInit {

  eventGroup = EVENTGROUP_CODE.UPDATE;
  form: UntypedFormGroup;
  isFromUpdateComponent: boolean = true;
  isNavigated: boolean = false;
  lclUserRoleId: number;
  roleId: string;
  reportRolesAccessRight: ReportRoleAccessRightVM;
  accessGroupRightsCTR = new UntypedFormArray([]);
  accessReportRightsCTR = new UntypedFormArray([]);
  gID: any;
  reportsCounter: Array<{
    totalReports: number,
    allowedReports: number,
    groupID: number
  }> = [];
  counter = 0;
  reportsViewAllow: boolean = false;
  homeReportSelected: any = false;
  confirmationMessage = "";
  showConfirmationFlag: boolean;
  idToDelete: number;
  defaultreportGroup: any;
  showSelectAll = false;
  setBg = true;
  selectedRight : any;
  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected manageReportService: ManageReportService,
    private route: ActivatedRoute,
    protected notification: NotificationServiceService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected accountService: AccountService,
    private _ngZone: NgZone,
    private cdr: ChangeDetectorRef

  ) {
    super(formBuilder, translationPipe, popupController, notification, accountService);
  }


  ngOnInit() {
    this.SetRoleSecurity(this.screen, this.eventGroup);
    if (this.route.snapshot.paramMap.get('id')) { // if this components is called via routing
      this.roleId = this.route.snapshot.paramMap.get('id');
    } else { // if this components is called via popup
      this.roleId = this.popupController.getParams() as string;
    }

    this.resetForm();


  }

  submit({
    fcLstReportAccessRights,
    fcLstGroupAccessRights
  }) {
    const lstReportRoleAccessRight: ReportRoleAccessRightVM = new ReportRoleAccessRightVM;
    lstReportRoleAccessRight.lstReportAccessRights = [];
    lstReportRoleAccessRight.lstReportGroupAccessRights = [];
    const arrayControl1 = fcLstGroupAccessRights as UntypedFormArray;
    const arrayControl2 = fcLstReportAccessRights as UntypedFormArray;

    for (let index = 0; index < arrayControl1.length; index++) {
      const element = arrayControl1[index];
      const lclReportGroupAccessRightVM: ReportGroupAccessRightVM = {
        reportGroupAccessRightID: element.fcreportGroupAccessRightID,
        reportRoleID: parseInt(this.roleId),
        ieReportGroupID: element.fcgroupid,
        ieHelperReportGroupID: 0,
        groupName: '',
        isViewAllow: element.fcIsView,
        isActive: true,
        isDeleted: false
      };
      lstReportRoleAccessRight.lstReportGroupAccessRights.push(lclReportGroupAccessRightVM);
    }

    for (let index = 0; index < arrayControl2.length; index++) {
      const element = arrayControl2[index];
      const lclReportAccessRightVM: ReportAccessRightVM = {
        reportAccessRightID: element.fcreportAccessRightID,
        reportRoleID: parseInt(this.roleId),
        ieReportID: element.fcieHelperReportID,
        setHome: element.fcsetHome,
        isViewAllow: element.fcIsView,
        ieReportGroupID: element.fcieReportGroupID,
        isActive: true,
        isDeleted: false,
        ieHelperReportID: 0,
        displayName: '',
        description: '',
        reportName: '',
        ieReportConfigurationID: element.fcieReportConfigurationID,
        fieldAccess: element.fcFieldAccess,
        fieldReportRoleAccess: element.fcFieldReportRoleAccess,
        fcSearchFieldAccess: element.fcSearchFieldAccess || '',
        fcShowAllFields: element.fcShowAllFields || false,
        fcHiddenFieldsCnt: 0

      };
      lstReportRoleAccessRight.lstReportAccessRights.push(lclReportAccessRightVM);
    }

    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    this.manageReportService.SaveReportRoleAccessRights(lstReportRoleAccessRight).subscribe(response => {
      if (response.statusCode === STATUS_CODE.SUCCESS) {
        this.ShowSuccessNotification(response.message);
        //this.resetForm();
        this.close();
      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {
        this.ShowErrorNotification(response.message);
      }
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    });
  }

  resetForm() {
    while (this.accessReportRightsCTR.length !== 0) {
      this.accessReportRightsCTR.removeAt(0)
    }
    while (this.accessGroupRightsCTR.length !== 0) {
      this.accessGroupRightsCTR.removeAt(0)
    }
    this.form = this.formBuilder.group({
      fcSelectAll: false,
      fcLstGroupAccessRights: this.accessGroupRightsCTR,
      fcLstReportAccessRights: this.accessReportRightsCTR
    });
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageReportService.LoadManageReportRoleAccessRight(this.roleId).subscribe(response => {

      this.reportRolesAccessRight = response.dataObject;

      for (const rightobj of this.reportRolesAccessRight.lstReportGroupAccessRights) {
        this.reportsCounter[this.counter++] = {
          totalReports: 0,
          allowedReports: 0,
          groupID: rightobj.ieHelperReportGroupID
        }
        this.accessGroupRightsCTR.push(
          new UntypedFormGroup({
            fcgroupName: new UntypedFormControl(rightobj.groupName),
            fcgroupid: new UntypedFormControl(rightobj.ieHelperReportGroupID),
            fcIsView: new UntypedFormControl(rightobj.isViewAllow.toString()),
            fcreportRoleID: new UntypedFormControl(rightobj.reportRoleID),
            fcreportGroupAccessRightID: new UntypedFormControl(rightobj.reportGroupAccessRightID)

          })
        );
      }

      for (const rightobj of this.reportRolesAccessRight.lstReportAccessRights) {
        if (rightobj.setHome) {
          this.homeReportSelected = true;
          this.defaultreportGroup = rightobj.ieReportGroupID;
        }
        //To Calculate total reports and allowed
        for (let i = 0; i < this.counter; i++) {
          if (this.reportsCounter[i].groupID == rightobj.ieReportGroupID) {
            this.reportsCounter[i].totalReports++;
            if (rightobj.isViewAllow) {
              this.reportsCounter[i].allowedReports++;
            }
          }
        }

        this.accessReportRightsCTR.push(
          new UntypedFormGroup({
            fcdisplayName: new UntypedFormControl(rightobj.displayName),
            fcdescription: new UntypedFormControl(rightobj.description),
            fcreportName: new UntypedFormControl(rightobj.reportName),
            fcsetHome: new UntypedFormControl(rightobj.setHome),
            fcIsView: new UntypedFormControl(rightobj.isViewAllow),
            fcreportAccessRightID: new UntypedFormControl(rightobj.reportAccessRightID),
            fcreportRoleID: new UntypedFormControl(rightobj.reportRoleID),
            fcieHelperReportID: new UntypedFormControl(rightobj.ieHelperReportID),
            fcieReportGroupID: new UntypedFormControl(rightobj.ieReportGroupID),
            fcieReportConfigurationID: new UntypedFormControl(rightobj.ieReportConfigurationID),
            fcFieldAccess: new UntypedFormControl(rightobj.fieldAccess),
            fcShowAccessFields: new UntypedFormControl(rightobj.showAccessFields),
            fcFieldReportRoleAccess: new UntypedFormControl(rightobj.fieldReportRoleAccess),
            fcSearchFieldAccess: new UntypedFormControl(''),
            fcShowAllFields: new UntypedFormControl(rightobj.fcShowAllFields ? rightobj.fcShowAllFields : false),
            fcHiddenFieldsCnt: new UntypedFormControl(0)
          })
        );
      }
      this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
    });
    // //MEMO: Role Management
    if (!this.isSaveButtonAllow) {
      this.form.disable();
    }
  }

  get formGroupData() {

    return <UntypedFormArray>this.form.get('fcLstGroupAccessRights');
  }

  get formReportData() {

    return <UntypedFormArray>this.form.get('fcLstReportAccessRights');
  }

  updateGroupID(groupID, viewAllow, id) {
    this.selectedRight = id
    if (viewAllow == "true") {
      this.reportsViewAllow = true;
    }
    else {
      this.reportsViewAllow = false;
    }
    this.gID = groupID;
    this.checkIndexSelectAll();
    this.setBg = true;
  }

  checkbackgoundcolor(id) {
    if (id != this.gID) {
      return true;
    }
    return false;
  }

  getReportCount(id, fcIsView) {
    for (let i = 0; i < this.counter; i++) {
      if (id == this.reportsCounter[i].groupID && fcIsView == 'true') {
        return this.reportsCounter[i].allowedReports + ' of ' + this.reportsCounter[i].totalReports + ' reports allowed.';

      }
    }
    return '';
  }
  checkIndexSelectAll() {
    let boolNotAllSelected = false;
    for (let i = 0; i < this.form.get('fcLstReportAccessRights').value.length; i++) {
      if (this.form.get('fcLstReportAccessRights').value[i].fcieReportGroupID == this.gID && this.form.get('fcLstReportAccessRights').value[i].fcIsView != true) {
        boolNotAllSelected = true;
      }
    }
    if (boolNotAllSelected) {
      this.form.controls['fcSelectAll'].setValue(false);
    }
    else {
      this.form.controls['fcSelectAll'].setValue(true);
    }

  }
  selectAllViewReport(e) {

    let array: any = this.form.get('fcLstReportAccessRights').value.map(x => Object.assign({}, x));

    while (this.accessReportRightsCTR.length !== 0) {
      this.accessReportRightsCTR.removeAt(0)
    }
    for (let i = 0; i < array.length; i++) {
      if (array[i].fcieReportGroupID == this.gID && e.target.checked) {
        let myFormGroup = new UntypedFormGroup({
          fcdisplayName: new UntypedFormControl(array[i].fcdisplayName),
          fcdescription: new UntypedFormControl(array[i].fcdescription),
          fcreportName: new UntypedFormControl(array[i].fcreportName),
          fcsetHome: new UntypedFormControl(array[i].fcsetHome),
          fcIsView: new UntypedFormControl(true),
          fcreportAccessRightID: new UntypedFormControl(array[i].fcreportAccessRightID),
          fcreportRoleID: new UntypedFormControl(array[i].fcreportRoleID),
          fcieHelperReportID: new UntypedFormControl(array[i].fcieHelperReportID),
          fcieReportGroupID: new UntypedFormControl(array[i].fcieReportGroupID),
          fcieReportConfigurationID: new UntypedFormControl(array[i].fcieReportConfigurationID),
          fcFieldAccess: new UntypedFormControl(array[i].fcFieldAccess),
          fcShowAccessFields: new UntypedFormControl(array[i].fcShowAccessFields),
          fcFieldReportRoleAccess: new UntypedFormControl(array[i].fcFieldReportRoleAccess),
          fcSearchFieldAccess: new UntypedFormControl(''),
          fcShowAllFields: new UntypedFormControl(array[i].fcShowAllFields ? array[i].fcShowAllFields : false),
          fcHiddenFieldsCnt: new UntypedFormControl(0)
        });
        this.accessReportRightsCTR.push(myFormGroup);
      }
      else if (array[i].fcieReportGroupID == this.gID && !e.target.checked) {
        let myFormGroup = new UntypedFormGroup({
          fcdisplayName: new UntypedFormControl(array[i].fcdisplayName),
          fcdescription: new UntypedFormControl(array[i].fcdescription),
          fcreportName: new UntypedFormControl(array[i].fcreportName),
          fcsetHome: new UntypedFormControl(array[i].fcsetHome),
          fcIsView: new UntypedFormControl(false),
          fcreportAccessRightID: new UntypedFormControl(array[i].fcreportAccessRightID),
          fcreportRoleID: new UntypedFormControl(array[i].fcreportRoleID),
          fcieHelperReportID: new UntypedFormControl(array[i].fcieHelperReportID),
          fcieReportGroupID: new UntypedFormControl(array[i].fcieReportGroupID),
          fcieReportConfigurationID: new UntypedFormControl(array[i].fcieReportConfigurationID),
          fcFieldAccess: new UntypedFormControl(array[i].fcFieldAccess),
          fcShowAccessFields: new UntypedFormControl(array[i].fcShowAccessFields),
          fcFieldReportRoleAccess: new UntypedFormControl(array[i].fcFieldReportRoleAccess),
          fcSearchFieldAccess: new UntypedFormControl(''),
          fcShowAllFields: new UntypedFormControl(array[i].fcShowAllFields ? array[i].fcShowAllFields : false),
          fcHiddenFieldsCnt: new UntypedFormControl(0)
        })
        this.accessReportRightsCTR.push(myFormGroup);
      }
      else {
        let myFormGroup = new UntypedFormGroup({
          fcdisplayName: new UntypedFormControl(array[i].fcdisplayName),
          fcdescription: new UntypedFormControl(array[i].fcdescription),
          fcreportName: new UntypedFormControl(array[i].fcreportName),
          fcsetHome: new UntypedFormControl(array[i].fcsetHome),
          fcIsView: new UntypedFormControl(array[i].fcIsView),
          fcreportAccessRightID: new UntypedFormControl(array[i].fcreportAccessRightID),
          fcreportRoleID: new UntypedFormControl(array[i].fcreportRoleID),
          fcieHelperReportID: new UntypedFormControl(array[i].fcieHelperReportID),
          fcieReportGroupID: new UntypedFormControl(array[i].fcieReportGroupID),
          fcieReportConfigurationID: new UntypedFormControl(array[i].fcieReportConfigurationID),
          fcFieldAccess: new UntypedFormControl(array[i].fcFieldAccess),
          fcShowAccessFields: new UntypedFormControl(array[i].fcShowAccessFields),
          fcFieldReportRoleAccess: new UntypedFormControl(array[i].fcFieldReportRoleAccess),
          fcSearchFieldAccess: new UntypedFormControl(''),
          fcShowAllFields: new UntypedFormControl(array[i].fcShowAllFields ? array[i].fcShowAllFields : false),
          fcHiddenFieldsCnt: new UntypedFormControl(0)
        })
        this.accessReportRightsCTR.push(myFormGroup);
      }
    }
    this.reportCountCheckAll(e.target.checked);
    this.setBg = true;
  }

  reportCountCheckAll(checked) {
    let i = 0;
    for (i; i < this.counter; i++) {
      if (this.reportsCounter[i].groupID == this.gID) {
        break;
      }
    }
    if (checked) {
      this.reportsCounter[i].allowedReports = this.reportsCounter[i].totalReports;
    }
    else {
      this.reportsCounter[i].allowedReports = 0;
    }
  }

  reportCountCheck(value, groupID) {
    let i = 0;
    for (i; i < this.counter; i++) {
      if (this.reportsCounter[i].groupID == groupID) {
        break;
      }
    }
    if (value) {
      this.reportsCounter[i].allowedReports++;
    }
    else {
      this.reportsCounter[i].allowedReports--;
    }
    this.checkIndexSelectAll();
  }

  ReportSetHome(index, isSelected, sID) {
    if (isSelected && this.homeReportSelected) {
      this.RemoveSetHome(index)
    }
    else if (isSelected && !this.homeReportSelected) {
      this.homeReportSelected = true;
      this.defaultreportGroup = sID;
    }
    else if (!isSelected) {
      this.homeReportSelected = false;
      this.defaultreportGroup = -99;
    }
  }

  RemoveSetHome(id) {
    this.translationPipe.getTranslation('Confirm.alreadyHasHomeReport', '').subscribe(response => {
      this.confirmationMessage = response;
    });
    this.showConfirmationFlag = true;
    this.idToDelete = id;
  }

  positiveDelete() {
    let array: any = this.form.get('fcLstReportAccessRights').value.map(x => Object.assign({}, x));
    while (this.accessReportRightsCTR.length !== 0) {
      this.accessReportRightsCTR.removeAt(0)
    }
    for (let i = 0; i < array.length; i++) {
      let val = false;
      if (i == this.idToDelete) {
        val = true;
        this.defaultreportGroup = array[i].fcieReportGroupID;
      }
      let myFormGroup = new UntypedFormGroup({
        fcdisplayName: new UntypedFormControl(array[i].fcdisplayName),
        fcdescription: new UntypedFormControl(array[i].fcdescription),
        fcreportName: new UntypedFormControl(array[i].fcreportName),
        fcIsView: new UntypedFormControl(array[i].fcIsView),
        fcsetHome: new UntypedFormControl(val),
        fcreportAccessRightID: new UntypedFormControl(array[i].fcreportAccessRightID),
        fcreportRoleID: new UntypedFormControl(array[i].fcreportRoleID),
        fcieHelperReportID: new UntypedFormControl(array[i].fcieHelperReportID),
        fcieReportGroupID: new UntypedFormControl(array[i].fcieReportGroupID),
        fcieReportConfigurationID: new UntypedFormControl(array[i].fcieReportConfigurationID),
        fcFieldAccess: new UntypedFormControl(array[i].fcFieldAccess),
        fcShowAccessFields: new UntypedFormControl(array[i].fcShowAccessFields),
        fcFieldReportRoleAccess: new UntypedFormControl(array[i].fcFieldReportRoleAccess),
        fcSearchFieldAccess: new UntypedFormControl(''),
        fcShowAllFields: new UntypedFormControl(array[i].fcShowAllFields ? array[i].fcShowAllFields : false),
        fcHiddenFieldsCnt: new UntypedFormControl(0)
      })
      this.accessReportRightsCTR.push(myFormGroup);
    }
    this.showConfirmationFlag = false;
    this.idToDelete = 0;
  }

  negativeDelete() {
    let array: any = this.form.get('fcLstReportAccessRights').value.map(x => Object.assign({}, x));
    while (this.accessReportRightsCTR.length !== 0) {
      this.accessReportRightsCTR.removeAt(0)
    }
    for (let i = 0; i < array.length; i++) {
      let val = array[i].fcsetHome;
      if (i == this.idToDelete) {
        val = false;
      }
      let myFormGroup = new UntypedFormGroup({
        fcdisplayName: new UntypedFormControl(array[i].fcdisplayName),
        fcdescription: new UntypedFormControl(array[i].fcdescription),
        fcreportName: new UntypedFormControl(array[i].fcreportName),
        fcIsView: new UntypedFormControl(array[i].fcIsView),
        fcsetHome: new UntypedFormControl(val),
        fcreportAccessRightID: new UntypedFormControl(array[i].fcreportAccessRightID),
        fcreportRoleID: new UntypedFormControl(array[i].fcreportRoleID),
        fcieHelperReportID: new UntypedFormControl(array[i].fcieHelperReportID),
        fcieReportGroupID: new UntypedFormControl(array[i].fcieReportGroupID),
        fcieReportConfigurationID: new UntypedFormControl(array[i].fcieReportConfigurationID),
        fcFieldAccess: new UntypedFormControl(array[i].fcFieldAccess),
        fcShowAccessFields: new UntypedFormControl(array[i].fcShowAccessFields),
        fcFieldReportRoleAccess: new UntypedFormControl(array[i].fcFieldReportRoleAccess),
        fcSearchFieldAccess: new UntypedFormControl(''),
        fcShowAllFields: new UntypedFormControl(array[i].fcShowAllFields ? array[i].fcShowAllFields : false),
        fcHiddenFieldsCnt: new UntypedFormControl(0)
      })
      this.accessReportRightsCTR.push(myFormGroup);
    }
    this.showConfirmationFlag = false;
    this.idToDelete = 0;
  }

  trackByFieldId(index: number, item: any): string {
    return item.fieldId;
  }
  markUnmarkAccessField(item) {
    if (item.sysIndicator === true && item.isViewAllow === true) {
      return;
    } else {
      if (item.dataState === 'NotModified') {
        item.dataState = 'DataModified';
      } else if (item.dataState === 'DataModified') {
        item.dataState = 'NotModified';
      } else {
        item.dataState = item.dataState;
      }
      // item.dataState = item.dataState === 'NotModified' ? 'DataModified' : 'NotModified';
      item.isViewAllow = !item.isViewAllow;
    }
  }

  showHideFields(right) {
    // setTimeout(() => {
    right.controls['fcShowAccessFields'].setValue(!right.controls['fcShowAccessFields'].value);
    right.controls['fcSearchFieldAccess'].setValue('');
    if(right.controls['fcShowAccessFields'].value == false) {
      right.controls['fcShowAllFields'].setValue(false);
    }

    // }, 0);

  }
  getBg() {
    // this._ngZone.runOutsideAngular(() => {
      if (this.setBg) {
        // setTimeout(() => {
          this.applyClass();
          this.setBg = false;
        // });
        this.cdr.detectChanges();
      }
    // });

  }

  applyClass() {
    let arr = document.querySelectorAll('tr.bg-change');
    if (arr.length) {
      for (let i = 0; i < arr.length; ++i) {
        if (i % 2 != 0) {
          arr[i].classList.add('bg-row-gray');
        }
      }
    }
  }

}
