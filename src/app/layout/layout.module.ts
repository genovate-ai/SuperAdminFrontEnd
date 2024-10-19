import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'src/app/shared/shared.module';

import { LayoutRoutingModule } from './layout-routing.module';

import { LayoutComponent } from './components/layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GenericUiComponentsModule } from '../generic-ui-components/generic-ui-components.module';


@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    NgbCollapseModule,
    // SharedModule,
    // FormsModule,
    // NgSelectModule,
    // ReactiveFormsModule,
    // GenericUiComponentsModule
  ],
  exports: [
    LayoutComponent
  ]
})
export class LayoutModule { 

  public static dateFormatDynamic : string ='';
}
