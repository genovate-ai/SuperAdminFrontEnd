import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { STATUS_CODE } from '../../helper/Enums';
import { LoadingNotificationService } from '../../services/common/loading-notification.service';
import { FarmService } from '../../services/farm.service';

@Component({
  selector: 'app-region-filter',
  templateUrl: './region-filter.component.html',
  styleUrls: ['./region-filter.component.scss']
})
export class RegionFilterComponent implements OnInit {
  lstProvince = [{code:"Punjab",name:'Punjab'},{code:'Sindh',name:'Sindh'},{code:'Balochistan',name:'Balochistan'},{code:'Khyber Pakhtunkhwa',name:'Khyber Pakhtunkhwa'}];
  lstTehsil = [];
  lstDistrict = [];
  @Input() tehsilLst:[];
  @Input() districtLst: [];

  constructor(private formBuilder: UntypedFormBuilder,private farmService: FarmService,protected loadingNotification: LoadingNotificationService) { }
  regionFarm: UntypedFormGroup;
  ngOnInit() {
    
  }
  
  @Output() close = new EventEmitter<void>();
  onClose(){
    this.close.emit();
  }

}
