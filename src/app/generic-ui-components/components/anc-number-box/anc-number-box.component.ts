import { Component, ContentChild, ElementRef, forwardRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';

@Component({
  selector: 'app-anc-number-box',
  templateUrl: './anc-number-box.component.html',
  styleUrls: ['./anc-number-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AncNumberBoxComponent),
      multi: true
    }
  ]
})
export class AncNumberBoxComponent implements OnInit {

  @Input() id = 'input-id';
  @Input('placeholder') placeholderKey = 'placeholder.key';
  @Input() translate = true;


  @Input() mandatory = false;
  @ContentChild(TemplateRef, { static: true })
  layoutTemplate: TemplateRef<any>;
  @Input() displayError = false;
  // @Output() toggled: EventEmitter<boolean> = new EventEmitter();

  @Input() numeric = false;
  @Input() allowDecimal = false;
  @Input() maxDigits = 8;

  @ViewChild('input', { static: true })
  inputRef: ElementRef;
  // @ViewChild('inputNum', { static: true })
  // inputNumRef: ElementRef;
  @ViewChild('errorText', { static: true })
  errorTextRef: ElementRef;
  errorVisible = false;

  elRef: ElementRef;

  onChange: any = () => { }
  onTouch: any = () => { }
  inputVal = "";

  disabled = false;
  @Input() countryCode = 1;
  constructor(translationPipe: TranslationConfigService) { }

  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription

  ngAfterViewInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.setErrorContainerWidth();
    })
  }

  ngOnInit() {
    this.elRef = this.inputRef;
    this.setErrorContainerWidth(true);
  }

  ngOnChanges() {

    if(this.elRef && this.elRef.nativeElement) {
      this.setErrorContainerWidth();
    }
  }

  toggle = (val) => {
    this.setErrorState(val);
  }

  setErrorState(state: boolean) {
    this.displayError = state ? state : false;
    // this.toggled.emit(this.displayError);
  }

  setErrorVisible() {
    this.errorVisible = true;
    let elem = document.getElementById(`${this.id}-error-container`);
    if(elem) {
      elem.classList.add('z-i-10');
    }
  }
  setErrorHidden() {
    this.errorVisible = false;
    let elem = document.getElementById(`${this.id}-error-container`);
    if(elem) {
      elem.classList.remove('z-i-10');
    }
  }

  public set value(val) {

    this.inputVal = val;
    this.onChange(this.inputVal);
    // this.onTouch();
  }
  public get value() {
    return this.inputVal;
  }

  writeValue(value: any) {
    
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn
  }

  setDisabledState(isDisabled: boolean) {
    
    this.disabled = isDisabled;
    this.inputRef.nativeElement.value = '';
  }

  setErrorContainerWidth(first = false) {
    if (this.elRef.nativeElement) {
      let width = this.elRef.nativeElement.clientWidth;
      if (window.outerWidth === window.innerWidth && !first) {
        width = width > 0 ? width - 32 : width;
      } else {
        width = width > 0 ? width - 16 : width;
      }
      if (this.errorTextRef.nativeElement) {
        this.errorTextRef.nativeElement.setAttribute('style', `width:${width}px`);
      }
    }
  }

  ngOnDestroy() {
    if (this.resizeSubscription$) {
      this.resizeSubscription$.unsubscribe()
    }
  }

  onNumFocus(value) {
    this.value = value;
  }

}

