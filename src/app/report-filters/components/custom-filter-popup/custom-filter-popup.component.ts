import {
  Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild,
  ElementRef
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import * as moment from "moment";
import { AlertModel, AlertType, HeaderType } from 'src/app/shared/models/Alert.Model';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';

@Component({
  selector: 'app-custom-filter-popup',
  templateUrl: './custom-filter-popup.component.html',
  styleUrls: ['./custom-filter-popup.component.scss']
})
export class CustomFilterPopupComponent implements OnInit, OnChanges {
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

  // checkedOptions = Array<any>();
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

  selectedAll = false;
  selectAllEnabled = true;
  @Input() isFilterApplied = false;
  showBorder = null;

  selectionCount = 0;

  constructor(private account: AccountService,
    protected notification: NotificationServiceService,
    protected translationPipe: TranslationConfigService) { }
  ngOnInit() {

    this.datezoneFormat = this.account.user.userDateFormat;
    // this.datezoneFormatMoment = this.datezoneFormat.replace(/d/gi, "D");

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

      this.options.forEach((obj) => {
        obj.checked = false;
        obj.filterApplied = false;
      });
      this.selectedValues = [];
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
      
      if(this.selectionCount === 0) {
        return;
      }
      let emitCheckedOptions = [];
      // this.checkedOptions.forEach(obj => {
      this.persistCheckedOption.forEach(obj => {
        if (obj.checked) {
          emitCheckedOptions.push(obj);
        }
      });
      if (this.selectedAll) {
        this.options.slice().filter(x => x.filterApplied === false).forEach(obj => {
          if (obj.checked) {
            emitCheckedOptions.push(obj);
          }
        });

      } else {
        this.unCheckedOptions.forEach(obj => {
          if (obj.checked) {
            emitCheckedOptions.push(obj);
          }
        });
      }


      if (emitCheckedOptions.length == 0) {
        return;
      }
      if (emitCheckedOptions.length >= 2500) {
        let alertEr: AlertModel = { type: AlertType.DANGER, message: this.translationPipe.getTraslatedValue("d3Reporting", "tooManyValuesSelection"), header: HeaderType.ERROR, isUserExplicitEvent: true };
        this.notification.showNotification(alertEr);
        return;
      }
      this.persistCheckedOption = emitCheckedOptions.slice();//.map(x => x.code);

      this.selectedValues = [];
      this.wildcard = '2';
      this.filterApplied = true;
      this.onApply.emit(emitCheckedOptions);
      // this.checkedOptions = emitCheckedOptions.slice();
      this.getUnCheckedOptions();
    }

  }

  ngOnChanges() {

    if (this.resetControl) {
      this.options.map(x => { x.checked = false; x.searched = true; });
      this.selectedValues = [];
      this.persistCheckedOption = [];
      this.selectedValueWildcard = []
      this.searchboxRef.nativeElement.value = '';
      this.wildcard = '2';
      this.selectedOperatorWildcard = '1';
      this.wildcardActive = false;
      this.filterApplied = false;
      this.selectedAll = false;
      this.ShowHideItems();
      // this.getCheckedOptions();
      // this.getUnCheckedOptions();
      this.selectionCount = 0;
      this.onApply.emit([]);

    } else {

      const nullIndex = this.options.findIndex(x => x.code === null && x.name.toString().trim() === '');
      const spaceIndex = this.options.findIndex(x => x.code !== null && x.name.toString().trim() === '');

      if (nullIndex > -1 && spaceIndex > -1) {
        this.options.splice(spaceIndex, 1);
      }

      if (this.options.length > 0) {
        if (this.options[0].borderClr) {
          this.showBorder = this.options[0].borderClr;
        }
      }
      this.totalCount = this.options.length;

      if (this.selectedValues !== undefined && this.selectedValues.length > 0) {

        this.options.map((x => {
          x.searched = true;
          x.checked = false;
          x.filterApplied = false;
        }));
        this.persistCheckedOption = [];
        this.selectedValues.forEach(value => {
          const element = this.options.find(x => x[this.selectedValueKey] === value);
          if (element) {
            element.checked = true;
            element.filterApplied = true;
            this.persistCheckedOption.push(element);
          }
        });

        this.filterApplied = true;
      } else {
        this.options.map((x => {
          x.searched = true;
          x.checked = false;
          x.filterApplied = false;
        }));
      }
      if (this.persistCheckedOption.length > 0) {
        this.persistCheckedOption.forEach(value => {
          const element = this.options.find(x => x.code === value.code);
          if (element) {
            element.checked = true;
            element.filterApplied = true;
          }
        });
      }

      if (this.selectedValueWildcard !== undefined && this.selectedValueWildcard.length > 0) {
        if ((+this.selectedOperatorWildcard === 2 || +this.selectedOperatorWildcard === 3 || +this.selectedOperatorWildcard === 4)) {
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
        this.visibleCount = this.persistCheckedOption.length + this.unCheckedOptions.length;
        this.selectedAll = this.options.filter(x => x.checked).length === this.options.length && this.options.length !== 0;
      }

      this.selectionCount = this.options.filter(x=>x.checked).length || 0;

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

      this.searchTxt = searchboxValue;
      this.options.forEach(o => {
        o.searched = true;
      });
      this.searched = false;

      if (this.filterApplied) {
        this.options.map((obj) => {
          const element = this.persistCheckedOption.find(x => x.code === obj.code);
          if (element) {
            element.searched = obj.searched;
          }
        });

        // this.unCheckedOptions = this.options.slice().filter(x => x.filterApplied === false);
        this.getUnCheckedOptions();
        count = this.persistCheckedOption.length + this.unCheckedOptions.length;
      } else {

        this.getUnCheckedOptions();
        count = this.persistCheckedOption.length + this.unCheckedOptions.length;
      }

      this.visibleCount = count;
      this.onItemSearched();
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
    this.visibleCount = count;

    if (this.filterApplied) {

      this.options.map((obj) => {
        const element = this.persistCheckedOption.find(x => x.code === obj.code);
        if (element) {
          element.searched = obj.searched;
        }
      });

      this.unCheckedOptions = this.options.slice().filter(x => x.filterApplied === false);
      // this.visibleCount = this.persistCheckedOption.length + this.unCheckedOptions.length;

    } else {

      this.unCheckedOptions = this.options.slice().filter(x => x.filterApplied === false);
      // this.visibleCount = this.persistCheckedOption.length + this.unCheckedOptions.length;
    }

    this.onItemSearched();

  }



  replaceDot(item) {
    let str = (item.name || '').replaceAll('.', '-');
    return str;
  }
  trimSpaces(item) {
    let str = (item || '').trim();
    return item;
  }

  getCheckedOptions() {
    // if (this.options.length > 0) {
    // this.persistCheckedOption = this.options.slice(0, this.initialLimit).filter(x => x.checked);
    // }
  }

  getUnCheckedOptions() {
    this.unCheckedOptions = this.options.slice(0, this.initialLimit).filter(x => x.filterApplied === false);
  }
  getSearchedUnCheckedOptions() {
    this.unCheckedOptions = this.options.slice(0, this.initialLimit).filter(x => x.searched && x.filterApplied === false);
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

    if (this.viewAllFilters) {
      return;
    }
    this.viewAllFilters = true;
    this.initialLimit = this.options.length;
    if (this.searchboxRef.nativeElement.value !== '') {
      this.onLoader.emit(true);
      this.ShowHideItems();
      this.onLoader.emit(false);
    } else {
      this.onLoader.emit(true);

      this.getUnCheckedOptions();
      this.visibleCount = this.persistCheckedOption.length + this.unCheckedOptions.length;
      this.onLoader.emit(false);
    }
  }

  onSelectAll() {

    // this.onLoader.emit(true);
    this.unCheckedOptions = [];
    this.options.forEach(obj => {
      if (obj.searched) {
        obj.checked = this.selectedAll;
        let element = this.persistCheckedOption.find(x => x.code === obj.code);
        if (element && obj.searched) {
          element.checked = this.selectedAll;
          element.searched = obj.searched;
        }
      }
    });
    if (this.searched) {
      this.unCheckedOptions = this.options.slice().filter(x => x.searched && x.filterApplied === false);
    } else {
      this.getUnCheckedOptions();
    }

    this.selectionCount = this.options.filter(x=>x.checked).length || 0;

  }

  onItemSearched() {

    this.selectedAll = this.options.filter(x => x.searched).length ===
      (this.persistCheckedOption.filter(x => x.checked && x.searched).length +
        this.unCheckedOptions.filter(x => x.checked && x.searched).length)
      && this.options.length !== 0;

  }

  onItemChecked(event) {

    this.setSelectedCount(event.target.checked);

    if (this.searched) {
      this.selectedAll = this.options.filter(x => x.searched).length ===
        (this.persistCheckedOption.filter(x => x.checked && x.searched).length +
          this.unCheckedOptions.filter(x => x.checked && x.searched).length)
        && this.options.length !== 0;

    } else {
      this.selectedAll = this.options.length ===
        (this.persistCheckedOption.filter(x => x.checked).length +
          this.unCheckedOptions.filter(x => x.checked).length)
        && this.options.length !== 0;
    }

  }

  setSelectedCount(boolean) {
    if(boolean) {
      this.selectionCount++;
    } else {
      this.selectionCount--;
    }
  }

}
