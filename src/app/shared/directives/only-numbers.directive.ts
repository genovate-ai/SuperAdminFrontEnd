import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

 regexStr = '^[0-9]*$';

  constructor(private el: ElementRef) { }

  @Input() appOnlyNumbers: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
     
    let e = <KeyboardEvent> event;
    if (this.appOnlyNumbers) {
        if ([46, 8, 9, 27].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+V
        // (e.keyCode == 86 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return true;
        }

      if(e.keyCode === 110 || e.keyCode === 190 || e.keyCode === 109 || e.keyCode == 189) {

        if(e.code.toLowerCase() === 'minus') {
          if(this.el.nativeElement.value !== '' ||
              (this.el.nativeElement.value.split('-').length >= 2)) {
            e.preventDefault();
          } else {
            return true;
          }
        }

        if(e.code.toLowerCase() === 'numpaddecimal' || e.code.toLowerCase() === 'period' ) {
          if(this.el.nativeElement.value === '' ||
              // (this.el.nativeElement.value.indexOf('-') !== -1 && this.el.nativeElement.value.indexOf('-') === this.el.nativeElement.value.length) ||
              (this.el.nativeElement.value.split('.').length >= 2)) {
            e.preventDefault();
          } else {
            if(this.el.nativeElement.value.indexOf('-') === (this.el.nativeElement.value.length - 1)) {
              e.preventDefault();
            }
          }
        }

        return;
      }

      let ch = String.fromCharCode(e.keyCode);
      let regEx =  new RegExp(this.regexStr);
      if(regEx.test(ch))
        return;
      else
         e.preventDefault();
      }

    }

}
