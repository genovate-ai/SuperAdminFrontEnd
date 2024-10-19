import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuardServiceService } from 'src/app/shared/services/common/auth-guard.service';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  // {
  { path: '', component: HomeComponent, data: { title: 'home' } },
  { path: 'home', component: HomeComponent, data: { title: 'home' } },
  { path: 'admin', loadChildren: () => import('./../admin/admin.module').then(m => m.AdminModule), data: { preload: true }, },
  { path: 'project', loadChildren: () => import('../project/project.module').then(m => m.FarmModule) },
  { path: 'upload-images', loadChildren: () => import('./../upload-images/upload-images.module').then(m => m.UploadImagesModule) },
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
