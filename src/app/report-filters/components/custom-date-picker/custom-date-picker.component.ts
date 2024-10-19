import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import * as moment from "moment";
import { Moment } from "moment";
import { DatePickerComponent, IDayCalendarConfig } from 'ng2-date-picker';

// import { DatePickerComponent, IDayCalendarConfig } from 'ng2-date-picker';
// import { DatePickerDirective } from 'ng2-date-picker';
// import { IDayCalendarConfig, DatePickerComponent } from "ng2-date-picker";

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss']

})
export class CustomDatePickerComponent implements OnInit {
  // dateOldVersion = new Date();
  // @ViewChild('dateFromDp', { static: true }) public dateFromDp: any;
  // @ViewChild('dateToDp', { static: true }) public dateToDp: any;


  ////
  // @ViewChild('dayPicker', { static: true }) datePicker: DatePickerComponent;
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
  ////////////

  // public filterForm: FormGroup;
  // // public displayDate;
  // inc = 1;




  // constructor(private fb: FormBuilder) {
  //   // this.createForm();
  // }
  // ngOnInit() {

  // }

  // name = 'ng2-date-picker';
  // date = '';
  // dateOutForm = '';
  constructor(private datePipe: DatePipe, private fb: UntypedFormBuilder, private elRef: ElementRef) {
    // this.date = this.datePipe.transform(new Date('2020-02-02'), 'yyyy-MM-dd');
    // this.dateOutForm = this.datePipe.transform(new Date('2020-02-03'), 'yyyy-MM-dd');
    // this.createForm();
    this.createDateForm();
  }


  // datePickerConfig = { format: 'YYYY-MM-DD', firstDayOfWeek: 'su', monthFormat: 'MMM YYYY', };

  ngOnChanges() {

    if (this.dateFormat != '' && this.dateFormat != undefined && this.dateFormat != null) {

      this.dateFormat = this.dateFormat.replace(/d/gi, "D");
    }
    if (this.selectedDate != '' && this.selectedDate != undefined && this.selectedDate != null) {
      this.displayDate = moment(this.selectedDate).format(this.dateFormat);
      this.moveCalender = true;
    } else {
      if(this.clearable && this.selectedDate == '') {
        this.clearDate();
      }
    }
    if(this.dayPickerConfig != null && this.minDateRange != '') {
      this.dayPickerConfig = <IDayCalendarConfig>{
        ...this.dayPickerConfig,
        min: moment(this.minDateRange).format(this.dateFormat)
      };
      // this.datePickerRef.api.moveCalendarTo(moment(this.selectedDate).format(this.dateFormat));
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

    // this.filterForm.controls['dateFrom'].setValue('20.02.2020');
    // When DateFrom changes we set the min selectable value for DateTo
    // this.filterForm.get('dateFrom').valueChanges.subscribe(value => {
    //   this.dateToDp.displayDate = value; // DateTo
    //   this.dayPickerConfig = {
    //     min: value,
    //     ...this.dayPickerConfig
    //   };
    // });

  }

  // couleurBouton() {

  //   var header = this.elRef.nativeElement.querySelector('.dp-nav-header-btn');
  //   if (header) {
  //     header.classList.add('dp-nav-header-btn--2')
  //     // header.style.color = "#c8960f";
  //   }
  //

  //   let weekDaylist;
  //   weekDaylist = document.querySelectorAll(".dp-calendar-weekday");
  //   for (let i = 0; i < weekDaylist.length; ++i) {
  //     weekDaylist[i].classList.add('dp-calendar-weekday--2');
  //   }
  //   let daylist;
  //   daylist = document.querySelectorAll(".dp-calendar-day, dp-current-day");
  //   for (let i = 0; i < daylist.length; ++i) {
  //     daylist[i].classList.add('dp-day-month--2');
  //   }
  //   let monthlist;
  //   monthlist = document.querySelectorAll(".dp-calendar-month, dp-current-month");
  //   for (let i = 0; i < monthlist.length; ++i) {
  //     monthlist[i].classList.add('dp-day-month--2');
  //   }

  //   // var current = this.elRef.nativeElement.querySelector('.dp-current-month');
  //   // if (current) {
  //   //   current.style.border = "1px solid #c8960f";
  //   // }

  //   let selected = this.elRef.nativeElement.querySelector('.dp-selected');
  //   if (selected) {
  //     selected.style.background = "transparent";
  //     selected.style.color = "#6bccd1";
  //   }

  //   this.inc = 5;

  // }

  // private createForm(): void {
  //   this.filterForm = this.fb.group({
  //     dateFrom: new FormControl(),
  //     dateTo: new FormControl()
  //   });
  // }

  // open() {
  //   this.datePicker.api.open();
  // }
  // close() {
  //   this.datePicker.api.close();
  // }

  private createDateForm(): void {
    this.dateForm = this.fb.group({
      selectedDate: new UntypedFormControl(),
    });
  }

  openDatePicker() {

    // this.changeCalenderDesign();
    this.datePickerRef.api.open();
    if (this.moveCalender) {
      this.datePickerRef.api.moveCalendarTo(moment(this.selectedDate).format(this.dateFormat));
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
    // this.changeCalenderDesign();
  }

  changeCalenderDesign() {

    // let header = this.elRef.nativeElement.querySelector('.dp-nav-header-btn');
    // if (header) {
    //   header.classList.add('dp-nav-header-btn--2')
    // }

    // let selected = this.elRef.nativeElement.querySelector('.dp-selected');
    // if (selected) {
    //   selected.style.background = "transparent";
    //   selected.style.color = "#6bccd1";
    // }


    // let weekDaylist;
    // weekDaylist = this.elRef.nativeElement.querySelectorAll(".dp-weekdays");
    // for (let i = 0; i < weekDaylist.length; ++i) {
    //   weekDaylist[i].classList.add('dp-weekdays--2');
    // }
    // let daylist;
    // daylist = this.elRef.nativeElement.querySelectorAll(".dp-calendar-day, .dp-current-day");
    // for (let i = 0; i < daylist.length; ++i) {
    //   daylist[i].classList.add('dp-day-month--2');
    // }

    // let monthlist;
    // monthlist = this.elRef.nativeElement.querySelectorAll(".dp-calendar-month, .dp-current-month");
    // for (let i = 0; i < monthlist.length; ++i) {
    //   monthlist[i].classList.add('dp-day-month--2');
    // }

    // let navContainer = this.elRef.nativeElement.querySelectorAll('.dp-nav-btns-container');
    // for (let i = 0; i < navContainer.length; ++i) {
    //   navContainer[i].classList.add('dp-nav-btns-container--2');
    // }

    // let calenderContainer = document.querySelectorAll('.dp-day-calendar-container, .dp-month-calendar-container');
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
