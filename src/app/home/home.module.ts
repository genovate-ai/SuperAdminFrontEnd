import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';

import { SharedModule } from 'src/app/shared/shared.module'

import { DashboardComponent } from './components/dashboard/dashboard.component'
import { AdminModule } from '../admin/admin.module';
import { ReportFiltersModule } from '../report-filters/report-filters.module';
import { HomeComponent } from './home/home.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GenericUiComponentsModule } from '../generic-ui-components/generic-ui-components.module';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // NgSelectModule,
    // NgbCollapseModule,
    // SharedModule,
    // AdminModule,
    // ReportFiltersModule,
    // GenericUiComponentsModule
  ]
})
export class HomeModule { }
