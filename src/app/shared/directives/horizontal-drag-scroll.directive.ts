import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHorizontalDragScroll]'
})
export class HorizontalDragScrollDirective implements OnInit, OnDestroy {

  @Input() disabled = false;
  isDown = false;
  isScrollDisabled;
  startX;
  scrollLeft

  mouseDownListen;
  mouseLeaveListen;
  mouseUpListen;
  mouseMoveListen;

  constructor(private _renderer2: Renderer2, private _el: ElementRef, private ngZone: NgZone) { }

  ngOnInit(): void {

    this.mouseDownListen = this._renderer2.listen(this._el.nativeElement, "mousedown", event => {

      this.isScrollDisabled = this.disabled;
      this.isDown = true;
      this.startX = event.pageX - this._el.nativeElement.offsetLeft;
      this.scrollLeft = this._el.nativeElement.scrollLeft;

      this.ngZone.runOutsideAngular(() => {

        this.mouseMoveListen = this._renderer2.listen(this._el.nativeElement, "mousemove", event => {
          if (!this.isDown || this.isScrollDisabled) return;
          event.preventDefault();
          const x = event.pageX - this._el.nativeElement.offsetLeft;
          const walk = (x - this.startX) * 3; //scroll-fast
          this._el.nativeElement.scrollLeft = this.scrollLeft - walk;
        });
      });

      this.mouseLeaveListen = this._renderer2.listen(this._el.nativeElement, "mouseleave", event => {
        this.isDown = false;
      });

      this.mouseUpListen = this._renderer2.listen(this._el.nativeElement, "mouseup", event => {
        this.isDown = false;
        this.mouseLeaveListen();
        this.mouseUpListen();
        this.mouseMoveListen();
      });

    });

    // this.mouseLeaveListen = this._renderer2.listen(this._el.nativeElement, "mouseleave", event => {
    //   this.isDown = false;
    // });
    // this.mouseUpListen = this._renderer2.listen(this._el.nativeElement, "mouseup", event => {
    //   this.isDown = false;
    // });
    // this.mouseMoveListen = this._renderer2.listen(this._el.nativeElement, "mousemove", event => {
    //   if (!this.isDown) return;
    //   event.preventDefault();
    //   const x = event.pageX - this._el.nativeElement.offsetLeft;
    //   const walk = (x - this.startX) * 3; //scroll-fast
    //   this._el.nativeElement.scrollLeft = this.scrollLeft - walk;
    //   console.log(walk);
    // });

  }

  ngOnDestroy(): void {

    this.mouseDownListen();


  }


}
