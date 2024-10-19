import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { AuthRoutingModule } from './auth-routing.module';

// import {ConfirmationComponent} from 'src/app/shared/popup/confirmation-component/confirmation.component'
import { SharedModule } from 'src/app/shared/shared.module';

import { SignInComponent } from './components/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetPinComponent } from './components/reset-pin/reset-pin.component';
import { GenericUiComponentsModule } from '../generic-ui-components/generic-ui-components.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    SignInComponent,
    //ConfirmationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ResetPinComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // SharedModule,
    // GenericUiComponentsModule,
  ]
})
export class AuthModule { }
