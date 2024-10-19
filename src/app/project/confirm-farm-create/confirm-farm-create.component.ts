import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';

@Component({
  selector: 'app-confirm-farm-create',
  templateUrl: './confirm-farm-create.component.html',
  styleUrls: ['./confirm-farm-create.component.scss']
})
export class ConfirmFarmCreateComponent implements OnInit {

  constructor(
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
  ) { }

  @Output() close = new EventEmitter<void>();
  @Output() createFarm = new EventEmitter<void>();
  @Output() deleteFarm = new EventEmitter<void>();
  @Output() deleteEvent = new EventEmitter<void>();
  @Output() addCrop = new EventEmitter<void>();
  @Output() yes = new EventEmitter<void>();
  @Output() isLoggedOut = new EventEmitter<boolean>();

  @Input() popupText : boolean = false;
  @Input() popupText1 : boolean = false;
  @Input() popupTextEvent : boolean = false;
  @Input() popupFor : string = null;
  @Input() okCancel : boolean = false;
  @Input() onlyYes : boolean = false;


  ngOnInit() {
  }


onClose(){
 this.close.emit();
}

CreateFarm() {
  if(this.popupFor==="addFeature"){
    this.createFarm.emit();
  }
  else if(this.popupFor==="Delete"){
    this.deleteFarm.emit();
  }else if(this.popupFor==="DeleteEvent"){
    this.deleteEvent.emit();
  }
  else if(this.popupFor==="addCrop"){
this.addCrop.emit();
  }else{
    this.yes.emit();
  }
}

}
