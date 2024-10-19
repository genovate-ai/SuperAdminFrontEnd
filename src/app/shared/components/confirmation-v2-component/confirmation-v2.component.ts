import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-confirmation-v2-component',
  templateUrl: './confirmation-v2.component.html',
  styleUrls: ['./confirmation-v2.component.scss']
})
export class ConfirmationV2Component implements OnInit {

  @Input() message: string;
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
