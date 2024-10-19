import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../helper/Constants';
import { ResponseVModel } from '../../models/ResponseV.Model';

@Injectable({
  providedIn: 'root'
})
export class AgroChemicalsLocalPriceService {
  constructor(private http: HttpClient) { }
  baseUrl = Constants.baseUrl;
  adminUrl = Constants.adminBaseURL;


  getAllAgroChemicalsPriceData(param) {
    return this.http.post<ResponseVModel>(this.adminUrl + 'GetAllAgroChemicalsPrices', param);
  }

  addAgroChemicalsPrice(value: any) {
    let data = this.http.post<ResponseVModel>(
      this.adminUrl + "SaveAgroChemicalsPrice",
      value
    );
    return data;
  }

  updateAgroChemicalsPrice(value: any) {
    let data = this.http.post<ResponseVModel>(
      this.adminUrl + "UpdateAgroChemicalsPrice",
      value
    );
    return data;
  }

  getAgroChemicalsPrice(year: any ) {
    let data = this.http.post<ResponseVModel>(
      this.adminUrl + "GetAgroChemicalsPrice",
      year
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
