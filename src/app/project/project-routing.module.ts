import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectManagementComponent } from './project-management/project-management.component';



const routes: Routes = [
  
  { path: '', component: ProjectManagementComponent, data: { title: 'Farm Management' } },
  { path: 'create-project', component: CreateProjectComponent, data: { title: 'Create Farm' } },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
