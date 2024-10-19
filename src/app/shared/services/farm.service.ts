import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Constants } from "../helper/Constants";

import { saveAs } from 'file-saver';
import { scan } from "rxjs/operators";
export interface Download {
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  progress: number
  content: Blob | null
}
import { tap } from 'rxjs/operators';
import { AccountService } from "./common/account.service";
import { Observable } from "rxjs";
import { FarmFilterModel } from "../models/Project/FarmFilter.Model";
import { ResponseVModel } from "../models/ResponseV.Model";
import { RequestVModel } from "../models/RequestV.Model.ts";
import { FarmDModel } from "../models/Project/FarmD.Model";
@Injectable({
  providedIn: "root",
})

export class FarmService {
  constructor(private http: HttpClient, private account: AccountService) { }

  baseUrl = Constants.baseUrl;
  FarmBaseUrl = Constants.farmBaseURL;
  FarmScoringUrl = Constants.FarmScoringurl;
  scheduleManagementURL = Constants.scheduleManagement;
  invokeEvent = Constants.invokeEvent;


   // Angro Authentication process
   private apiUrl = 'http://72.44.40.50:8282/api/ExtAuth/login';
   private authTokenKey = 'accessToken';
   // ------------

 // get the angro access token 
   login(userEmail: string, password: string, planId: string, farmId: number, farmerId: number): Observable<any> {
     const body = {
       userEmail,
       password,
       planId,
       farmId,
       farmerId
     };
     return this.http.post<any>(this.apiUrl, body).pipe(
       tap(response => {
         if (response && response.token) {
           this.setAuthToken(response.token);
         }
       })
     );
   }
   setAuthToken(token: string) {
     localStorage.setItem(this.authTokenKey, token);
   }

   getAuthToken(): string | null {
     return localStorage.getItem(this.authTokenKey);
   }
   createFarm(Farm: any) {
    return this.http.post<ResponseVModel>(
      this.FarmBaseUrl + "saveProject/",
      Farm
    );
  }
  updateFarm(Farm: any) {
    return this.http.post<ResponseVModel>(
      this.FarmBaseUrl + "EditProject",
      Farm
    );
  }
  // get all the farms and farms ID on basic of the angro from

  getAllFarmsData(authToken: string , body: any): Observable<any> {
    const FarmURl = this.FarmBaseUrl + "GetAllFarms";
    return this.http.post<any>(FarmURl, body);
  }

  getLandPreparation(accessToken: string): Observable<any> {
    // Construct the full URL with query parameters
    const FarmURl = this.FarmBaseUrl + "LandPreparation";
    return this.http.get<any>(FarmURl);
  }
  getAllFarms(Farm: FarmFilterModel) {

    let data = this.http.post<ResponseVModel>(
      this.FarmBaseUrl + "Project",
      Farm
    );

    return data;
  }
 
 

  

  createFarms(Farm: any) {
    return this.http.post<ResponseVModel>(
      this.FarmBaseUrl + "SaveFarms/",
      Farm
    );
  }

  createMetaData(Farm: any) {
    return this.http.post<ResponseVModel>(
      this.FarmBaseUrl + "addMetaData/",
      Farm
    );
  }

  deleteFarm(deleteFarm: RequestVModel) {
    return this.http.post<ResponseVModel>(
      this.FarmBaseUrl + "DeleteFarm",
      deleteFarm
    );
  }
  GetProjectDetail(deleteFarm: RequestVModel) {
    return this.http.post<ResponseVModel>(
      this.FarmBaseUrl + "GetProjectDetailV2",
      deleteFarm
    );
  }
  loadCombos() {
    return this.http.post<ResponseVModel>(
      this.FarmBaseUrl + "getMetaData",
      {}
    );
  }
}