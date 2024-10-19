import { EventEmitter, Input } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-custom-date-popup',
  templateUrl: './custom-date-popup.component.html',
  styleUrls: ['./custom-date-popup.component.scss']
})
export class CustomDatePopupComponent implements OnInit {

  @Input() automationId = 'list-title';
  @Input() resetMinDate = '';
  @Input() resetMaxDate = '';
  @Input() minDateRange = '';
  @Input() maxDateRange = '';
  @Input() selectedMinDate = '';
  @Input() selectedMaxDate = '';
  selectedMinDateInput = '';
  selectedMaxDateInput = '';
  @Output() onClose = new EventEmitter<any>();
  @Output() onSelected = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<any>();
  @Input() dateFormat = 'dd-MM-yyyy';
  @Input() monthFormat = 'MMM YYYY';
  @Input() resetControl = false;
  lblSelectRange = "Select Range"
  rangeSelect: boolean = false;
  minDate: any;
  maxDate: any;
  dateObj = { 'startDate': '', 'endDate': '' }
  lstRanges = [{ 'key': 'Today', 'value': [moment(), moment()] },
  {
    'key': 'Last 24 hours', 'value': [
      moment().subtract(1, "days"),
      moment().subtract(1, "days"),
    ]
  },
  { 'key': 'Last 7 Days', 'value': [moment().subtract(7, "days"), moment()] },
  { 'key': 'Last 30 Days', 'value': [moment().subtract(30, "days"), moment()] },
  { 'key': 'This Month', 'value': [moment().startOf("month"), moment().endOf("month")] },
  {
    'key': 'Last Month', 'value': [
      moment().subtract(1, "month").startOf("month"),
      moment().subtract(1, "month").endOf("month"),
    ]
  },
  ];

  titleForId = 'list-title';
  isLoaded = true;
  isFirstInitialized = false;
  isReset = false;
  @Input() isAnyFilterApplied = false;
  startDateSet = false;
  constructor() { }

  ngOnInit() {
    this.titleForId = this.automationId.split(' ').join('-');
  }


  ngOnChanges(): void {

    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.resetControl) {

      this.clearList();

    } else {

      this.selectedMinDateInput = this.isAnyFilterApplied ? this.selectedMinDate : this.selectedMaxDate;
      this.selectedMaxDateInput = this.selectedMaxDate;
      this.minDate = this.minDateRange;
      this.maxDate = this.maxDateRange;
      // this.dateObj.startDate = moment(this.selectedMaxDate).format('yyyy-MM-DD');
      this.dateObj.startDate = moment(this.isAnyFilterApplied ? this.selectedMinDate : this.selectedMaxDate).format('yyyy-MM-DD');
      this.dateObj.endDate = moment(this.selectedMaxDate).format('yyyy-MM-DD');
      // if (this.isFirstInitialized) {
      //   this.isReset = false;
      // }
      // this.isFirstInitialized = true;
    }
    // if (this.isLoaded) {
    //   this.isFirstInitialized = true;
    //   this.isLoaded = false;
    // }

  }

  getStartDate(e) {
    this.dateObj.startDate = e;
    this.selectedMinDateInput = e;
    this.lblSelectRange = 'Select Range'
    this.startDateSet = true;

    if (Date.parse(this.selectedMinDateInput) > Date.parse(this.selectedMaxDateInput)) {
      this.selectedMaxDateInput = this.selectedMinDateInput;
    }
  }


  getEndDate(e) {
    this.dateObj.endDate = e;
    this.selectedMaxDateInput = e;

    this.lblSelectRange = 'Select Range'
  }

  emitList() {
    this.onSelected.emit(this.dateObj);
  }

  selectRange(obj) {

    this.lblSelectRange = obj.key;
    this.dateObj.startDate = obj.value[0]._d;
    this.dateObj.endDate = obj.value[1]._d;
    this.selectedMinDateInput = obj.value[0]._d;
    this.selectedMaxDateInput = obj.value[1]._d;

    this.rangeSelect = false;
    this.onSelected.emit(this.dateObj);
    this.lblSelectRange = 'Select Range';
  }

  clearList() {

    // this.isFirstInitialized = false;
    // if (this.resetControl) {
    //   this.isReset = true;
    // }
    this.startDateSet = false;
    this.lblSelectRange = 'Select Range';
    this.rangeSelect = false;

    this.selectedMinDateInput = this.maxDateRange;
    this.selectedMaxDateInput = this.maxDateRange;
    this.dateObj.startDate = this.resetMinDate;
    this.dateObj.endDate = this.resetMaxDate;
    this.onClear.emit(this.dateObj);
  }

}
