import { Component, Input, OnInit, TemplateRef, ContentChild, Output, EventEmitter, forwardRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePickerComponent, IDayCalendarConfig } from 'ng2-date-picker';
import { fromEvent, Observable, Subscription } from "rxjs";
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import * as moment from "moment";

@Component({
  selector: 'app-date-select-box',
  templateUrl: './date-select-box.component.html',
  styleUrls: ['./date-select-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateSelectBoxComponent),
      multi: true
    }
  ]
})
export class DateSelectBoxComponent implements OnInit {

  @Input() id = 'input-id';
  @Input('placeholder') placeholderKey = 'placeholder.key';
  @Input() translate = false;

  @Input() mandatory = false;
  @ContentChild(TemplateRef, { static: true })
  layoutTemplate: TemplateRef<any>;
  @Input() displayError = false;

  @ViewChild('input', { static: true })
  inputRef: ElementRef;
  @ViewChild('errorText', { static: true })
  errorTextRef: ElementRef;

  errorVisible = false

  @ViewChild('dateSelected', { static: true }) datePickerRef: DatePickerComponent;
  @ViewChild('container', { static: true }) containerRef: any;
  @Input() dateFormat = 'dd-MM-yyyy';
  @Input() monthFormat = 'MMM YYYY';
  @Input() firstDayOfWeek = 'su';
  @Input() calenderMode = 'day';

  @Input() minDateRange = '';
  @Input() maxDateRange = '';
  @Input() clearable = false;
  @Input() isDisabled = false;

  @Input() selectedDate: any = '';
  @Output() selected = new EventEmitter<any>();
  displayDate = '';
  moveCalender = false;
  dayPickerConfig: IDayCalendarConfig = null;

  constructor(private elRef: ElementRef) {
  }

  onChange: any = () => { }
  onTouch: any = () => { }
  dateVal: any;

  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription

  ngAfterViewInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {

      this.setErrorContainerWidth();
    })
  }



  ngOnChanges() {

    this.setErrorContainerWidth();
    // this.disable = this.isDisabled;
    // this.dateFormat = this.account.user.userDateFormat;
    if (this.dateFormat != '' && this.dateFormat != undefined && this.dateFormat != null) {
      this.dateFormat = this.dateFormat.replace(/d/gi, "D");
    }
    // if (this.selectedDate && this.selectedDate != '') {
    //   this.displayDate = moment(this.selectedDate).format(this.dateFormat);
    //   this.moveCalender = true;
    // }
    if (this.dayPickerConfig != null && this.minDateRange && this.minDateRange != '') {
      this.dayPickerConfig = <IDayCalendarConfig>{
        ...this.dayPickerConfig,
        min: moment(this.minDateRange).format(this.dateFormat)
      };
    }
    if (this.dayPickerConfig != null && this.maxDateRange && this.maxDateRange != '') {
      this.dayPickerConfig = <IDayCalendarConfig>{
        ...this.dayPickerConfig,
        max: moment(this.maxDateRange).format(this.dateFormat)
      };
    }
  }

  public ngOnInit(): void {

    this.setErrorContainerWidth(true);
    this.dayPickerConfig = <IDayCalendarConfig>{
      format: this.dateFormat,
      monthFormat: this.monthFormat,
      firstDayOfWeek: this.firstDayOfWeek,
      closeOnSelectDelay: 0,
      // appendTo: document.body,
      drops: 'down'
      // min: '01.02.2020'
    };
    if (this.minDateRange && this.minDateRange != '') {
      this.dayPickerConfig.min = moment(this.minDateRange).format(this.dateFormat);
    }
    if (this.maxDateRange && this.maxDateRange != '') {
      this.dayPickerConfig.max = moment(this.maxDateRange).format(this.dateFormat);
    }
  }


  writeValue(value: any) {

    if (value && value != '' && value !== 'Invalid date') {

      // this.dayPickerConfig = null;
      // this.dayPickerConfig = <IDayCalendarConfig>{
      //   ...this.dayPickerConfig,
      // };
      this.displayDate = value;// moment(value).format(this.dateFormat);
      this.selectedDate = value;// moment(value).format(this.dateFormat);
      this.moveCalender = true;

    } else {

      this.displayDate = '';

      // this.selectedDate = '';

    }

  }

  // writeValue(value: any) {

  //   if (value && value != '') {
  //     this.selectedDate = value;
  //     this.displayDate = moment(this.selectedDate).format(this.dateFormat);
  //     this.moveCalender = true;
  //   } else {
  //     this.displayDate = '';
  //     this.selectedDate = '';
  //   }
  // }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn
  }

  setErrorState(state: boolean) {
    this.displayError = state ? state : false;
  }

  setErrorVisible() {
    this.errorVisible = true;
    let elem = document.getElementById(`${this.id}-error-container`);
    if (elem) {
      elem.classList.add('z-i-10000');
    }
  }
  setErrorHidden() {
    this.errorVisible = false;
    let elem = document.getElementById(`${this.id}-error-container`);
    if (elem) {
      elem.classList.remove('z-i-10000');
    }
  }

  setErrorContainerWidth(first = false) {

    // if (!this.mandatory) {
    //   return;
    // }
    if (this.inputRef.nativeElement) {
      let width = this.inputRef.nativeElement.clientWidth;
      if (window.outerWidth === window.innerWidth && !first) {
        width = width > 0 ? width - 32 : width;
      } else {
        width = width > 0 ? width - 16 : width;
      }
      if (this.errorTextRef.nativeElement) {
        // this.errorTextRef.nativeElement.setAttribute('style', `width:${width}px`);
      }
    }
  }

  ngOnDestroy() {
    if (this.resizeSubscription$) {
      this.resizeSubscription$.unsubscribe()
    }
  }

  openDatePicker() {

    if (!this.isDisabled) {
      this.datePickerRef.api.open();
      if (this.moveCalender) {

        this.datePickerRef.api.moveCalendarTo(this.selectedDate);
      }
    }

  }
  closeDatePicker() {
    this.datePickerRef.api.close();
  }

  dateChanged(date: Date) {
    
    if (date) {
      let d = date;
      if (['daytime','time'].includes(this.calenderMode)) {
        d =date['_d']
      } else {
        d = new Date(date['_d'].getFullYear() + '/' + (date['_d'].getMonth() + 1) + '/' + date['_d'].getDate());
      }
      this.displayDate = moment(d).format(this.dateFormat);
      this.dateVal = d;
      this.onChange(this.dateVal);
      this.onTouch();
      this.selected.emit(d);
      this.moveCalender = false;
      // this.dateForm.controls['selectedDate'].setValue('');
    }
  }

  clearDate() {
    // this.dayPickerConfig = null;
    // this.dayPickerConfig = <IDayCalendarConfig>{
    //   ...this.dayPickerConfig,
    // };
    this.displayDate = '';
    this.dateVal = '';
    this.selectedDate = new Date();
    this.moveCalender = false;
    this.datePickerRef.api.moveCalendarTo(moment(new Date()).format(this.dateFormat));
    this.onChange(this.dateVal);

    this.onTouch();
  }



  // clearDate() {

  //   this.displayDate = '';
  //   this.datePickerRef.api.moveCalendarTo(moment(new Date()).format(this.dateFormat));
  //   this.dateVal = '';
  //   this.selectedDate = '';
  //   this.onChange(this.dateVal);
  //   this.onTouch();
  //   // this.selected.emit('');
  // }

  changeCalenderDesign() {

    let calenderContainer = this.elRef.nativeElement.querySelectorAll('.dp-popup, .dp-day-calendar-container, .dp-month-calendar-container');

    for (let i = 0; i < calenderContainer.length; ++i) {
      calenderContainer[i].classList.add('b-r-4px');
    }
  }




}
