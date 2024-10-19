import { Injectable } from '@angular/core';
import {environment} from './../../../../environments/environment';
import {HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  constructor() { }

  public static readonly appVersion: string = "1.0.0";

  public baseUrl = environment.baseUrl;

  public getHeadersWithoutAuth() {
    let headers = new HttpHeaders({ "Content-Type": "application/json" });
    return headers;
  }
  public getHeaderWithAuth() {

    var headers = new HttpHeaders({ "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + localStorage.getItem('') });
    return headers;
  }
}
