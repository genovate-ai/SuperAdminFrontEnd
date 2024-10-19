import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';

@Component({
  selector: 'app-custom-report-textbox',
  templateUrl: './custom-report-textbox.component.html'
})
export class CustomReportTextboxComponent implements OnInit, OnChanges {

  @Input() title = 'Filter';
  @Input() fieldPlaceholder = 'Search';

  @Input() searchValue = '';

  @Output() valueChange = new EventEmitter();

  isVisible = false;
  @ViewChild('searchbox', { static: true })
  private searchboxRef: ElementRef;
  constructor() { }

  ngOnInit() {
  }

  onKeyUp() {
    const searchboxValue = this.searchboxRef.nativeElement.value;
    this.valueChange.emit(searchboxValue);
  }

  ngOnChanges() {

    this.searchboxRef.nativeElement.value = this.searchValue;
    this.valueChange.emit(this.searchValue);

  }

}
