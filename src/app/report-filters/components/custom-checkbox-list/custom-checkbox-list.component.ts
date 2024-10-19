import {
  Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild,
  ElementRef
} from '@angular/core';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import * as moment from "moment";

@Component({
  selector: 'app-custom-checkbox-list',
  templateUrl: './custom-checkbox-list.component.html',
})
export class CustomCheckboxListComponent implements OnInit, OnChanges {
  @Input() title = 'list-title';
  @Input() automationId = 'list-title';
  @Input() options = Array<any>();
  @Input() selectedValues = [];
  @Input() savedValues = [];
  @Output() toggle = new EventEmitter<any[]>();
  @Output() resetFilters = new EventEmitter<any[]>();
  @Output() showLoader = new EventEmitter<any>();
  @Input() heightClass = '';
  @Input() selectAll = false;
  @Input() selected = false;
  @Input() selectAllId = 'select-all';
  @Input() resetControl = false;
  @Input() isFilterForDate = false;
  @Input() resetTextbox = false;
  @Input() selectedValueKey = 'name';

  titleForId = 'list-title';
  showIcon = false;
  hideSelectAll = false;
  datezoneFormat;

  datezoneFormatMoment = '';

  arrValues = [];
  filtersCountArr = [];
  isVisible = false;
  @ViewChild('tooltipContainer', { static: true })
  tooltipRef: ElementRef;

  @ViewChild('searchbox', { static: true })
  private searchboxRef: ElementRef;
  @ViewChild('optionsList', { static: true })
  private optionsListRef: ElementRef;
  @ViewChild('optionsList1', { static: true })
  private optionsListRef1: ElementRef;

  searched = false;
  source: any;
  searchTxt = '';
  constructor(  private account: AccountService,
                protected notification: NotificationServiceService) { }
  ngOnInit() {
    this.datezoneFormat=this.account.user.userDateFormat;
    this.datezoneFormatMoment = '';this.datezoneFormat.replace(/d/gi, "D");

    this.titleForId = this.automationId.split(' ').join('-');
    // this.titleForId = this.title.split(' ').join('-');
  }

  ngAfterViewInit(): void {
    this.source = fromEvent(this.searchboxRef.nativeElement, 'keyup');
    this.source.pipe(debounceTime(1000)).subscribe(c => {
      this.showLoader.emit(true);
      this.ShowHideItems();
      this.showLoader.emit(false);
    });
  }
  onToggle() {
    this.savedValues
    this.options

    const checkedOptions = this.options.filter(x => x.checked);
    this.filtersCountArr = this.options.filter(x => x.checked)
    this.arrValues = checkedOptions.map(x => x.code);


    let tempSearchedArr = [];
    this.options.map(x => {

      if (x.searched) {
        tempSearchedArr.push(x.code);
      }
    });

    if (this.isExist(tempSearchedArr, this.arrValues)) {
      this.selected = true;
    } else {
      this.selected = false;
    }

    // tempSearchedArr = [];

    this.selectedValues = [];
    this.toggle.emit(checkedOptions);

  }

  isExist(mainArr, checkArr) {
    return mainArr.every(i => checkArr.includes(i));
  }

  // onKeyUp() {

  //   this.ShowHideItems();

  // }

  onSelectAll() {

    if (this.selected) {

      this.options.map((obj) => {
        if (obj.searched) {
          obj.checked = true;
        }
      });
      const checkedOptions = this.options.filter(x => x.checked);
      this.filtersCountArr = this.options.filter(x => x.checked)

      this.arrValues = checkedOptions.map(x => x.code);
      this.toggle.emit(checkedOptions);
    } else {
      this.options.map((obj) => {
        if (obj.searched) {
          obj.checked = false;
        }
      });
      const checkedOptions = this.options.filter(x => x.checked);
      this.filtersCountArr = this.options.filter(x => x.checked)

      this.arrValues = checkedOptions.map(x => x.code);
      this.toggle.emit(checkedOptions);
    }

  }
  removeSelectedItems(e) {
    e.stopPropagation();
    this.options.map((obj) => { obj.checked = false; obj.searched = true; });
    this.filtersCountArr = [];
    this.selected = false;
    this.selectedValues = [];
    this.arrValues = [];
    // this.toggle.emit([]);
    this.resetFilters.emit([]);
    this.searchboxRef.nativeElement.value = '';
    this.showLoader.emit(true);
    this.ShowHideItems();
  }
  ngOnChanges() {
    for (let i = 0; i < this.savedValues.length; i++) {
      if (typeof (this.savedValues[i]) == 'number') {
        this.savedValues[i] = this.savedValues[i].toString();
      }
    }

    if (this.resetControl) {

      this.options.map(x => { x.checked = false; x.searched = true; });
      this.filtersCountArr = [];
      this.selected = false;
      this.selectedValues = [];
      this.arrValues = [];
      this.toggle.emit([]);
      this.searchboxRef.nativeElement.value = '';
      this.ShowHideItems();

    } else {


      const nullIndex = this.options.findIndex(x => x.code === null && x.name.toString().trim() === '');
      const spaceIndex = this.options.findIndex(x => x.code !== null && x.name.toString().trim() === '');

      if(nullIndex > -1 && spaceIndex > -1) {
        this.options.splice(spaceIndex, 1);
      }

      // const delIndex = this.options.findIndex(x => x.code !== null && x.name.toString().trim() === '');
      // if (delIndex > -1) {
      //   this.options.splice(delIndex, 1);
      // }
      // const delIndex2 = this.options.findIndex(x => x.name.toString().trim() === 'BLANK');
      // if (delIndex2 > -1) {
      //   this.options.splice(delIndex2, 1);
      // }


      if (this.selectedValues !== undefined && this.selectedValues.length > 0) {
        this.options.map((x => x.searched = true));
        this.selectedValues.forEach(value => {
          const element = this.options.find(x => x[this.selectedValueKey] === value);
          if (element) {
            element.checked = true;
          }
        });
        if (this.selectedValues.length === this.options.length) {
          this.selected = true;
        } else {
          this.selected = false;
        }
        this.filtersCountArr = this.options.filter(x => x.checked)


      } else {
        this.options.map((x => {
          x.searched = true;
          x.checked = false;
        }));
      }

      if (this.arrValues.length > 0) {
        this.arrValues.forEach(value => {
          const element = this.options.find(x => x.code === value);
          if (element) {
            element.checked = true;
          }
        });
      }

      if (this.searched) {
        this.ShowHideItems();
      }

    }

    if(this.resetTextbox) {

      if(this.searchboxRef.nativeElement.value.trim() !== '') {
        this.showLoader.emit(true);
        this.searchboxRef.nativeElement.value = '';
        this.ShowHideItems();
      }
    }

  }

  // searchRecords(event) {
  //
  //   if (event.keyCode === 13 && this.searchboxRef.nativeElement.value.trim() !== '') {
  //     this.searchTxt = this.searchboxRef.nativeElement.value;
  //     this.ShowHideItems();
  //   } else if(event.keyCode === 8 && this.searchboxRef.nativeElement.value == '') {
  //     this.searchTxt = '';
  //     this.ShowHideItems();
  //   }
  // }

  ShowHideItems() {
    // this.showLoader.emit(true);
    // // this.showLoader();
    const searchboxValue = this.searchboxRef.nativeElement.value;
    if (searchboxValue.trim() === '') {
      if (this.searched) {
        this.searchTxt = searchboxValue;
        this.options.forEach(o => {
          o.searched = true;
        });
        // const li = this.optionsListRef.nativeElement.getElementsByTagName('li');
        // for (let i = 0; i < li.length; i++) {

        //   const innerStr = this.simpleString(li[i].lastElementChild.lastElementChild.innerHTML);
        //   li[i].lastElementChild.lastElementChild.innerHTML = innerStr;
        //   this.options[i]['searched'] = true;
        // }
        this.searched = false;
      }
      this.hideSelectAll = false;


      let tempSearchedArr = [];
      this.options.map(x => {

        if (x.searched) {
          tempSearchedArr.push(x.code);
        }
      });

      if (this.isExist(tempSearchedArr, this.arrValues)) {
        this.selected = true;
      } else {
        this.selected = false;
      }
      // // this.hideLoader();
      // this.showLoader.emit(false);
      return;
    }

    this.searched = true;
    if(this.isFilterForDate) {
      this.options.forEach(o => {
        if((o.date === null ? 'Blank':
            moment(o.date).format(this.datezoneFormatMoment).toString())
            .toLowerCase().indexOf(searchboxValue.toLowerCase()) > -1) {
          o.searched = true;
        } else {
          o.searched = false;
        }
      });
    } else {
      this.options.forEach(o => {
        if(o.name.toLowerCase().indexOf(searchboxValue.toLowerCase()) > -1){
          o.searched = true;
        } else {
          o.searched = false;
        }
      });
    }
    this.searchTxt = searchboxValue;
    // const li = this.optionsListRef.nativeElement.getElementsByTagName('li');

    // for (let i = 0; i < li.length; i++) {

    //   const comparisonStr = this.simpleString(li[i].lastElementChild.lastElementChild.innerHTML);
    //   if (comparisonStr.toLowerCase().indexOf(searchboxValue.toLowerCase()) > -1) {
    //     li[i].lastElementChild.lastElementChild.innerHTML = this.boldString(li[i].lastElementChild.lastElementChild
    //       , searchboxValue);
    //     this.options[i]['searched'] = true;
    //   } else {

    //     this.options[i]['searched'] = false;

    //   }
    // }

    if (this.options.findIndex(x => x.searched === true) === -1) {
      this.hideSelectAll = true;
    } else {
      this.hideSelectAll = false;
    }


    let tempSearchedArr = [];
    this.options.map(x => {

      if (x.searched) {
        tempSearchedArr.push(x.code);
      }
    });

    if (this.isExist(tempSearchedArr, this.arrValues)) {
      this.selected = true;
    } else {
      this.selected = false;
    }

    // // this.hideLoader();
    // this.showLoader.emit(false);

  }

  private boldString(elem, find) {

    const regex = new RegExp(find, 'gi');
    const response = elem.innerText.replace(regex, str => `<b>${str}</b>`);
    return response;
  }

  private simpleString(str) {
    const re = new RegExp('<b>|</b>', 'gi');
    return str.replace(re, '');
  }

  clearSearch() {
    this.searchboxRef.nativeElement.value = '';
    if (this.searched) {
      this.showLoader.emit(true);
      this.ShowHideItems();
      this.resetTextbox = false;
      this.showLoader.emit(false);
    }
  }
  searchSavedValues(item) {
    let name;
    if (item.code == null) {
      name = item.name.trim().toUpperCase();
    }
    else {
      name = item.code;
    }
    return this.savedValues.includes(name) ? 'order-1' : 'order-3';
  }

  // ngOnDestroy() {
  //   this.source.unsubscribe();
  // }

  // showLoader() {
  //   this.notification.loading = true;
  // }

  // hideLoader() {
  //   this.notification.loading = false;
  // }

  replaceDot(item) {

    let str = (item.name || '').replaceAll('.','-');
    return str;
  }

}
