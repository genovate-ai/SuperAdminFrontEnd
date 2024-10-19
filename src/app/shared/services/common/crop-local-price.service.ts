import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../helper/Constants';
import { ResponseVModel } from '../../models/ResponseV.Model';

@Injectable({
  providedIn: 'root'
})
export class CropLocalPriceService {
  constructor(private http: HttpClient) { }
  baseUrl = Constants.baseUrl;
  adminUrl = Constants.adminBaseURL;


  getAllCropsPriceData(param) {
    return this.http.post<ResponseVModel>(this.adminUrl + 'GetAllCropsPrice', param);
  }

  getCropSelectData() {
    let data = this.http.post<ResponseVModel>(
      Constants.farmBaseURL + "GetCropCatalogData",
      null
    );
    return data;
  }

  addCropPrice(value: any) {
    let data = this.http.post<ResponseVModel>(
      this.adminUrl + "SaveCropPrice",
      value
    );
    return data;
  }

  updateCropPrice(value: any) {
    let data = this.http.post<ResponseVModel>(
      this.adminUrl + "UpdateCropPrice",
      value
    );
    return data;
  }

  GetLookupYears() {
    let data = this.http.post<ResponseVModel>(
      Constants.farmBaseURL + "GetLookupYears",
      null
    );
    return data;
  }
}
