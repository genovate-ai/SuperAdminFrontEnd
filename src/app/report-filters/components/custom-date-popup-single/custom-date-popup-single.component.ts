import { EventEmitter, Input } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-custom-date-popup-single',
  templateUrl: './custom-date-popup-single.component.html',
  styleUrls: ['./custom-date-popup-single.component.scss']
})
export class CustomDatePopupSingleComponent implements OnInit {

  @Input() automationId = 'list-title';
  @Input() dateRange = '';
  @Input() selectedDate = '';
  selectedDateInput = '';
  @Output() onClose = new EventEmitter<any>();
  @Output() onSelected = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<any>();
  @Input() dateFormat = 'dd-MM-yyyy';
  @Input() monthFormat = 'MMM YYYY';
  @Input() resetControl = false;
  date:any;

  dateObj;

  titleForId = 'list-title';

  constructor() { }

  ngOnInit(){
    this.titleForId = this.automationId.split(' ').join('-');
  }

  ngOnChanges(): void {
    if (this.resetControl) {
      this.clearList();
    } else {
      this.selectedDateInput = this.selectedDate;
      this.date = this.dateRange;
      this.dateObj = moment(this.selectedDate).format('yyyy-MM-DD');
    }
  }


  getDate(e) {
    
    this.dateObj = e;
    this.selectedDateInput = e;
    this.onSelected.emit(this.dateObj);
  }

  clearList() {
    // this.selectedDateInput = this.dateRange;
    this.dateObj = this.dateRange;
    this.onClear.emit(null);
  }

}
