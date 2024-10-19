import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  @Output() clickoutside: EventEmitter<any>;
  @Input() enableWhiteListing: boolean;
  constructor(private elementRef: ElementRef) {
    this.clickoutside = new EventEmitter<any>();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {

    const isInsideClicked = this.elementRef.nativeElement.contains(targetElement);

    if(this.enableWhiteListing) {
      const isWhiteListed = targetElement.classList.contains('whitelisted');
      if(!isInsideClicked && isWhiteListed) {

      } else {
        this.clickoutside.emit(null);
      }
    } else {
        if(!isInsideClicked) {
          this.clickoutside.emit(null);
        }
    }
  }

}
