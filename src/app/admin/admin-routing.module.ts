import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoleComponent } from './components/roles/manage-role.component';
import { CreateUserComponent } from './components/users/create-user.component';
import { UpdateUserComponent } from './components/users/update-user.component';
import { CanopyCoverageComponent } from './components/canopy-coverage/canopy-coverage.component';

import { ManageReportConfgComponent } from './components/report/configuration/manage-reportconfg.component';
import { ManageReportRoleComponent } from './components/report/roles/manage-reportRole.component';
import { ManageProfileComponent } from '../generic-ui-components/components/user-profile/manage-profile.component';
import { ManageUserLicenseComponent } from './components/user-license/manage-user-license.component';
import { ManageUserV3Component } from './components/users/manage-user-v3/manage-user-v3.component';
import { ManageOrganizationV2Component } from './components/organization/manage-organization-v2/manage-organization-v2.component';

const routes: Routes = [
  { path: 'roles', component: ManageRoleComponent, data: { title: 'Manage Roles' } },
  { path: 'canopy', component: CanopyCoverageComponent, data: { title: 'Manage Canopy' } },
  { path: 'create-user', component: CreateUserComponent , data: { title: 'Create User' }}, 
  { path: 'update-user/:id', component: UpdateUserComponent , data: { title: 'Update User' }},
  { path: 'users', component: ManageUserV3Component, data: { title: 'Manage Users' } },
  { path: 'organizations', component: ManageOrganizationV2Component, data: { title: 'Manage Organization' } },

  { path: 'reportconfg', component: ManageReportConfgComponent, data: { title: 'Manage Report Config' } },
  { path: 'reportroles', component: ManageReportRoleComponent, data: { title: 'Manage Report Roles' } },

  
  { path: 'profile', component: ManageProfileComponent, data: { title: 'User Profile' } },

  { path: 'user-agreement', component: ManageUserLicenseComponent, data: { title: 'Manage License' } },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
