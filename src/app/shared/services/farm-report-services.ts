import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Constants } from "../helper/Constants";
import { ImageModel } from "../models/DroneImages/Image.Model";
import { ImageLocationModel } from "../models/DroneImages/ImageLocation.Model";
import { ResponseVModel } from "../models/ResponseV.Model";
import { AccountService } from "./common/account.service";
import { constants } from "os";

@Injectable({
  providedIn: "root",
})
export class FarmReportServices {
  constructor(private http: HttpClient, private account: AccountService) {}

  baseUrl = Constants.baseUrl;
  FarmReportBaseURL = Constants.farmReportBaseURL;
  farmBankingReportBaseURL = Constants.farmBankingReportBaseURL;
  
  
}