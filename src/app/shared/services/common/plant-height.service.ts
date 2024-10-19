import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../helper/Constants';
import { ResponseVModel } from '../../models/ResponseV.Model';

@Injectable({
  providedIn: 'root'
})
export class PlantHeightService {
  constructor(private http: HttpClient) { }
  baseUrl = Constants.baseUrl;
  adminUrl = Constants.adminBaseURL;


  getAllPlantsHeightData(param) {
    return this.http.post<ResponseVModel>(this.adminUrl + 'GetAllPlantsHeight', param);
  }

  getCropSelectData() {
    let data = this.http.post<ResponseVModel>(
      Constants.farmBaseURL + "GetCropCatalogData",
      null
    );
    return data;
  }

  addPlantHeight(canopy: any) {
    let data = this.http.post<ResponseVModel>(
      this.adminUrl + "SavePlantHeight",
      canopy
    );
    return data;
  }

  updatePlantHeight(canopy: any) {
    let data = this.http.post<ResponseVModel>(
      this.adminUrl + "UpdatePlantHeight",
      canopy
    );
    return data;
  }

}
