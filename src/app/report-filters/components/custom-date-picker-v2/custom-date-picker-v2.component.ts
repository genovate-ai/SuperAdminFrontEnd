import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import * as moment from "moment";
import { Moment } from "moment";
import { DatePickerComponent, IDayCalendarConfig } from 'ng2-date-picker';
import { AccountService } from 'src/app/shared/services/common/account.service';
@Component({
  selector: 'app-custom-date-picker-v2',
  templateUrl: './custom-date-picker-v2.component.html',
  styleUrls: ['./custom-date-picker-v2.component.scss']
})
export class CustomDatePickerV2Component implements OnInit {

  @ViewChild('dateSelected', { static: true }) datePickerRef: DatePickerComponent;
  @ViewChild('container', { static: true }) containerRef: any;
  @Input() inputId = 'app.more';
  @Input() btnId = 'app.more';
  @Input('i18n-placeholder-key') placeholderKey = 'app.more';
  @Input('i18n-button-key') btnTextKey = '';
  @Input() dateFormat = 'dd-MM-yyyy';
  @Input() monthFormat = 'MMM YYYY';
  @Input() firstDayOfWeek = 'su';
  public dateForm: UntypedFormGroup;

  @Input() selectedDate = '';
  @Input() calenderMode = 'day';
  displayDate = '';
  @Output() onSelected = new EventEmitter<any>();
  readonlyForm = true;
  moveCalender = false;
  dayPickerConfig: IDayCalendarConfig = null;
  @Input() calenderType = 'input';
  @Input() clearable = false;
  @Input() minDateRange = '';
  @Input() isDisabled = false;
  disable:boolean = false;




  constructor(private datePipe: DatePipe, private fb: UntypedFormBuilder, private elRef: ElementRef,protected account:AccountService) {

    this.createDateForm();
  }
  ngOnChanges() {
    this.disable = this.isDisabled;
    this.dateFormat = this.account.user.userDateFormat;
    if (this.dateFormat != '' && this.dateFormat != undefined && this.dateFormat != null) {

      this.dateFormat = this.dateFormat.replace(/d/gi, "D");
    }
    if (this.selectedDate != '' && this.selectedDate != undefined && this.selectedDate != null) {
      this.displayDate = moment(this.selectedDate).format(this.dateFormat);
      this.moveCalender = true;
    }
    if(this.dayPickerConfig != null && this.minDateRange != '') {
      this.dayPickerConfig = <IDayCalendarConfig>{
        ...this.dayPickerConfig,
        min: moment(this.minDateRange).format(this.dateFormat)
      };
    }
  }

  public ngOnInit(): void {


    this.dayPickerConfig = <IDayCalendarConfig>{
      format: this.dateFormat,
      monthFormat: this.monthFormat,
      firstDayOfWeek: this.firstDayOfWeek,
      closeOnSelectDelay: 0,
      // appendTo: document.body,
      drops: 'down'
      // min: '01.02.2020'
    };
    if(this.minDateRange && this.minDateRange != '') {
      this.dayPickerConfig.min = moment(this.minDateRange).format(this.dateFormat);
    }


  }


  private createDateForm(): void {
    this.dateForm = this.fb.group({
      selectedDate: new UntypedFormControl(),
    });
  }

  openDatePicker() {
    if(!this.disable)
    {
      this.datePickerRef.api.open();
      if (this.moveCalender) {
        this.datePickerRef.api.moveCalendarTo(moment(this.selectedDate).format(this.dateFormat));
      }
    }
  
  }
  closeDatePicker() {
    this.datePickerRef.api.close();
  }

  dateChanged(date: Date) {
    if (date) {
      let d = new Date(date['_d'].getFullYear() + '/' + (date['_d'].getMonth() + 1) + '/' + date['_d'].getDate());
      this.displayDate = moment(d).format(this.dateFormat);
      this.onSelected.emit(d);
      this.moveCalender = false;
      this.dateForm.controls['selectedDate'].setValue('');
    }
  }

  changeCalenderDesign() {


    let calenderContainer = this.elRef.nativeElement.querySelectorAll('.dp-popup, .dp-day-calendar-container, .dp-month-calendar-container');

    if(this.calenderType === 'button') {
      for (let i = 0; i < calenderContainer.length; ++i) {
        calenderContainer[i].classList.add('arrow-point');
        calenderContainer[i].classList.add('b-r-12px');
        calenderContainer[i].classList.add('z-1');
      }
    } else {
      for (let i = 0; i < calenderContainer.length; ++i) {
        calenderContainer[i].classList.add('arrow-point');
        calenderContainer[i].classList.add('b-r-12px');
      }
    }
  }

  clearDate() {
    this.displayDate = '';
    this.datePickerRef.api.moveCalendarTo(moment(new Date()).format(this.dateFormat));
    this.onSelected.emit('');
  }




}
