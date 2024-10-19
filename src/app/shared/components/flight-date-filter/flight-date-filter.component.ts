import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingNotificationService } from '../../services/common/loading-notification.service';
import { DatePipe } from '@angular/common';
import { FarmFilterModel } from '../../models/Project/FarmFilter.Model';

@Component({
  selector: 'app-flight-date-filter',
  templateUrl: './flight-date-filter.component.html',
  styleUrls: ['./flight-date-filter.component.scss']
})
export class FlightDateFilterComponent implements OnInit {
  orgnList = [];
  @Input() Filter: FarmFilterModel;
  constructor(
    private formBuilder: UntypedFormBuilder, 
    protected loadingNotification: LoadingNotificationService,
    public datepipe: DatePipe,
    ) { }
    flightForm: UntypedFormGroup;
  ngOnInit() {
    
    this.flightForm = this.formBuilder.group({
      flightDate: [this.datepipe.transform(this.Filter.flightDate, 'dd-MM-yyyy'), Validators.required],
    });
  }

  @Output() close = new EventEmitter<void>();
  @Output() flightFilterValue = new EventEmitter<FarmFilterModel>();
  onClose() {
    this.close.emit();
  }
  onPlantingDateChange(event){}
  onSubmit() {
    
    const Filter = {
      flightDate: this.flightForm.get("flightDate").value
    };
    this.flightFilterValue.emit(Filter);
  }
}
