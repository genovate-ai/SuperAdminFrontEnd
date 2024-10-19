import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import { CreateProjectComponent } from './create-project/create-project.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ProjectManagementComponent } from './project-management/project-management.component';
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
import { environment } from 'src/environments/environment';
import { ConfirmFarmCreateComponent } from './confirm-farm-create/confirm-farm-create.component';

@NgModule({
  declarations: [
    CreateProjectComponent,
    ProjectManagementComponent,
    ConfirmFarmCreateComponent
  ],
  imports: [
    CommonModule,
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
    SortablejsModule,
    // App initialization
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ]

})
export class FarmModule { }
