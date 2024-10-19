import { Component, OnInit, ViewChild, EventEmitter, Output, ɵConsole } from '@angular/core';

import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { ActivatedRoute } from '@angular/router';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ManageRoleService } from 'src/app/shared/services/manage-role-services/manage-role-service.service';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { ColManageUserEnum, ColManageOrganizationsEnum, SCREEN_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import * as d3 from 'd3';

@Component({
  selector: 'app-view-all-roles-users',
  templateUrl: './view-all-roles-users.component.html',
  styleUrls: ['./view-all-roles-users.component.scss']
})
export class ViewAllRolesUsersComponent extends BaseFormComponent implements OnInit {

  roleId: string;
  lstReportRolesUsers: Array<any> = [];
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
    this.manageRoleService.GetAllUsersByReportRole (this.roleId,objSort)
      .subscribe(response => {
        this.hideLoader(SCREEN_CODE.ManageRole, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT )

        this.lstReportRolesUsers = response.dataObject;
      });


  }
  LoadManageRolesLstData( colName, isAsc, notSorting) {

    var objSort = {
      columnName: colName,
      isAscSort: isAsc
    };

    this.usrColName = colName;


    // if (this.userSort !== 2) {
    //   this.userSort = 2;
    // }
    // else {
    //   this.userSort = 3;
    //   objSort.isAscSort = false;
    // }



    this.showLoader(SCREEN_CODE.ManageRole, API_CALLEVENTGROUP_CODE.SORTING_EVENT);
      this.manageRoleService
        .GetAllUsersByReportRole(this.roleId, objSort)
        .subscribe(response => {

          this.lstReportRolesUsers = [];
          this.lstReportRolesUsers = response.dataObject;
          this.hideLoader(SCREEN_CODE.ManageRole, API_CALLEVENTGROUP_CODE.SORTING_EVENT);


        });
  }
  getColManageUserEnum() {
    return ColManageUserEnum;
  }
  getColManageOrganizationsEnum() {
    return ColManageOrganizationsEnum;
  }

  applySort(event, thSort) {

    event.stopPropagation();
    let th = d3.select(thSort);
    let field_name = th.attr('data-field_name');
    let sort_state = th.attr('data-sort_state');
    let icon_type = th.attr('data-icon_type');


    d3.selectAll('#table-header-log th')
      .selectAll('span.th-sort-img')
      .style('visibility', 'hidden')
      .style('opacity', '0');

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

    if (isAscendingOrder) {
      d3.select(thSort).classed('sort_asc', true);
    } else {
      d3.select(thSort).classed('sort_desc', true);
    }

    this.LoadManageRolesLstData(field_name, isAscendingOrder, false);

  }

}
