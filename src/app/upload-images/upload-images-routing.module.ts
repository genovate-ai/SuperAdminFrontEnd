import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UploadImagesComponent } from './upload-images.component';
import { PreviewImagesComponent } from './preview-images/preview-images.component';


const routes: Routes = [
  { path: 'upload', component: UploadImagesComponent, data: { title: 'Upload Images' } },
  { path: 'preview-images', component: PreviewImagesComponent, data: { title: 'Preview Images' } },

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UploadImagesRoutingModule { }
