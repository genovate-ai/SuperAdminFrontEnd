import { CustomExportFileComponent } from './components/custom-export-file/custom-export-file.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCheckboxComponent } from './components/custom-checkbox/custom-checkbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomSelectboxComponent } from './components/custom-selectbox/custom-selectbox.component';
import { CustomCheckboxListComponent } from './components/custom-checkbox-list/custom-checkbox-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterButtonsComponent } from './components/filter-buttons/filter-buttons.component';
import { SharedModule } from '../shared/shared.module';
import { CustomReportTextboxComponent } from './components/custom-report-textbox/custom-report-textbox.component';
import { CustomExportFileComponentXLSX } from './components/custom-export-file-xlsx/custom-export-file-xlsx.component';
import { CustomExportPngComponent } from './components/custom-export-png/custom-export-png.component';
import { BoldStrPipe } from '../shared/pipes/bold-str.pipe';
import { CustomDatePickerComponent } from './components/custom-date-picker/custom-date-picker.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { CustomFilterPopupComponent } from './components/custom-filter-popup/custom-filter-popup.component';
import { SitesFilterPopupComponent } from './components/sites-filter-popup/sites-filter-popup.component';
import { CustomDatePickerV2Component } from './components/custom-date-picker-v2/custom-date-picker-v2.component';
import { CustomDatePopupComponent } from './components/custom-date-popup/custom-date-popup.component';
import { CustomDatePopupSingleComponent } from './components/custom-date-popup-single/custom-date-popup-single.component';
import { SitesFilterPopupAlertComponent } from './components/sites-filter-popup-alerts/sites-filter-popup.component';
import { CustomDatePickerV3Component } from './components/custom-date-picker-v3/custom-date-picker-v3.component';
import { CustomFilterPopupV2Component } from './components/custom-filter-popup-v2/custom-filter-popup-v2.component';
import { CustomExportFileComponentXLSXv2 } from './components/custom-export-file-xlsx-v2/custom-export-file-xlsx-v2.component';
import { GenericUiComponentsModule } from '../generic-ui-components/generic-ui-components.module';



@NgModule({
  declarations: [CustomCheckboxComponent, CustomSelectboxComponent, CustomCheckboxListComponent,
    FilterButtonsComponent, CustomReportTextboxComponent,
    CustomExportFileComponent, CustomExportFileComponentXLSX,CustomExportPngComponent, CustomDatePickerComponent, CustomFilterPopupComponent, SitesFilterPopupComponent,CustomDatePickerV2Component, CustomDatePopupComponent,
    CustomDatePopupSingleComponent, SitesFilterPopupAlertComponent, CustomDatePickerV3Component, CustomFilterPopupV2Component, CustomExportFileComponentXLSXv2],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SharedModule,
    DpDatePickerModule,
    ReactiveFormsModule,
    GenericUiComponentsModule
  ],
  exports: [
    CustomCheckboxComponent,
    CustomSelectboxComponent,
    CustomCheckboxListComponent,
    FilterButtonsComponent,
    CustomReportTextboxComponent,
    CustomExportFileComponent,
    CustomExportFileComponentXLSX,
    CustomExportFileComponentXLSXv2,
    CustomExportPngComponent,
    CustomDatePickerComponent,
    CustomFilterPopupComponent,
    SitesFilterPopupComponent,
    CustomDatePickerV2Component,
    CustomDatePopupComponent,
    CustomDatePopupSingleComponent,
    SitesFilterPopupAlertComponent,
    CustomDatePickerV3Component,
    CustomFilterPopupV2Component
  ]
})
export class ReportFiltersModule { }
