import { Component, OnInit } from '@angular/core';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';

@Component({
  selector: 'app-image-display-popup',
  templateUrl: './image-display-popup.component.html',
  styleUrls: ['./image-display-popup.component.scss']
})
export class ImageDisplayPopupComponent implements OnInit {
  imgURL: string | ArrayBuffer;
  Image:any;
  nameImage:any;
  list:any;
  constructor(protected popupController: PopupControllerService) { }

  ngOnInit(): void {
    this.list = this.popupController.getParams();
    this.Image = this.list[0];
    this.nameImage = this.list[1];
    this.displayImage(this.Image)
  }

  
  displayImage(files: any){

    
    var reader = new FileReader();
		reader.readAsDataURL(files);
		
		reader.onload = (_event) => {
			this.imgURL = reader.result; 
    }
}

}
