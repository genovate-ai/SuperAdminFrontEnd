import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[inputMask]'
})
export class InputMaskDirective {

  
  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    if(event && event.replace){
    this.onInputChange(event, false);
    }
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);

  }
  

  onInputChange(event, backspace) {
    
    let newVal =  event.replace();
    
     if (backspace ) {
       newVal = this.ngControl.value.trim()
       
       this.ngControl.valueAccessor.writeValue(newVal)
      
    }
    if (this.ngControl.value.length == 1 && newVal == " "){
      this.ngControl.reset('')
      newVal = ''
    }
    
    this.ngControl.valueAccessor.writeValue(newVal);
  }
}
