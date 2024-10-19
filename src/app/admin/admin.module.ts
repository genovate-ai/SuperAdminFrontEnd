import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from 'src/app/shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { ManageRoleComponent } from './components/roles/manage-role.component';
//import { ManageRolePermissionComponent } from './components/roles/manage-role-permission.component';
import { UpdateRoleComponent } from './components/roles/update-role.component';
import { CreateRoleComponent } from './components/roles/create-role.component';
//import { UpdateRoleComponent } from './components/roles/update-role.component';


import { CreateUserComponent } from './components/users/create-user.component';
import { UpdateUserComponent } from './components/users/update-user.component';
import { ManageUserComponent } from './components/users/manage-user.component';
import { ManageOrganizationComponent } from './components/organization/manage-organization.component';
import { CreateOrganizationComponent } from './components/organization/create-organization.component';
import { UpdateOrganizationComponent } from './components/organization/update-organization.component';

import { CreateRightsComponent } from './components/roles/create-rights.component';
import { BaseRoleFormComponent } from './components/roles/base-roleform.component';
import { BaseUserFormComponent } from './components/users/base-userform.component';
import { ViewAllUsersComponent } from './components/roles/view-allusers.component';
import { baseorganizationformcomponent } from './components/organization/base-organizationform.component';
import { TreeviewModule } from 'ngx-treeview';
import { CreateReportConfgComponent } from './components/report/configuration/create-reportconfg.component';
import { UpdateReportConfgComponent } from './components/report/configuration/update-reportconfg.component';
import { ManageReportConfgComponent } from './components/report/configuration/manage-reportconfg.component';
import { ManageReportComponent } from './components/report/roles/manage-reportconfg.component';
import { CreateReportRoleComponent } from './components/report/roles/create-reportRole.component';
import { ManageReportRoleComponent } from './components/report/roles/manage-reportRole.component';
import { UpdateReportRoleComponent } from './components/report/roles/update-reportRole.component';
import { CreateReportRightsComponent } from './components/report/roles/create-reportRights.component';
import { BaseReportRoleFormComponent } from './components/report/roles/base-reportRoleform.component';
import { BaseReportFormComponent } from './components/report/roles/base-reportform.component';
import { BaseReportFormConfigurationComponent } from './components/report/configuration/base-reportform.component';
import { GenericUiComponentsModule } from '../generic-ui-components/generic-ui-components.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { ManageUserLicenseComponent } from './components/user-license/manage-user-license.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ViewUserLicenseComponent } from './components/user-license/view-user-license.component';
import { UserLicenseLogComponent } from './components/user-license/user-license-log.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ViewAllRolesUsersComponent } from './components/report/roles/view-all-users/view-all-roles-users/view-all-roles-users.component';
import { NgxPrintModule } from 'ngx-print';
import { ReportFiltersModule } from '../report-filters/report-filters.module';
import { ManageUserV3Component } from './components/users/manage-user-v3/manage-user-v3.component';
import { UserRolesRightsComponent } from './components/users/user-roles-rights/user-roles-rights.component';
import { ManageOrganizationV2Component } from './components/organization/manage-organization-v2/manage-organization-v2.component';
import { AgmCoreModule } from '@agm/core';

import { CanopyCoverageComponent } from './components/canopy-coverage/canopy-coverage.component'
import { CreatecanopyComponent } from './components/canopy-coverage/create-canopy.component';
import { UpdateCanopyComponent } from './components/canopy-coverage/update-canopy.component';

import { AgmDrawingModule } from '@agm/drawing';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { AdminUserPreferenceFieldsComponent } from './components/admin-user-preference-fields/admin-user-preference-fields.component';





// eportR
@NgModule({
  declarations: [
    ManageRoleComponent,
    UpdateRoleComponent,
    CreateRoleComponent,
    CreateRightsComponent,

    CanopyCoverageComponent,
    CreatecanopyComponent,
    UpdateCanopyComponent,

    CreateReportRightsComponent,
    ManageReportRoleComponent,
    UpdateReportRoleComponent,
    CreateReportRoleComponent,

    CreateReportConfgComponent,
    UpdateReportConfgComponent,
    ManageReportConfgComponent,
    ManageReportComponent,
    

    UpdateUserComponent,
    CreateUserComponent,
    ManageUserComponent,
    

    ManageOrganizationComponent,
    CreateOrganizationComponent,
    UpdateOrganizationComponent,

    BaseRoleFormComponent,
    BaseUserFormComponent,
    baseorganizationformcomponent,
    ViewAllUsersComponent,

    BaseReportRoleFormComponent,
    BaseReportFormComponent,
    CreateReportRoleComponent,
    CreateReportRightsComponent,
    CreateReportConfgComponent,
    UpdateReportRoleComponent,
    UpdateReportConfgComponent,
    BaseReportFormConfigurationComponent,

    ManageUserLicenseComponent,
    ViewUserLicenseComponent,
    UserLicenseLogComponent,

    ViewAllRolesUsersComponent,

    ViewAllRolesUsersComponent,

    ManageUserV3Component,
    UserRolesRightsComponent,
    ManageOrganizationV2Component,
 
    AdminUserPreferenceFieldsComponent,
       
  ],
  imports: [
    TreeviewModule.forRoot(),
    NgbModule,
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    NgSelectModule,
    NgbDatepickerModule,
    GenericUiComponentsModule,
    SortablejsModule,
    NgxDocViewerModule,
    NgxBarcodeModule,
    NgxPrintModule,
    ReportFiltersModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCSc_d7Beq3sMzjqP3TX0S0Hq9FNL4m0J0',
      libraries: ['places', 'drawing', 'geometry']
    }),
    AgmDrawingModule,
    NgxMapboxGLModule,
    SortablejsModule
  ]
    

})
export class AdminModule { }
