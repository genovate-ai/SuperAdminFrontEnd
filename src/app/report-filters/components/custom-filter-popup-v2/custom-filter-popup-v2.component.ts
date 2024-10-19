import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';

@Component({
  selector: 'app-custom-filter-popup-v2',
  templateUrl: './custom-filter-popup-v2.component.html',
  styleUrls: ['./custom-filter-popup-v2.component.scss']
})
export class CustomFilterPopupV2Component implements OnInit {
  @Input() title = 'list-title';
  @Input() automationId = 'list-title';
  @Input() options = Array<any>();
  @Input() selectedValues = [];
  @Input() selectedValueWildcard = [];
  @Input() selectedOperatorWildcard = '0';

  // @Input() savedValues = [];
  @Input() heightClass = '';

  @Input() resetControl = false;
  @Input() isFilterForDate = false;

  @Input() selectedValueKey = 'name';


  titleForId = 'list-title';

  datezoneFormat;
  datezoneFormatMoment = '';

  // @Input() initialCount = 0;
  @Input() initialLimit = 20;
  @Input() totalCount = 0;
  @Input() wildcardEnable = true;
  @Input() showFooter = true;

  @Output() onViewAll = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  @Output() onApply = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<any>();
  @Output() onWildcardApply = new EventEmitter<any>();
  @Output() onLoader = new EventEmitter<any>();

  checkedOptions = Array<any>();
  unCheckedOptions = Array<any>();
  persistCheckedOption = [];

  wildcardActive = false;
  wildcard = '2';

  @ViewChild('searchbox', { static: true })
  private searchboxRef: ElementRef;

  searched = false;
  source: any;
  searchTxt = '';

  viewAllFilters = false
  visibleCount = 0;
  filterApplied = false;

  constructor(private account: AccountService,
    protected notification: NotificationServiceService) { }
  ngOnInit() {

    this.datezoneFormat = this.account.user.userDateFormat;
    this.datezoneFormatMoment = this.datezoneFormat.replace(/d/gi, "D");

    this.titleForId = this.automationId.split(' ').join('-');
    // this.visibleCount = this.initialLimit;
  }

  ngAfterViewInit(): void {
    this.source = fromEvent(this.searchboxRef.nativeElement, 'keyup');
    this.source.pipe(debounceTime(1000)).subscribe(c => {
      if (!this.wildcardActive) {
        this.onLoader.emit(true);
        this.ShowHideItems();
        this.onLoader.emit(false);
      }
    });
  }

  clearList() {
    this.searchboxRef.nativeElement.value = '';

    if (!this.wildcardActive) {

      this.onLoader.emit(true);
      this.ShowHideItems();
      // this.onLoader.emit(false);

      this.options.map((obj) => {
        obj.checked = false;
      });
      this.getCheckedOptions();
      this.getUnCheckedOptions();
    } else {
      this.wildcard = '2';
    }
    this.filterApplied = false;
    this.persistCheckedOption = [];
    this.onClear.emit([]);
  }
  emitList() {

    if (this.wildcardActive) {
      if (this.searchboxRef.nativeElement.value.trim() === '') {
        return;
      }
      const obj = {
        value: [this.searchboxRef.nativeElement.value],
        wildcard: +this.wildcard
      }
      this.options.map((obj) => {
        obj.checked = false;
      });
      this.selectedValues = [];
      this.filterApplied = true;
      this.onWildcardApply.emit(obj);
    } else {

      const checkedOptions = this.options.filter(x => x.checked);
      if (checkedOptions.length == 0) {
        return;
      }
      this.persistCheckedOption = checkedOptions.map(x => x.code);

      this.selectedValues = [];
      this.wildcard = '2';
      this.filterApplied = true;
      this.onApply.emit(checkedOptions);
      this.checkedOptions = checkedOptions.slice();
      this.getUnCheckedOptions();
    }

  }

  ngOnChanges() {

    if (this.resetControl) {
      this.options.map(x => { x.checked = false; x.searched = true; });
      this.selectedValues = [];
      this.persistCheckedOption = [];
      this.searchboxRef.nativeElement.value = '';
      this.wildcard = '2';
      this.filterApplied = false;
      this.ShowHideItems();
      // this.getCheckedOptions();
      // this.getUnCheckedOptions();
      this.onApply.emit([]);
      // setTimeout(() => {

      // }, 0);

    } else {

      const nullIndex = this.options.findIndex(x => x.code === null && x.name.toString().trim() === '');
      const spaceIndex = this.options.findIndex(x => x.code !== null && x.name.toString().trim() === '');

      if (nullIndex > -1 && spaceIndex > -1) {
        this.options.splice(spaceIndex, 1);
      }


      if (this.selectedValues !== undefined && this.selectedValues.length > 0) {

        this.options.map((x => {
          x.searched = true;
          x.checked = false;
        }));
        this.selectedValues.forEach(value => {
          const element = this.options.find(x => x[this.selectedValueKey] === value);
          if (element) {
            element.checked = true;
          }
        });
      } else {
        this.options.map((x => {
          x.searched = true;
          x.checked = false;
        }));
      }

      if (this.persistCheckedOption.length > 0) {
        this.persistCheckedOption.forEach(value => {
          const element = this.options.find(x => x.code === value);
          if (element) {
            element.checked = true;
          }
        });
      }

      if (this.selectedValueWildcard !== undefined && this.selectedValueWildcard.length > 0) {
        if (this.selectedValueWildcard.length == 1 && (+this.selectedOperatorWildcard === 2 || +this.selectedOperatorWildcard === 3 || +this.selectedOperatorWildcard === 4)) {
          this.searchboxRef.nativeElement.value = this.selectedValueWildcard[0];
          this.wildcard = this.selectedOperatorWildcard.toString();

          this.selectedValueWildcard = [];
          this.selectedOperatorWildcard = '0';
          this.wildcardActive = true;
        }
      }



      if (this.searchboxRef.nativeElement.value.trim() !== '' && !this.wildcardActive) {
        this.onLoader.emit(true);
        this.ShowHideItems();
        this.onLoader.emit(false);
      } else {
        this.getCheckedOptions();
        this.getUnCheckedOptions();
        this.visibleCount = this.checkedOptions.length + this.unCheckedOptions.length;
      }

    }


  }



  ShowHideItems() {

    if (this.wildcardActive) {
      return;
    }

    let count = 0;
    let searchboxValue = this.searchboxRef.nativeElement.value;
    searchboxValue = searchboxValue.replace(/[^\x00-\x7F]/g, "");
    if (searchboxValue.trim() === '') {
      if (this.searched) {

        this.searchTxt = searchboxValue;
        this.options.forEach(o => {
          count = count + 1;
          o.searched = true;
        });
        // this.initialCount = count;
        this.visibleCount = count;
        this.searched = false;
      }
      if(this.filterApplied) {
        this.getCheckedOptions();
        this.getUnCheckedOptions();
      } else {
        this.checkedOptions = [];
        this.unCheckedOptions = this.options.slice(0,this.initialLimit);
      }

      this.visibleCount = this.checkedOptions.length + this.unCheckedOptions.length;
      return;
    }

    this.searched = true;
    if (this.isFilterForDate) {

      this.options.forEach(o => {
        if ((o.date === null ? 'Blank' :
          moment(o.date).format(this.datezoneFormatMoment).toString())
          .toLowerCase().indexOf(searchboxValue.toLowerCase()) > -1) {
          o.searched = true;
          count = count + 1;
        } else {
          o.searched = false;
        }
      });
    } else {
      this.options.forEach(o => {
        if (o.name.toLowerCase().indexOf(searchboxValue.toLowerCase()) > -1) {
          count = count + 1;
          o.searched = true;
        } else {
          o.searched = false;
        }
      });
    }
    this.searchTxt = searchboxValue;
    // this.initialCount = count;
    this.visibleCount = count;
    if (!this.viewAllFilters) {
      if(this.filterApplied) {
        // if (this.options.length > 0) {
          this.checkedOptions = this.options.filter(x => x.checked);
        // }
        // if (this.options.length > 0) {
          this.unCheckedOptions = this.options.filter(x => x.checked == false);
        // }
      } else {
        this.checkedOptions = [];
        this.unCheckedOptions = this.options.slice();
      }

    }
  }



  replaceDot(item) {
    let str = (item.name || '').replaceAll('.', '-');
    return str;
  }
  trimSpaces(item) {
    let str = (item.name || '').trim();
    return str;
  }

  getCheckedOptions() {
    // if (this.options.length > 0) {
      this.checkedOptions = this.options.slice(0, this.initialLimit).filter(x => x.checked);
    // }
  }

  getUnCheckedOptions() {
    // if (this.options.length > 0) {
      this.unCheckedOptions = this.options.slice(0, this.initialLimit).filter(x => x.checked == false);
    // }
  }

  trackByName(index: number, item: any): string {
    return item.name;
  }

  switchWildcard(val) {

    this.wildcardActive = !val;

    if (this.wildcardActive) {

    } else {
      this.onLoader.emit(true);
      this.ShowHideItems();
      // this.getCheckedOptions();
      // this.getUnCheckedOptions();
      this.onLoader.emit(false);
    }

  }

  showAllFilters() {
    this.viewAllFilters = true;
    this.initialLimit = this.options.length;
    if (this.searchboxRef.nativeElement.value !== '') {
      this.onLoader.emit(true);
      this.ShowHideItems();
      this.onLoader.emit(false);
    } else {
      this.onLoader.emit(true);
      this.getCheckedOptions();
      this.getUnCheckedOptions();
      this.visibleCount = this.checkedOptions.length + this.unCheckedOptions.length;
      this.onLoader.emit(false);
    }
  }

}
