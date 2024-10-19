import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route } from '@angular/router';
import { AuthService } from './auth.service'
import { debug } from 'console';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardServiceService implements CanActivate, CanActivateChild, CanLoad {

  constructor(private router: Router, private authService: AuthService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    // Create a URL object from the URL string
    const urlObject = new URL('http://example.com' + url); // Prefixing with a base URL
    
    // Extract the pathname (the part before the '?')
    const path = urlObject.pathname;
    
    
    // Extract the query string (the part after the '?')
    const queryString = urlObject.search;

    // Create a URLSearchParams object to parse query parameters
    const params = new URLSearchParams(queryString);

    // Extract specific parameter value
    const fromValue = params.get('from');
    const token = params.get('token');
    if(path == "/home/farm/farm-land-preparation" && fromValue == "efert"){
      //set temp logins for engro
      this.authService.SetFakelogins(token);
      return true;
    }
    return this.checkLogin(url)
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
  canLoad(route: Route): boolean {

    let url = `/${route.path}`;
    return this.checkLogin(url);
  }
  checkLogin(url: string): boolean {

    if (this.authService.isLoggedIn()) {
      return true;

    }

    this.authService.loginRedirectUrl = url;
    this.router.navigate(['/auth/sign-in']);

    return false;
  }
}
