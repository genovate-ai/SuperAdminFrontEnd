import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-confirmation-component',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

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
