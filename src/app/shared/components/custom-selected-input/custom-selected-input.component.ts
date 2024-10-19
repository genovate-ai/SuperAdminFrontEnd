import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-selected-input',
  templateUrl: './custom-selected-input.component.html',
  styleUrls: ['./custom-selected-input.component.scss']
})
export class CustomSelectedInputComponent implements OnInit {

  @Input() ArrayOfObjects = true;
  @Input() bindValue = '';
  @Input() bindLabel = '';
  @Input('i18n-separator-key') separatorKey = '';
  @Input('i18n-plural-key') pluralKey = '';
  @Input('i18n-plural-note-key') pluralNoteKey = '';
  @Input('tagLimit') tagLimit = 1;

  @Input() containerClass = '';

  @Input() itemList = [];
  showRemainingList = false;

  constructor() { }

  ngOnInit() {
  }



}
