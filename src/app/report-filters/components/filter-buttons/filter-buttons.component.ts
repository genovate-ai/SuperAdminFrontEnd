import { filter } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-buttons',
  templateUrl: './filter-buttons.component.html',
  styleUrls: ['./filter-buttons.component.scss']
})
export class FilterButtonsComponent implements OnInit {

  constructor() { }

  // tslint:disable-next-line: no-input-rename
  @Input('toggleIcon') toggleIcon = false;

  // tslint:disable-next-line: no-input-rename
  @Input('filterIconClass') filterIconClass = 'fas fa-filter';
  // tslint:disable-next-line: no-input-rename
  @Input('resetIconClass') resetIconClass = 'fas fa-undo';
  // tslint:disable-next-line: no-input-rename
  @Input('saveIconClass') saveIconClass = 'fas fa-lock';
  // tslint:disable-next-line: no-input-rename
  @Input('unsaveIconClass') unsaveIconClass = 'fas fa-unlock';

  // tslint:disable-next-line: no-input-rename
  @Input('filterIconTooltip') filterIconTooltip = '';
  // tslint:disable-next-line: no-input-rename
  @Input('resetIconTooltip') resetIconTooltip = '';
  // tslint:disable-next-line: no-input-rename
  @Input('unsaveIconTooltip') unsaveIconTooltip = '';
  // tslint:disable-next-line: no-input-rename
  @Input('saveIconTooltip') saveIconTooltip = '';
  // tslint:disable-next-line: no-input-rename
  @Input('filterAppliedToggler') filterAppliedToggler = false;
  @Input('unsavedChanges') unsavedChanges = false;

  // tslint:disable-next-line: no-output-rename
  @Output('saveFunction') saveFunction = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('unsaveFunction') unsaveFunction = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('filterFunction') filterFunction = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('resetFunction') resetFunction = new EventEmitter();

  ngOnInit() {
  }

  onSaveCLick() {
    this.saveFunction.emit();
  }
  onUnsaveCLick() {
    this.unsaveFunction.emit();
  }
  onResetCLick() {
    this.resetFunction.emit();
  }
  onFilterCLick() {
    this.filterFunction.emit();
  }

}
