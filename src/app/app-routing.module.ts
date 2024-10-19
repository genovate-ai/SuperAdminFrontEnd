import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomPreloadingStrategy } from './CustomPreloadingStrategy';
import { AuthGuardServiceService } from './shared/services/common/auth-guard.service';

const routes: Routes = [
  //{ path: '', redirectTo: "/auth", pathMatch: "full", canActivate: [AuthGuardServiceService] },
  { path: '', redirectTo: "/home", pathMatch: "full" },
  // { path: 'home', canActivate: [AuthGuardServiceService], loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'home', canActivate: [AuthGuardServiceService], loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: CustomPreloadingStrategy,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
