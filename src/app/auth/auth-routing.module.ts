import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from './components/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetPinComponent } from './components/reset-pin/reset-pin.component';


const routes: Routes = [
  {
    path: '', component: SignInComponent
  },
  {
    path: 'sign-in', component: SignInComponent, data: {title: 'signIn'}
  },
  {
    path: 'forgot-password', component: ForgotPasswordComponent, data: {title: 'forgotPassword'}
  },
  {
    path: 'reset-password', component: ResetPasswordComponent, data: {title: 'resetPassword'}
  },
  {
    path: 'reset-pin', component: ResetPinComponent, data: {title: 'resetPin'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
