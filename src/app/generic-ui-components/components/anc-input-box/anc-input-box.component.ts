import { Component, Input, OnInit, TemplateRef, ContentChild, Output, EventEmitter, forwardRef, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Observable, Subscription } from "rxjs";
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';

@Component({
  selector: 'app-anc-input-box',
  templateUrl: './anc-input-box.component.html',
  styleUrls: ['./anc-input-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AncInputBoxComponent),
      multi: true
    }
  ]
})
export class AncInputBoxComponent implements OnInit {

  @Input() id = 'input-id';
  @Input('placeholder') placeholderKey = 'placeholder.key';
  @Input() translate = true;
  @Input() focus = false;


  @Input() mandatory = false;
  @ContentChild(TemplateRef, { static: true })
  layoutTemplate: TemplateRef<any>;
  @Input() displayError = false;
  // @Output() toggled: EventEmitter<boolean> = new EventEmitter();

  @Input() numeric = false;
  @Input() allowDecimal = false;
  @Input() maxDigits = 8;
  @Output() focusOut = new EventEmitter<any>();


  @ViewChild('input', { static: true })
  inputRef: ElementRef;
  @ViewChild('inputNum', { static: true })
  inputNumRef: ElementRef;
  @ViewChild('errorText', { static: true })
  errorTextRef: ElementRef;
  errorVisible = false;



  elRef: ElementRef;

  onChange: any = () => { }
  onTouch: any = () => { }
  inputVal = "";
  disabled = false
  constructor(translationPipe: TranslationConfigService, private _renderer: Renderer2, private _elementRef: ElementRef) { }

  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription

  ngAfterViewInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.setErrorContainerWidth();
    })
    this._renderer.removeAttribute(this._elementRef.nativeElement, 'id')
  }

  ngOnInit() {
    this.elRef = this.numeric ? this.inputNumRef : this.inputRef;
    this.setErrorContainerWidth(true);
    if(this.focus == true){
    this.inputRef.nativeElement.focus();
    }
  }

  ngOnChanges() {

    if (this.elRef && this.elRef.nativeElement) {
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
    if (this.elRef && this.elRef.nativeElement) {
      this.setErrorContainerWidth();
    }
    this.errorVisible = true;
    let elem = document.getElementById(`${this.id}-error-container`);
    if (elem) {
      elem.classList.add('z-i-10');
    }
  }
  setErrorHidden() {
    this.errorVisible = false;
    let elem = document.getElementById(`${this.id}-error-container`);
    if (elem) {
      elem.classList.remove('z-i-10');
    }
  }

  public set value(val) {

    this.inputVal = val;
    this.onChange(this.inputVal);
    this.focusOut.emit(true);
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

  setDisabledState(isDisabled: boolean) {
    this.setErrorContainerWidth(true);
    this.disabled = isDisabled;
    if (isDisabled) {
      this.inputRef.nativeElement.value = '';
    }
  }

  ngOnDestroy() {
    if (this.resizeSubscription$) {
      this.resizeSubscription$.unsubscribe()
    }
  }

  onNumFocus(value) {
    this.value = value;
    this.onTouch();
  }

}
