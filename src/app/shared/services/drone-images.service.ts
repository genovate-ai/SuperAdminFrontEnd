import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Constants } from "../helper/Constants";
import { ImageModel } from "../models/DroneImages/Image.Model";
import { ImageLocationModel } from "../models/DroneImages/ImageLocation.Model";
import { ResponseVModel } from "../models/ResponseV.Model";
import { AccountService } from "./common/account.service";

@Injectable({
  providedIn: "root",
})
export class DroneImagesService {
  constructor(private http: HttpClient, private account: AccountService) {}

  baseUrl = Constants.baseUrl;
  droneImagesBaseUrl = Constants.droneImagesBaseURL;
  FarmBaseUrl = Constants.farmBaseURL;

  

  UploadDroneImages(ImageLocation: ImageModel) {
    let data = this.http.post<ResponseVModel>(
      this.droneImagesBaseUrl + "UploadDroneImagetoS3Bucket",
      ImageLocation
    );
    return data;
  }
  GetFarmByImageLocation(Image: ImageLocationModel) {
    let data = this.http.post<ResponseVModel>(
      this.droneImagesBaseUrl + "GetFarmByImageCoordinate",
      Image
    );
    return data;
  }
  updateAuditStatus(Data:any){
    
    let response = this.http.post<ResponseVModel>(
      this.FarmBaseUrl + 'UtilityAuditStatusUpdate',
      Data,
    );
    return response
  }
}