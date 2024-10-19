import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import { TranslateLanguageLoader, AppTranslationService } from './shared/services/common/appTranslation.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LayoutModule} from './layout/layout.module';
//import {ConfirmationComponent} from 'src/app/shared/popup/confirmation-component/confirmation.component';



import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseFormComponent } from './shared/components/base-components/base-form.component';
import { AdminModule } from './admin/admin.module';
import { ManageUserComponent } from './admin/components/users/manage-user.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportFiltersModule } from './report-filters/report-filters.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GenericUiComponentsModule } from './generic-ui-components/generic-ui-components.module';



//import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    BaseFormComponent,
    
    
    //AgmCoreModule
  ],
  imports: [
    NgbModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule, 
    LayoutModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    // AdminModule,
    // ReportFiltersModule,
    // FormsModule,
    // NgSelectModule,
    // ReactiveFormsModule,
    // SharedModule,
    // GenericUiComponentsModule,
  ],
  //exports:[AgmCoreModule],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
