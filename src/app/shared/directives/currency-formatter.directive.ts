import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCurrencyFormatter]'
})
export class CurrencyFormatterDirective {

  // currencyChars = new RegExp(','); // we're going to remove commas and dots

  // constructor(public el: ElementRef, public renderer: Renderer2, private decimalPipe: DecimalPipe) {}

  // ngOnInit() {
  //   this.format(this.el.nativeElement.value); // format any initial values
  // }

  // @HostListener('input', ["$event.target.value"]) onInput(e: string) {
  //   this.format(e);
  // };

  // @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
  //   event.preventDefault();
  //   this.format(event.clipboardData.getData('text/plain'));
  // }

  // format(val:string) {
  //   // 1. test for non-number characters and replace/remove them
  //   const numberFormat = parseInt(String(val).replace(this.currencyChars, ''));
  //   // console.log(numberFormat); // raw number

  //   // 2. format the number (add commas)
  //   const usd = this.decimalPipe.transform(numberFormat, '1.2-3', 'en-PK');

  //   // 3. replace the input value with formatted numbers
  //   this.renderer.setProperty(this.el.nativeElement, 'value', usd);
  // }
  private regexString(max?: number) {
    const maxStr = max ? `{0,${max}}` : `+`;
    // return `^(\\d${maxStr}(\\.\\d{0,10})?|\\.\\d{0,10})$`
    // return this.allowDecimal ? `^(\\d${maxStr}(\\.\\d{0,8})?|\\.\\d{0,8})$` :  `^(\\d${maxStr}(\\d{0,8})?|\\d{0,8})$`

    return this.allowDecimal ? `^([-]?\\d${maxStr}(\\.\\d{0,8})?|\\.\\d{0,8})$` :  `^[-]?[0-9]{1,8}$`


  }
  private digitRegex: RegExp;
  private setRegex(maxDigits?: number) {
    this.digitRegex = new RegExp(this.regexString(maxDigits), 'g')
  }
  @Input() allowDecimal: boolean = false;
  @Input()
  set maxDigits(maxDigits: number) {
    this.setRegex(maxDigits);
  }

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private currencyPipe: CurrencyPipe
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnChanges() {

    this.valueToCommaFormat(this.el.value);
  }

  ngOnInit() {

    // this.el.value = this.currencyPipe.transform(this.el.value, '', '', '1.0-10');
    this.setRegex();
    setTimeout(() => {
      this.valueToCommaFormat(this.el.value);
    }, 100);
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {

    // on focus remove currency formatting
    // this.el.value = value.replace(/[^0-9.]+/g, '')
    this.el.value = value.replace(/,/g, '')
    this.el.select();
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    // on blur, add currency formatting
    this.valueToCommaFormat(value)

  }

  @HostListener("keydown.control.z", ["$event.target.value"])
  onUndo(value) {
    this.el.value = '';
  }

  // variable to store last valid input
  private lastValid = '';
  @HostListener('input', ['$event'])
  onInput(event) {

    // on input, run regex to only allow certain characters and format
    if (event.target.value[0] === '.') {
      this.el.value = '';
      return
    }
    // const cleanValue = (event.target.value.match(this.digitRegex) || []).join('')
    let cleanValue;
    // if(this.allowDecimal) {
      cleanValue = (event.target.value.match(new RegExp(this.regexString(8), 'g')) || []).join('');
    // } else {
    //   cleanValue = /^[0-9]{1,8}$/.test(event.target.value);
    // }
    if (cleanValue || !event.target.value)
      this.lastValid = cleanValue
    this.el.value = cleanValue || this.lastValid
  }

  countDecimals(value) {
    if (Math.floor(value) === value) return 0;
    const lenArr = value.toString().split(".")[1] || [];
    return lenArr.length || 0;
  }

  valueToCommaFormat(value) {
    const len = this.countDecimals(value);
    if (isNaN(value)) {
      this.el.value = value;
      return;
    }
    this.el.value = this.currencyPipe.transform(value, '', '', `1.${len}-${len}`);
  }
}
