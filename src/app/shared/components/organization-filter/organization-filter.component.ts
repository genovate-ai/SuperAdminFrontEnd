import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ManageOrganizationsService } from '../../services/manage-organizations/manage-organizations.service';
import { LoadingNotificationService } from '../../services/common/loading-notification.service';
import { STATUS_CODE } from '../../helper/Enums';
import { FarmFilterModel } from '../../models/Project/FarmFilter.Model';

@Component({
  selector: 'app-organization-filter',
  templateUrl: './organization-filter.component.html',
  styleUrls: ['./organization-filter.component.scss']
})
export class OrganizationFilterComponent implements OnInit {
  orgnList = [];
  @Input() Filter: FarmFilterModel;
  constructor(
    private formBuilder: UntypedFormBuilder, 
    protected loadingNotification: LoadingNotificationService,
    protected ManageOrganizationsService : ManageOrganizationsService,
    ) { }
    orgnForm: UntypedFormGroup;
  ngOnInit() {
    this.orgnForm = this.formBuilder.group({
      orgnId: [this.Filter.orgnId],
    });
    this.ManageOrganizationsService.getAllOrganizations().subscribe((response)=>{
      this.orgnList = response.dataObject.lstOrgnData;
    })
  }

  @Output() close = new EventEmitter<void>();
  @Output() orgnFilterValue = new EventEmitter<FarmFilterModel>();
  onClose() {
    this.close.emit();
  }
  onSubmit() {
    const Filter = {
      orgnId: this.orgnForm.get("orgnId").value
    };
    this.orgnFilterValue.emit(Filter);
  }
}
