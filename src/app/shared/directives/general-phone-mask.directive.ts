import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appGeneralPhoneMask]'
})
export class GeneralPhoneMaskDirective {

  @Input('appGeneralPhoneMask') countryCode;

  private el: HTMLInputElement;
  constructor(public ngControl: NgControl, private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {

    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event, backspace) {

    let newVal = event.replace(/\D/g, '');
    if (this.ngControl.value.length === 1 && (this.firstCharacter())) {
      this.ngControl.reset('');
      newVal = '';
    }
    let val = this.applyFormatting(this.countryCode, newVal);
    this.ngControl.valueAccessor.writeValue(val);
  }

  firstCharacter(): boolean {
    return (isNaN(this.ngControl.value.charAt(0)) || this.ngControl.value == " ") ? true : false
  }

  ngOnChanges() {
  }

  applyFormatting(code, newVal) {
    switch (code) {
      case 1:
      case '1':
      case '+1':
        if (newVal.length === 0) {
          newVal = '';
        } else if (newVal.length <= 3) {
          newVal = newVal.replace(/^(\d{0,3})/, '($1');
        } else if (newVal.length <= 6) {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else if (newVal.length <= 10) {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
        } else {
          newVal = newVal.substring(0, 10);
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
        }
        break;
      default:
        newVal = newVal.substring(0, 11);
        newVal = newVal.replace(/^(\d{0,4})(\d{0,3})(\d{0,4})/, '$1$2$3');
        break;
    }
    return newVal;
  }

}
