import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadImagesRoutingModule } from './upload-images-routing.module';
import { PreviewImagesComponent } from './preview-images/preview-images.component';
import { UploadImagesComponent } from './upload-images.component';
import { ManageProfileComponent } from '../generic-ui-components/components/user-profile/manage-profile.component';
import { ImageDisplayPopupComponent } from './image-display-popup/image-display-popup.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SortablejsModule } from 'ngx-sortablejs';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { AgmDrawingModule } from '@agm/drawing';
import { AgmCoreModule } from '@agm/core';
import { ReportFiltersModule } from '../report-filters/report-filters.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxPrintModule } from 'ngx-print';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { GenericUiComponentsModule } from '../generic-ui-components/generic-ui-components.module';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from '../admin/admin-routing.module';
import { TreeviewModule } from 'ngx-treeview';
import { ProjectRoutingModule } from '../project/project-routing.module';

@NgModule({
  declarations: [
    UploadImagesComponent,
    PreviewImagesComponent,
    ImageDisplayPopupComponent,
    
  ],
  imports: [
    CommonModule,
    UploadImagesRoutingModule,
    GenericUiComponentsModule,
    ProjectRoutingModule,
    TreeviewModule.forRoot(),
    NgbModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    NgSelectModule,
    NgbDatepickerModule,
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
export class UploadImagesModule { }
