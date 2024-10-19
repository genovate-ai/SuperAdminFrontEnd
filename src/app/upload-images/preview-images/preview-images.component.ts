import { Component, OnInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { SessionModel } from 'src/app/shared/models/Session.Model';
import MapboxCircle from 'mapbox-gl-circle'
import { Point } from 'mapbox-gl';
import { LoadingNotificationService } from 'src/app/shared/services/common/loading-notification.service';
import cloneDeep from 'lodash.clonedeep';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { ImageDisplayPopupComponent } from '../image-display-popup/image-display-popup.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-preview-images',
  templateUrl: './preview-images.component.html',
  styleUrls: ['./preview-images.component.scss']
})
export class PreviewImagesComponent implements OnInit {
  mapbox: mapboxgl.Map;

  session: SessionModel = this.getSession();
  listPopup : any = [];
  coordList: { lat: number; lng: number }[] = [];
  ImagesData: {name:any, lat: number; lng: number, state:any }[] = [];
  cancelImagesData: {name:any, lat: number; lng: number, state:any }[] = [];
  activeFirstImage: boolean = false;
  activeLastImage: boolean = false;
  activeUploadImage: boolean = false;
  activeDropImage: boolean = false;
  activeViewImage: boolean = false;

  uploadedFiles: any;
  showImage: any;
  cancelUploadedFiles: any;
  
  isSaveChange: boolean = false;
  isCancel: boolean = false;

  listSelected : {file: any, pos: number}[] = [];
  listDroped : any = [];
  cancelListDroped :any = [];
  el : any = [];
  farmObj: any;
  s3path: any;
  imagePath: any;
  imgURL: string | ArrayBuffer;
  firstImage: any;
  firstImageIndex: any;
  firstHalfarr: any;
  secondHalfarr: any;

  constructor( protected router: Router, private loadingNotification: LoadingNotificationService, protected popupController: PopupControllerService,) { 
    
  }

  ngOnInit(): void {

    if(!(history.state.MetaDatalst || history.state.list)) {
        this.router.navigate(['/home/upload-images/upload']);
    }
    this.uploadedFiles = history.state.MetaDatalst;
    this.cancelUploadedFiles= cloneDeep(this.uploadedFiles);
     

    console.log("uploaded", this.uploadedFiles)
    this.ImagesData = history.state.list;
    this.cancelImagesData = cloneDeep(history.state.list);
    this.farmObj = history.state.farmObj;
    this.s3path = history.state.s3path;

    if(history.state.listDroped != undefined){
    this.listDroped = history.state.listDroped;
    this.cancelListDroped = cloneDeep(history.state.listDroped);
    } 
    // for (var i = 0; i < this.ImagesData.length; i++) {
    //   this.ImagesData[i].state = 'blue_dot.png'
    // }
    

    //console.log(this.ImagesData);
    (mapboxgl as typeof mapboxgl).accessToken = this.session.mapboxAccessKey;
    
      this.mapbox = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        center:[this.ImagesData[0].lng,this.ImagesData[0].lat],
        //center: [74.32142, 30.97459],
        zoom: 17
      });


      this.onDrawPoints()
      this.listPopup[0] = new mapboxgl.Popup({className: 'custom-popup',closeButton:false,closeOnMove:true})
      .setHTML("<strong><b>Hello</strong>")
      .setMaxWidth("300px");

  

      // this.listPopup[1] = new mapboxgl.Popup({className: 'custom-popup',closeButton:false,closeOnMove:true})
      // .setHTML('Hi<button id="view-full">View Full</button>')
      // .setMaxWidth("300px");


      //this.coordList[0] =  {lat:30.97458  , lng: 74.32142}
      //this.coordList[1] =  {lat:30.97448  , lng: 74.32143}

    }

    onDrawPoints(){


    /*  for (var i = 0; i < this.ImagesData.length; i++) {
        var marker = this.ImagesData[i];

        var popup = new mapboxgl.Popup({offset: 25}).on('open', function(e){ 
            console.log(popup.getLngLat())
            
          })
        .setHTML('<strong>' + marker.name + '</strong>');
      //  m.setPopup(popup);
        const img = document.createElement('img');

        img.src = '../assets/images/'+this.ImagesData[i].state;
        
        var m = new mapboxgl.Marker({element: img, anchor: 'bottom'})
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        
        .addTo(this.mapbox);
        img.addEventListener('click', function(e){ 
          console.log()
          
        })
        //img.addEventListener('mouseenter', () => popup.addTo(this.mapbox));
         //img.addEventListener('mouseleave', () => popup.remove());

        
        // var popup = new mapboxgl.Popup({offset: 25}).on('open', function(e){ 
        //   console.log(e) }
          
        //   )
        // .setHTML('<strong>' + marker.name + '</strong>');
        //   m.setPopup(popup);


     
      }

    
     */
     for (var i = 0; i < this.ImagesData.length; i++) {

      const img = document.createElement('img');
      img.id = i.toString();
      this.el.push(img)
      
      img.src = '../assets/images/'+this.ImagesData[i].state;
      
     
      const marker = new mapboxgl.Marker({element: img, anchor: 'bottom'})
       .setLngLat([this.ImagesData[i].lng,this.ImagesData[i].lat])
       //.setPopup(this.listPopup[i])
       .addTo(this.mapbox);

       
      
    
      } 
      
      for (var i = 0; i < this.el.length; i++) {
        var self = this
        
        //this.el.forEach(item =>{ item.addEventListener('click', function(item) {  
         this.el[i].addEventListener('click', function(event) {  
         
          
         
          // const id = event.path[0].id;
          
          // for (var i = 0; i < self.el.length; i++) {
          //   if(self.el[i].id == event.path[0].id ){
          //     var index = i;
          //     break;
          //   }
          // }
          let index = self.el.findIndex(x => x.id == event.target.id);
          if(index <= -1) {
            return;
          }
          const dot_type = (self.el[index].src).split("/")[(self.el[index].src).split("/").length-1]
         if(self.activeDropImage == true){
          if(dot_type == 'blue_dot.png' ){
          //console.log("Id: ",(self.el[index].id)) 

          self.el[index].src = '../assets/images/white_dot.png';         
          self.ImagesData[index].state = 'white_dot.png'

          for (var i = 0; i < self.uploadedFiles.length; i++) {
            if( self.uploadedFiles[i].name == self.ImagesData[index].name){
              self.listDroped.push({file: self.uploadedFiles[i], pos: index});
              self.uploadedFiles.splice(i,1);
              break;
            }
          }
        

          }
          else if (dot_type == 'green_dot.png' || dot_type == 'red_dot.png'){
            self.loadingNotification.ProcessSaveFail("Cannot drop first image",true);
          }
        
         
         }
         else if(self.activeLastImage == true){
          if(dot_type == 'blue_dot.png' ){
          
            for (var i = 0; i < self.el.length; i++) {
              if(self.ImagesData[i].state == 'red_dot.png'){
                self.el[i].src = '../assets/images/blue_dot.png';
                self.ImagesData[i].state = 'blue_dot.png'
              }
            }
            self.el[index].src = '../assets/images/red_dot.png';
            self.ImagesData[index].state = 'red_dot.png'
  
            }
            else if(dot_type == 'red_dot.png' ){
              self.el[index].src = '../assets/images/blue_dot.png';
              self.ImagesData[index].state = 'blue_dot.png'
            }
            else if (dot_type == 'white_dot.png' ){
              self.loadingNotification.ProcessSaveFail("First image should be from selected images",true);
            }
         }
         else if(self.activeFirstImage == true){
          if(dot_type == 'blue_dot.png' ){
          
          for (var i = 0; i < self.el.length; i++) {
            if(self.ImagesData[i].state == 'green_dot.png'){
              self.el[i].src = '../assets/images/blue_dot.png';
              self.ImagesData[i].state = 'blue_dot.png'
            }
          }
          self.el[index].src = '../assets/images/green_dot.png';
          self.ImagesData[index].state = 'green_dot.png'
          if(index > 0){
          self.firstImage = self.uploadedFiles[index];
          self.firstImageIndex = index;
          }
          }
          else if(dot_type == 'green_dot.png' ){
            self.el[index].src = '../assets/images/blue_dot.png';
            self.ImagesData[index].state = 'blue_dot.png'
          }
          else if (dot_type == 'white_dot.png' ){
            self.loadingNotification.ProcessSaveFail("First image should be from selected images",true);
          }
         }
         else if(self.activeUploadImage == true){
          if(dot_type == 'white_dot.png' ){
          self.el[index].src = '../assets/images/blue_dot.png';
           self.ImagesData[index].state = 'blue_dot.png'

           for (var i = 0; i < self.listDroped.length; i++) {
            if( self.listDroped[i].file.name == self.ImagesData[index].name){
              self.uploadedFiles.splice(self.listDroped[i].pos,0,self.listDroped[i].file)         
              self.listDroped.splice(i,1);
            }
           }
          
          }
          }
           else  if(self.activeViewImage == true){
            for (var i = 0; i < history.state.showImages.length; i++) {
              if(history.state.showImages[i].name == self.ImagesData[index].name){
                var a = i;
                break;
              }
            }
            self.showImage = self.ImagesData[index].name;
            self.ImageDisplayPopup(history.state.showImages[a],self.showImage)
           
            

            //console.log(self.showImage)
             }
         
         
       
       })

      }
  }


  onBack(){
    this.isSaveChange = true;
    this.router.navigateByUrl('/home/upload-images/upload',{ state: { 
      isSave: this.isSaveChange,
      uploadedFiles: this.cancelUploadedFiles,
      ImagesData: this.cancelImagesData, 
      farmObj: this.farmObj,
      s3path: this.s3path,
      listDroped: this.listDroped,
      showImages:history.state.showImages
     } });
  
  }
  getSession() {
    
    return JSON.parse(localStorage.getItem('session'));
  }
  onSelectImage(){
    
    console.log("button cliked")
    this.activeUploadImage = true;
    this.activeDropImage = false;
    this.activeFirstImage = false;
    this.activeLastImage = false;
    this.activeViewImage = false;
    
    //this.onDrawPoints()
       
  }
  onDropImage(){
    
    this.activeUploadImage = false;
    this.activeDropImage = true;
    this.activeFirstImage = false;
    this.activeLastImage = false;
    this.activeViewImage = false;
    //this.onDrawPoints()
       
  }
  onFirstImage(){
    
    this.activeUploadImage = false;
    this.activeDropImage = false;
    this.activeFirstImage = true;
    this.activeLastImage = false;
    this.activeViewImage = false;
    //this.onDrawPoints() 
  }
  onLastImage(){
    
    this.activeUploadImage = false;
    this.activeDropImage = false;
    this.activeFirstImage = false;
    this.activeLastImage = true;
    this.activeViewImage = false;
    //this.onDrawPoints()  
  }
  onViewImage(){
    
    this.activeUploadImage = false;
    this.activeDropImage = false;
    this.activeFirstImage = false;
    this.activeLastImage = false;
    this.activeViewImage = true;
       
  }
  onSave(){

    if(this.firstImage != undefined){

    this.secondHalfarr = this.uploadedFiles.slice(this.firstImageIndex);
    this.firstHalfarr = this.uploadedFiles.slice(0,this.firstImageIndex);

    for (var i = 0; i < this.firstHalfarr.length; i++) {
    this.secondHalfarr.push(this.firstHalfarr[i])
    }
    this.uploadedFiles = cloneDeep(this.secondHalfarr)


    this.secondHalfarr = this.ImagesData.slice(this.firstImageIndex);
    this.firstHalfarr = this.ImagesData.slice(0,this.firstImageIndex);

    for (var i = 0; i < this.firstHalfarr.length; i++) {
    this.secondHalfarr.push(this.firstHalfarr[i])
    }
    this.ImagesData = cloneDeep(this.secondHalfarr)



    }

    this.isSaveChange = true;
    console.log("Data1", this.uploadedFiles)
    console.log("Data2", this.ImagesData)

    this.router.navigateByUrl('/home/upload-images/upload', 
    { state: { 
      isSave: this.isSaveChange,
      uploadedFiles: this.uploadedFiles,
      ImagesData: this.ImagesData, 
      farmObj: this.farmObj,
      s3path: this.s3path,
      listDroped: this.listDroped,
      showImages:history.state.showImages
     } });

    }

  onCancel(){
    
    this.isCancel = true;
    this.isSaveChange = true;
    this.router.navigateByUrl('/home/upload-images/upload',{ state: { 
      isCancel: this.isCancel,
      isSave: this.isSaveChange,
      uploadedFiles: this.cancelUploadedFiles,
      ImagesData: this.cancelImagesData, 
      farmObj: this.farmObj,
      s3path: this.s3path,
      listDroped: this.listDroped,
      showImages:history.state.showImages
     } });
  }


ImageDisplayPopup(image:any,name:any ){
  let header = name;
  const a = [];
  a.push(image)
  a.push(name)
  this.popupController.parameters = a;
  this.popupController.updateModalSize('sm');
  this.popupController.popupHeader = header;
  this.popupController.updateComponent(ImageDisplayPopupComponent);
}

}
