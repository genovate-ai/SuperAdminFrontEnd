import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationComponent } from './components/notification-component/notification.component';
import { TranslationPipe } from './pipes/translation.pipe';
import { TranslationConfigService } from './services/common/translation-config.service'
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient, HttpClientXsrfModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpInterceptorService } from './services/common/http-interceptor.service'
import { AuthService } from './services/common/auth.service';
import { PopupComponent } from './components/popup/popup.component';
import { UserAccountService } from './services/user-account-services/user-account.service';

import { PopupControllerService } from './services/common/popup-controller.service';


// import { FlexLayoutModule } from '@angular/flex-layout';

// import { CustomRadioButtonComponent } from './components/pure-components/custtom-radio-button/custom-radio-button.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationOldComponent } from './components/pagination-old-component/pagination-old.component';
import { NumberToBooleanPipe } from './pipes/number-to-boolean.pipe';
import { MaxLengthPipePipe } from './pipes/max-length-pipe.pipe';
import { CustomRadioButtonComponent } from './components/custom-radio-button/custom-radio-button.component';
import { ConfirmationComponent } from './components/confirmation-component/confirmation.component';
import { ManageOrganizationsService } from './services/manage-organizations/manage-organizations.service';
import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { InputMaskDirective } from './directives/input-mask.directive';
import {DisableControlDirective} from './directives/input-disable.directive'
import { StepperComponent } from './components/stepper/stepper.component';
import { GeneralPhoneMaskDirective } from './directives/general-phone-mask.directive';
import { ScreenNameService } from './services/common/screen-name.service';

import { CustomNgSelectComponent } from './components/custom-ng-select/custom-ng-select.component';
import { PaginationComponent } from './components/pagination-component/pagination.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SiteTreeviewPopupComponent } from './components/site-treeview-popup/site-treeview-popup.component';
import { TreeviewModule } from 'ngx-treeview';
import { BoldStrPipe } from './pipes/bold-str.pipe';
import { ReportModalComponent } from './components/report-modal/report-modal.component';
import { CustomTreeviewComponent } from './components/site-treeview-all-sites/custom-treeview.component';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { SearchGridComponent } from './components/search-grid-component/search-grid.component';
import { CustomInputDropdownComponent } from './components/custom-input-dropdown/custom-input-dropdown.component';
import { CustomSelectedInputComponent } from './components/custom-selected-input/custom-selected-input.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ClickOutsideElemDirective } from './directives/click-outside-elem.directive';
import { HorizontalDragScrollDirective } from './directives/horizontal-drag-scroll.directive';
import { ConfirmationV2Component } from './components/confirmation-v2-component/confirmation-v2.component';
import { ManageProfileComponent } from '../generic-ui-components/components/user-profile/manage-profile.component';
import { CurrencyFormatterDirective } from './directives/currency-formatter.directive';
import { CustomRadioButtonV2Component } from './components/custom-radio-button-v2/custom-radio-button-v2.component';
import { BoldStrSpCharPipe } from './pipes/bold-str-sp-char.pipe';
import { ConfirmationV3Component } from './components/confirmation-v3-component/confirmation-v3.component';
import { SiteTreeviewAllSitesV2Component } from './components/site-treeview-all-sites-v2/site-treeview-all-sites-v2.component';
import { SiteTreeviewAllSitesSelectionComponent } from './components/site-treeview-all-sites-selection/site-treeview-all-sites-selection.component';
import { PopupV2Component } from './components/popup-v2/popup-v2.component';
import { CustomRadioButtonV3Component } from './components/custom-radio-button-v3/custom-radio-button-v3.component';
import { FilterArrayOfObjectsPipe } from './pipes/filter-array-of-objects.pipe';
import { AncInputBoxComponent } from '../generic-ui-components/components/anc-input-box/anc-input-box.component';
import { GenericUiComponentsModule } from '../generic-ui-components/generic-ui-components.module';
import { FileDragAndDropDirective } from './directives/file-drag-and-drop.directive';
import { VieweditPopupComponent } from './components/viewedit-popup/viewedit-popup.component';
import { RegionFilterComponent } from './components/region-filter/region-filter.component';
import { FarmFilterComponent } from './components/farm-filter/farm-filter.component';
import { BrowserModule } from '@angular/platform-browser';
import { OrganizationFilterComponent } from './components/organization-filter/organization-filter.component';
import { FlightDateFilterComponent } from './components/flight-date-filter/flight-date-filter.component';
import { CustomRadioButtonV4Component } from './components/custom-radio-button-v4/custom-radio-button-v4.component';
import { AbsNumberPipe } from './pipes/abs-number.pipe';
import { FormatNumberPipe } from './pipes/format-number.pipe';


@NgModule({
  declarations: [
    VieweditPopupComponent,
    NotificationComponent,
    TranslationPipe,
    PopupComponent,
    CustomRadioButtonComponent,
    CustomRadioButtonV2Component,
    PaginationOldComponent,
    PaginationComponent,
    NumberToBooleanPipe,
    MaxLengthPipePipe,
    ConfirmationComponent,
    PhoneMaskDirective,
    InputMaskDirective,
    DisableControlDirective,
    StepperComponent,
    GeneralPhoneMaskDirective,
    CustomNgSelectComponent,
    SiteTreeviewPopupComponent,
    CustomTreeviewComponent,
    BoldStrPipe,
    BoldStrSpCharPipe,
    ReportModalComponent,
    OnlyNumbersDirective,
    SearchGridComponent,
    CustomInputDropdownComponent,
    CustomSelectedInputComponent,
    ClickOutsideDirective,
    ClickOutsideElemDirective,
    HorizontalDragScrollDirective,
    ConfirmationV2Component,
    CurrencyFormatterDirective,
    CustomRadioButtonV2Component,
    ConfirmationV3Component,
    SiteTreeviewAllSitesV2Component,
    PopupV2Component,
    CustomRadioButtonV3Component,
    SiteTreeviewAllSitesSelectionComponent,
    FilterArrayOfObjectsPipe,
    FileDragAndDropDirective,
    RegionFilterComponent,
    FarmFilterComponent,
    OrganizationFilterComponent,
    FlightDateFilterComponent,
    CustomRadioButtonV4Component,
    AbsNumberPipe,
    FormatNumberPipe,
  ],
  imports: [
    TreeviewModule.forRoot(),
    CommonModule,
    NgSelectModule,
    HttpClientModule,
    NgbAlertModule,
    HttpClientModule,
    HttpClientXsrfModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }), FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),


  ],
  // entryComponents: [
  //   StepperComponent,
  //   PopupComponent,
  //   PopupV2Component,


  // ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    CurrencyPipe
  ],
  exports: [
    RegionFilterComponent,
    VieweditPopupComponent,
    NotificationComponent,
    TranslationPipe,
    TranslateModule,
    PopupComponent,
    PopupV2Component,
    CustomRadioButtonComponent,
    CustomRadioButtonV2Component,
    PaginationOldComponent,
    PaginationComponent,
    NumberToBooleanPipe,
    MaxLengthPipePipe,
    ConfirmationComponent,
    PhoneMaskDirective,
    InputMaskDirective,
    DisableControlDirective,
    StepperComponent,
    GeneralPhoneMaskDirective,
    CustomNgSelectComponent,
    SiteTreeviewPopupComponent,
    CustomTreeviewComponent,
    BoldStrPipe,
    BoldStrSpCharPipe,
    ReportModalComponent,
    OnlyNumbersDirective,
    SearchGridComponent,
    CustomInputDropdownComponent,
    CustomSelectedInputComponent,
    ClickOutsideDirective,
    ClickOutsideElemDirective,
    HorizontalDragScrollDirective,
    ConfirmationV2Component,
    CurrencyFormatterDirective,
    ConfirmationV3Component,
    SiteTreeviewAllSitesV2Component,
    CustomRadioButtonV3Component,
    CustomRadioButtonV4Component,
    SiteTreeviewAllSitesSelectionComponent,
    FilterArrayOfObjectsPipe,
    FileDragAndDropDirective,
    FarmFilterComponent,
    OrganizationFilterComponent,
    FlightDateFilterComponent,
    AbsNumberPipe,
    FormatNumberPipe,
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        TranslationConfigService,
        AuthService,
        UserAccountService,
        ManageOrganizationsService,

        ScreenNameService,
        TranslateService,
        PopupControllerService,
        ReportModalComponent,
      ]
    };
  }
}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json?cb=' + new Date().toString());
}
