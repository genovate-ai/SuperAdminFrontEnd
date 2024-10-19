import { Component, OnInit, ViewChild, EventEmitter, Output, ɵConsole } from '@angular/core';

import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { ActivatedRoute } from '@angular/router';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ManageRoleService } from 'src/app/shared/services/manage-role-services/manage-role-service.service';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { AccountService } from 'src/app/shared/services/common/account.service';
import {   ColManageUserEnum, ColManageOrganizationsEnum, SCREEN_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';


@Component({
  selector: 'view-allusers.component',
  templateUrl: './view-all-users.component.html' 
})
export class ViewAllUsersComponent extends BaseFormComponent implements OnInit {

  roleId: string;
  lstOrganizationUsers: Array<any> = [];
  usrColName: string = null;
  userSort : number =  1;

  constructor(
    private manageRoleService: ManageRoleService,
    private route: ActivatedRoute,
    protected notification: NotificationServiceService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService, 
    protected accountService:AccountService

  ) {

    super(translationPipe, popupController, notification, accountService);
  }


  ngOnInit() {

    if (this.route.snapshot.paramMap.get('id')) { 
      this.roleId = this.route.snapshot.paramMap.get('id');
    } else {
      this.roleId = this.popupController.getParams() as string;
    }

    this.resetForm();

  }

  

  resetForm() {
    
    var objSort = {
      columnName: ColManageUserEnum.firstName, //"userFirstName",
      isAscSort: true
    };
    this.showLoader(SCREEN_CODE.ManageRole, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT )
    this.manageRoleService.LoadManageAllUsersByRoleMetaData (this.roleId,objSort)
      .subscribe(response => {
        this.hideLoader(SCREEN_CODE.ManageRole, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT )

        this.lstOrganizationUsers = response.dataObject;
       
      });

   
  }
  LoadManageRolesLstData( colName, isAsc, notSorting) {
  
    var objSort = {
      columnName: colName,
      isAscSort: isAsc
    };
  
    this.usrColName = colName;
  
    
    if (this.userSort !== 2) {
      this.userSort = 2;
    }
    else {
      this.userSort = 3;
      objSort.isAscSort = false;
    }
  
    this.lstOrganizationUsers = [];

    this.showLoader(SCREEN_CODE.ManageRole, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
      this.manageRoleService
        .LoadManageAllUsersByRoleMetaData(this.roleId, objSort)
        .subscribe(response => {
          
          this.hideLoader(SCREEN_CODE.ManageRole, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
          this.lstOrganizationUsers = response.dataObject;

          
        });
  }
  getColManageUserEnum() {
    return ColManageUserEnum;
  }
  getColManageOrganizationsEnum() {
    return ColManageOrganizationsEnum;
  }



}