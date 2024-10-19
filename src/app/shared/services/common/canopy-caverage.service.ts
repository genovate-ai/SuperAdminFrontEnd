import { Injectable } from '@angular/core';
import { Constants } from '../../helper/Constants';
import { HttpClient } from '@angular/common/http';
import { ResponseVModel } from '../../models/ResponseV.Model';

@Injectable({
  providedIn: 'root'
})
export class CanopyCaverageService {

  constructor(private http: HttpClient) { }
  baseUrl = Constants.baseUrl;
  adminUrl = Constants.adminBaseURL;


  getAllCanopyCoverageData(param) {
    return this.http.post<ResponseVModel>(this.adminUrl + 'GetAllCanopyCoverage/', param);
  }

  getCropSelectData() {
    let data = this.http.post<ResponseVModel>(
      Constants.farmBaseURL + "GetCropCatalogData",
      null
    );
    return data;
  }

  addCanopyCoverage(canopy: any) {
    let data = this.http.post<ResponseVModel>(
      this.adminUrl + "SaveCanopyCoverage",
      canopy
    );
    return data;
  }

  updateCanopyCoverage(canopy: any) {
    let data = this.http.post<ResponseVModel>(
      this.adminUrl + "UpdateCanopyCoverage",
      canopy
    );
    return data;
  }

}
