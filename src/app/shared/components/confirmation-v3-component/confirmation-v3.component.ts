import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-v3',
  templateUrl: './confirmation-v3.component.html',
  styleUrls: ['./confirmation-v3.component.scss']
})
export class ConfirmationV3Component implements OnInit {

  @Input() boldTxt: string = '';
  @Input() disableBold = true;
  @Input() message: string = '';
  @Input() popupOpen = false;
  @Input() isDelete = true;

  @Output() positive = new EventEmitter()
  @Output() negative = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }
  Positive() {
    this.positive.emit(true);
  }
  Negative() {
    this.negative.emit(false);
  }

}
