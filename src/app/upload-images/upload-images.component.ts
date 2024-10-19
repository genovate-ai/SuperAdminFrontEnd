import { Component, Inject, OnInit } from "@angular/core";
import exifr from "exifr";
import { DroneImagesService } from "src/app/shared/services/drone-images.service";
import { ImageModel } from "src/app/shared/models/DroneImages/Image.Model";
import {
  API_CALLEVENTGROUP_CODE,
  SCREEN_CODE,
  STATUS_CODE
} from "src/app/shared/helper/Enums";
import { LoadingNotificationService } from "src/app/shared/services/common/loading-notification.service";
import { DatePipe } from "@angular/common";
import { ImageLocationModel } from "src/app/shared/models/DroneImages/ImageLocation.Model";
import { PopupControllerService } from "src/app/shared/services/common/popup-controller.service";
import { NotificationServiceService } from "src/app/shared/services/common/notification.service";
import { AccountService } from "src/app/shared/services/common/account.service";
import { TranslationConfigService } from "src/app/shared/services/common/translation-config.service";
import { BaseFormComponent } from "src/app/shared/components/base-components/base-form.component";
import { FarmDModel } from "src/app/shared/models/Project/FarmD.Model";
import { round } from "dc";
//import { LabelType } from "ng5-slider";
import { Router } from "@angular/router";
import { SessionModel } from "src/app/shared/models/Session.Model";

interface ImageMetadata {
  name: string;
  type: string;
  imageTakenDate: Date;
  imageTakenSource?: string;
  altitude: number;
  make: string;
  model: string;
  latitude: string;
  longitude: string;
  file: any;

}

@Component({
  selector: "app-upload-images",
  templateUrl: "./upload-images.component.html",
  styleUrls: ["./upload-images.component.scss"],
})
export class UploadImagesComponent extends BaseFormComponent implements OnInit {
  msg: string;
  url: string | ArrayBuffer;
  midLat: any;
  midLng: any;
  constructor(
    private droneimagesservice: DroneImagesService,
    private loadingNotification: LoadingNotificationService,
    public datePipe: DatePipe,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected notification: NotificationServiceService,
    protected accountService: AccountService,
    // private router: Router
    private _router: Router
  ) {
    super(
      translationPipe,
      popupController,
      notification,
      accountService,

    );
  }
  MetaDatalst: ImageMetadata[] = [];
  ngOnInit() {

    if (history.state.isSave != undefined) {
      this.isSave = history.state.isSave;
      this.isCancel = history.state.isCancel;
    }

    if (this.isSave == true) {

      console.log("Save Changes ")

      this.ImagesData = history.state.ImagesData;
      this.MetaDatalst = history.state.uploadedFiles;
      console.log("Save uploaded", history.state.uploadedFiles)
      //this.onFileChange(history.state.uploadedFiles)
      this.imageTakenDate = this.MetaDatalst[0].imageTakenDate;
      this.type = this.MetaDatalst[0].type;
      this.altitude = this.MetaDatalst[0].altitude;
      this.make = this.MetaDatalst[0].make;
      this.model = this.MetaDatalst[0].model;
      this.count = this.MetaDatalst.length;

      this.farmName = history.state.farmObj.farmName;
      this.farmId = history.state.farmObj.id;
      this.farmNo = history.state.farmObj.farmNo;
      this.folderS3Bucket = history.state.s3path;

      if (history.state.showImages != undefined) {
        this.uploadedFiles = history.state.showImages;
      }

    }
    else {
      console.log("Without saving")

    }

    this.screenPermission = this.IsAccessAllowed(this.screen);
  }
  screen = SCREEN_CODE.UploadImage;
  public files: any[] = [];
  base64textString: string;
  make: string = "";
  model: string = "";
  altitude: number = 0;
  heightFeature = null;
  session: SessionModel = this.getSession();
  imageTakenDate: Date = null;
  type: string = "";
  count: number = 0;
  reader: any;
  imagesrc: any;
  uploadedImages: number;
  farmName: string = "";
  farmId: number;
  progress: number = 0;
  Tehsil: string;
  folderS3Bucket: string;
  lat_list: any[] = [];
  lng_list: any[] = [];
  ImagesData: { name: any, lat: number; lng: number, state: any }[] = [];
  farmNo: string;
  progressStr: string = "0%";
  OCN: boolean = false;
  uploadedFiles: any;
  isSave: boolean = false;
  isCancel: boolean = false;
  farmObj: any;
  maxheight:any;
  async onFileChange(files: any) {


    if (this.isSave == false) {
      this.uploadedFiles = files.target.files;

      console.log("fileList", (this.uploadedFiles))



    }
    else {
      this.uploadedFiles = files;
    }

    this.loadingNotification.showLoader(
      this.screen,
      API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT
    );
    let file;
    let file1;
    let file2;
    let file3;
    let file4;
    let file5;
    if (this.uploadedFiles) {
      file = this.uploadedFiles[0];
      file1 = this.uploadedFiles[Math.round((this.uploadedFiles.length / 100) * 20)];
      file2 = this.uploadedFiles[Math.round((this.uploadedFiles.length / 100) * 40)];
      file3 = this.uploadedFiles[Math.round((this.uploadedFiles.length / 100) * 60)];
      file4 = this.uploadedFiles[Math.round((this.uploadedFiles.length / 100) * 80)];
      file5 = this.uploadedFiles[this.uploadedFiles.length - 1];

      // console.log("1st file", file);
      // console.log("20% file", file1);
      // console.log("40% file", file2);
      // console.log("60% file", file3);
      // console.log("80% file", file4);
      // console.log("last file", file5);

    }
    this.maxheight = 0
    
    if (file != undefined) {
      const metadataobj = await exifr.parse(file);
      if (metadataobj.GPSAltitude >= this.maxheight) {
        this.maxheight = metadataobj.GPSAltitude
      }
      console.log(metadataobj.GPSAltitude)
      this.lat_list.push(metadataobj.latitude)
      this.lng_list.push(metadataobj.longitude)
    }
    if (file1 != undefined) {
      const metadataobj = await exifr.parse(file1);
      if (metadataobj.GPSAltitude >= this.maxheight) {
        this.maxheight = metadataobj.GPSAltitude
      }
      this.lat_list.push(metadataobj.latitude)
      this.lng_list.push(metadataobj.longitude)
    }
    if (file2 != undefined) {
      const metadataobj = await exifr.parse(file2);
      if (metadataobj.GPSAltitude >= this.maxheight) {
        this.maxheight = metadataobj.GPSAltitude
      }
      this.lat_list.push(metadataobj.latitude)
      this.lng_list.push(metadataobj.longitude)
    }
    if (file3 != undefined) {
      const metadataobj = await exifr.parse(file3);
      if (metadataobj.GPSAltitude >= this.maxheight) {
        this.maxheight = metadataobj.GPSAltitude
      }
      this.midLat = metadataobj.latitude
      this.midLng = metadataobj.longitude
      this.lat_list.push(metadataobj.latitude)
      this.lng_list.push(metadataobj.longitude)
    }
    if (file4 != undefined) {
      const metadataobj = await exifr.parse(file4);
      if (metadataobj.GPSAltitude >= this.maxheight) {
        this.maxheight = metadataobj.GPSAltitude
      }
      this.lat_list.push(metadataobj.latitude)
      this.lng_list.push(metadataobj.longitude)
    }
    if (file5 != undefined) {
      const metadataobj = await exifr.parse(file5);
      if (metadataobj.GPSAltitude >= this.maxheight) {
        this.maxheight = metadataobj.GPSAltitude
      }
      this.lat_list.push(metadataobj.latitude)
      this.lng_list.push(metadataobj.longitude)
    }
    
    console.log(this.maxheight,this.heightFeature,"everything goes there")
    if (file != undefined || file1 != undefined || file2 != undefined || file3 != undefined || file4 != undefined || file5 != undefined) {
      const metadataobj = await exifr.parse(file);


      const imageLocation: ImageLocationModel = {
        lat: this.lat_list,
        lng: this.lng_list,
        Tehsil: this.Tehsil,
      };
      var response = await this.droneimagesservice
        .GetFarmByImageLocation(imageLocation)
        .toPromise();

      if ((response.dataObject == null)) {
        this.loadingNotification.hideLoader(this.screen,
          API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
        this.loadingNotification.ProcessSaveFail("The drone flight location doesn't exist in system");
        return;
      } else {
        const accessToken = this.session.mapboxAccessKey;;
      const htmm = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${this.midLng},${this.midLat}.json?access_token=${accessToken}`
      fetch(htmm)
        .then(response => response.json())
        .then((data) => {
          this.calcHeight(data);
        });
        this.farmName = response.dataObject.farmName;
        this.farmId = response.dataObject.id;
        this.farmNo = response.dataObject.farmNo;
        this.farmObj = response.dataObject;

        const CurrentDate = new Date();
        const myDate = this.datePipe.transform(CurrentDate, "dd-MM-yyyy");
        const Model = metadataobj.Model;
        //console.log("Model:",metadataobj)
        if (Model.toLowerCase().includes("sequoia")) {
          this.OCN = true;
          this.folderS3Bucket = "droneImages/" + this.farmNo + this.farmName + "/" + myDate.toString() + "/" + "Multispectral";
        } else {
          this.folderS3Bucket = "droneImages/" + this.farmNo + this.farmName + "/" + myDate.toString() + "/" + "RGB";
        }
      }

      if (this.uploadedFiles) {
        this.CreateBase64StringD(this.uploadedFiles);
      }
      if (this.uploadedFiles.length != 0) {
        this.MetaDatalst = [];
      }

    }
  }
  getSession() {
    return JSON.parse(localStorage.getItem('session'));
  }
  calcHeight(data){
    console.log(data.features)
    const data1 = data.features
    
    let dronealtitude = 0;
    for(var i=0;i<data1.length;i++){
      if(data1[i].properties.ele){
        dronealtitude = data1[i].properties.ele
        break;
      }
    }
    for(var i=0;i<data1.length;i++){
      if(data1[i].properties.ele){
        if(dronealtitude > data1[i].properties.ele){
          dronealtitude = data1[i].properties.ele
        }
      }
    }
    this.altitude =  this.maxheight - dronealtitude
    this.MetaDatalst.forEach(element => {
      element.altitude = this.altitude
    });
  }
  async CreateBase64StringD(fileInput: any) {
    if (fileInput && fileInput[0]) {
      var incr = 0;
      for (let i = 0; i < fileInput.length; i++) {
        let simpleObject = {} as ImageMetadata;
        this.count = fileInput.length;
        simpleObject.file = fileInput[i];
        simpleObject.name = fileInput[i].name;
        simpleObject.type = fileInput[i].type;

        const obj = await exifr.parse(fileInput[i], [
          "Model",
          "Make",
          "latitude",
          "longitude",
          "DateTimeOriginal",
          "FileSource",
        ]);

        simpleObject.imageTakenDate = obj.DateTimeOriginal;
        simpleObject.imageTakenSource = obj.FileSource;
        simpleObject.latitude = obj.latitude;
        simpleObject.longitude = obj.longitude;
        
        simpleObject.make = obj.Make;
        simpleObject.model = obj.Model;
        simpleObject.file = fileInput[i];
        if(incr == 0){
          incr++;
          
          this.imageTakenDate = obj.DateTimeOriginal;
          this.type = fileInput[i].type;
          this.make = obj.Make;
          this.model = obj.Model;
          
        }
        this.MetaDatalst.push(simpleObject);

      }
      
      this.loadingNotification.hideLoader(
        this.screen,
        API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT
      );
      //console.log("A",this.MetaDatalst)
      for (let i = 0; i < this.MetaDatalst.length; i++) {
        const m = await exifr.parse(this.MetaDatalst[i].file);

        if (this.isSave == false) {
          this.ImagesData[i] = { name: this.MetaDatalst[i].name, lat: m.latitude, lng: m.longitude, state: 'blue_dot.png' }
        }
        else {
          this.ImagesData[i] = { name: this.MetaDatalst[i].name, lat: m.latitude, lng: m.longitude, state: this.ImagesData[i].state }
        }

      }
    }
  }
  

  deleteFromArray(index, file) {

    this.MetaDatalst.splice(index, 1);
    this.count = this.MetaDatalst.length;
    // this.files.splice(index, 1);
    // this.deleteFile(file);
    // this.onUploadChange(this.files);
    if (this.count <= 0) {
      this.imageTakenDate = null;
      this.type = "";
      this.altitude = null;
      this.make = "";
      this.model = "";
    }
  }

  async onUploadImages() {

    if (this.uploadedFiles == undefined) {

      this.loadingNotification.ProcessSaveFail("Please select images first", true);
      return
    }
    if (this.isSave == false) {
      this.loadingNotification.ProcessSaveFail("Please preview images before uploading", true);
      return
    }
    if (this.isCancel == true) {
      this.loadingNotification.ProcessSaveFail("You didn't save images on preview page", true);
      return
    }



    if (this.MetaDatalst.length == 0) {
      return;
    }
    this.loadingNotification.showLoader(
      this.screen,
      API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT
    );
    this.uploadedImages = 0;
    this.progress = 0;
    const CurrentDate = new Date();
    const myDate = this.datePipe.transform(CurrentDate, "dd-MM-yyyy");

    const uploadeDateTime = new Date();
    let mainId = 0;
    for (let i = 0; i < this.MetaDatalst.length; i++) {


      let file = this.MetaDatalst[i].file;
      var promise = await this.pFileReader(file);
      const base64string = <string>promise;
      let keyName;
      var imageType = 10100
      if (this.OCN) {
        keyName = "droneImages/" + this.farmNo + this.farmName + "/" + myDate.toString() + "/" + "Multispectral/" + this.MetaDatalst[i].file.name;
        imageType = 10101
      } else {
        keyName = "droneImages/" + this.farmNo + this.farmName + "/" + myDate.toString() + "/" + "RGB/" + this.MetaDatalst[i].file.name;
        imageType = 10100
      }
      
      const metadataobj = await exifr.parse(this.MetaDatalst[i].file);
      const myJSON = JSON.stringify(metadataobj);
      const coordinate = {
        lat: metadataobj.latitude,
        lng: metadataobj.longitude,
      };
      
      const image: ImageModel = {
        imageName: this.MetaDatalst[i].file.name,
        imageCoordinate: coordinate,
        imagesType: imageType,
        base64textString: base64string,
        KeyName: keyName,
        folderS3Bucket: this.folderS3Bucket,
        farmId: this.farmId,
        uploadDateTime: uploadeDateTime,
        drone: this.make,
        ImageMetadata: myJSON,
        camera: this.model,
        flightDate: this.imageTakenDate,
        flightHeight: this.altitude,
      };
      
      
      var response = await this.droneimagesservice
        .UploadDroneImages(image)
        .toPromise()
      //   .then(response => {
      //     mainId = response.dataObject.farmImagesMainId;
      //     console.log(mainId,"MainId");
      // });
      mainId = response.dataObject.farmImagesMainId;
      console.log(response,mainId);
      this.uploadedImages = this.uploadedImages + 1;
      this.progress = (this.uploadedImages / this.count) * 100;
      this.progressStr = this.progress + "%";
    }
    this.loadingNotification.hideLoader(
      this.screen,
      API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT
    );
    this.loadingNotification.ProcessSaveSuccess(
      "Images has been successfully uploaded, You can start process imagery"
    );
  }
  pFileReader(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function found() {
        resolve(btoa(<string>reader.result));
      };
      reader.readAsBinaryString(file);
    });
  }

  onPreviewImages() {

    if (this.uploadedFiles == undefined) {

      this.loadingNotification.ProcessSaveFail("Please upload images to preview", true);
      return
    }
    if (this.isSave == true) {
      this.farmObj = history.state.farmObj;
      this.folderS3Bucket = history.state.s3path;

    }
    console.log("onpreview", this.MetaDatalst)
    this._router.navigateByUrl('/home/upload-images/preview-images',
      {
        state: {
          list: this.ImagesData,
          MetaDatalst: this.MetaDatalst,
          farmObj: this.farmObj,
          s3path: this.folderS3Bucket,
          listDroped: history.state.listDroped,
          showImages: this.uploadedFiles
        }
      });
  }
}
