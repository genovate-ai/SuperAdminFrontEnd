import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SiteTypeID } from 'src/app/shared/helper/Enums';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
@Component({
  selector: 'app-sites-filter-popup',
  templateUrl: './sites-filter-popup.component.html',
  styleUrls: ['./sites-filter-popup.component.scss']
})
export class SitesFilterPopupComponent implements OnInit {

  @Input() automationId = 'list-title';
  @Input() selectedValues = [];
  @Input() lstCollectionSitesTree = [];

  @Output() onClose = new EventEmitter<any>();
  @Output() onApply = new EventEmitter<Array<any>>();
  @Output() onClear = new EventEmitter<Array<any>>();
  @Output() onLoader = new EventEmitter<any>();
  @Input() resetControl = false;
  @Input() prefix = 'hierarchy';

  values: any = [];

  siteTypeID = SiteTypeID;
  trackSelectedValues = null;
  datezoneFormat;
  datezoneFormatMoment = '';
  titleForId = 'list-title';

  @ViewChild('searchbox', { static: true })
  private searchboxRef: ElementRef;
  source: any;
  wildcardActive: any;
  searchTxt: any;
  selectedAll = false;

  checkedCount = 0;
  selectCount = -1;
  searchCount = 0;
  @Input() resultValueKey = 'siteUniqueNumber';
  constructor(
    private account: AccountService,
    protected notification: NotificationServiceService) { }
  ngOnInit() {
    this.datezoneFormat = this.account.user.userDateFormat;
    this.datezoneFormatMoment = ''; this.datezoneFormat.replace(/d/gi, "D");
    this.titleForId = this.automationId.split(' ').join('-');

    if (this.selectedValues.length > 0) {
      this.checkSelectedItems();
    }
  }
  ngAfterViewInit(): void {
    this.source = fromEvent(this.searchboxRef.nativeElement, 'keyup');
    this.source.pipe(debounceTime(1000)).subscribe(c => {
      this.onLoader.emit(true);
      this.ShowHideItems();
      this.onLoader.emit(false);
    });
  }

  ShowHideItems() {
    let searchboxValue = this.searchboxRef.nativeElement.value;
    searchboxValue = searchboxValue.replace(/[^\x00-\x7F]/g, "");
    this.searchTxt = searchboxValue;
    if (searchboxValue.trim() === '') {
      this.markAllTreeSearched();
    } else {
      this.markItemSearched(searchboxValue);
    }
    for (const i of this.lstCollectionSitesTree) {
      this.markParentRecursively(i);
    }
    this.checkSelectAll();
  }

  ngOnChanges() {

    if (this.resetControl) {
      this.markAllTreeSearched();
      for (const i of this.lstCollectionSitesTree) {
        i.item.selected = false;
        this.unmarkParentRecursively(i);
      }
      // this.lstCollectionSitesTree = [];
      this.values = [];
      this.trackSelectedValues = null;
      this.selectedValues = [];
      this.searchboxRef.nativeElement.value = '';
      this.searchTxt = '';
      this.selectCount = -1;
      this.searchCount = 0;
      this.checkedCount = 0;
      this.ShowHideItems();
      this.onApply.emit(this.values);
    } else {
      if (this.trackSelectedValues) {
        this.selectedValues = this.trackSelectedValues;
      }
      this.markAllTreeSearched();
      this.checkSelectedItems();
      for (const i of this.lstCollectionSitesTree) {
        this.markParentRecursively(i);
      }
    }

    if (this.searchboxRef.nativeElement.value.trim() !== '') {
      this.onLoader.emit(true);
      this.ShowHideItems();
      this.onLoader.emit(false);
    } else {
      this.checkSelectAll();
    }
  }
  getPaddingLeftByLevel(level) {
    return level === 1 ? 0 : 10 * (level);
  }

  getWidthByLevel(level) {
    return level === 1 ? 200 : (200 - 10 * (level));
  }

  expandChildren(item) {
    item.item.expandChildren = !item.item.expandChildren;
    this.showHideChildren(item.children, item.item.expandChildren);
  }

  showHideChildren(children: Array<any>, state: any) {
    if (children.length === 0 || children === null) {
      return;
    } else {
      for (const i of children) {
        i.item.visibleState = state;
        if (!state) {
          i.item.expandChildren = state;
          this.showHideChildren(i.children, state);
        }
      }
    }
  }

  onItemCheckd(event, item) {

    // this.displayErrorSite = false;
    item.item.selected = event.target.checked;
    this.markChildrenRecursively(item.children, event.target.checked);
    this.traverseTree();

    this.checkSelectAll();
    // for (const i of this.lstCollectionSitesTree) {
    //   this.markDisabledParentRecursively(i);
    // }
  }

  // markDisabledParentRecursively(item) {
  //   if (item.children.length === 0) {
  //     return;
  //   } else {
  //     for (const i of item.children) {
  //       if (i.children.length > 0) {
  //         this.markDisabledParentRecursively(i);
  //       }
  //       if (i.item.disabled) {
  //         i.item.selected = false;
  //       }
  //     }
  //   }
  // }

  markChildrenRecursively(children: Array<any>, state: any) {
    if (children.length === 0 || children === null) {
      return state;
    } else {
      for (const i of children) {
        if (!i.item.disabled && i.item.searched) {
          i.item.selected = state;
          this.markChildrenRecursively(i.children, state);
        }

      }
    }
  }

  traverseTree(getIDs = false) {
    if (getIDs) {
      for (const i of this.lstCollectionSitesTree) {
        if (i.children.length > 0) {
          this.getMarkedNodesForPrintingRecursively(i);
        }
        if (i.item.selected && !i.item.disabled && i.item.searched) {

          this.values.push(i.item[this.resultValueKey]);
        }
      }
    } else {
      for (const i of this.lstCollectionSitesTree) {
        this.markParentRecursively(i);
      }
    }
  }

  getMarkedNodesForPrintingRecursively(item) {
    if (item.children.length === 0) {
      return;
    } else {
      for (const i of item.children) {
        if (i.item.selected && !i.item.disabled && i.item.searched) {
          this.values.push(i.item[this.resultValueKey]);
        }
        if (i.children.length > 0) {
          this.getMarkedNodesForPrintingRecursively(i);
        }
      }
    }
  }

  markParentRecursively(item) {
    let allChildrenSelected: boolean = true;
    if (item.children.length === 0) {
      return;
    } else {
      for (const i of item.children) {
        if (i.children.length > 0) {
          this.markParentRecursively(i);
          if (!i.item.selected) {
            allChildrenSelected = false;
          }
        } else {
          if (!i.item.selected) {
            allChildrenSelected = false;
          }
        }
      }
    }
    // if(item.item.siteTypeId != 14 && item.item.siteTypeId != 10 && item.item.siteTypeId != 21){
    item.item.selected = allChildrenSelected;
    // }
  }





  clearList() {

    for (const i of this.lstCollectionSitesTree) {
      i.item.selected = false;
      this.unmarkParentRecursively(i);
    }
    this.values = [];
    this.trackSelectedValues = this.values;
    this.searchboxRef.nativeElement.value = '';
    this.searchTxt = '';
    this.onClear.emit(this.values);
  }
  // resetControlByParent() {
  //   for (const i of this.lstCollectionSitesTree) {
  //     i.item.selected = false;
  //     this.unmarkParentRecursively(i);
  //   }
  //   this.values = [];
  //   this.onApply.emit(this.values);
  // }

  unmarkParentRecursively(item) {
    if (item.children.length === 0) {
      return;
    } else {
      for (const i of item.children) {
        i.item.selected = false;
        if (i.children.length > 0) {
          this.unmarkParentRecursively(i);
        }
      }
    }
  }

  emitList() {

    this.values = [];
    this.traverseTree(true);
    if (this.values.length == 0) {
      return;
    }
    this.trackSelectedValues = this.values;
    this.onApply.emit(this.values);
  }

  checkSelectedItems() {
    for (const i of this.lstCollectionSitesTree) {
      if (this.selectedValues.includes(i.item[this.resultValueKey])) {
        i.item.selected = true;
        this.values.push(i.item[this.resultValueKey]);
      }
      this.markSelectedValuesRecursively(i);
    }
  }

  markSelectedValuesRecursively(item) {
    if (item.children.length === 0) {
      return;
    } else {
      for (const i of item.children) {
        if (this.selectedValues.includes(i.item[this.resultValueKey])) {
          i.item.selected = true;
          this.values.push(i.item[this.resultValueKey]);
        }
        if (i.children.length > 0) {
          this.markSelectedValuesRecursively(i);
        }
      }
    }
  }

  markAllTreeSearched() {
    for (const i of this.lstCollectionSitesTree) {
      i.item.searched = true;
      this.markAllTreeSearchedRecursively(i);
    }
  }
  markAllTreeSearchedRecursively(item, expandChildren = false) {
    if (item.children && item.children.length === 0) {
      item.item.searched = true;
      if (expandChildren) {
        item.item.expandChildren = true;
        this.showHideChildren(item.children, item.item.expandChildren);
      }
      return;
    } else {
      if (item.children) {
        for (const i of item.children) {
          i.item.searched = true;
          if (expandChildren) {
            item.item.expandChildren = true;
            this.showHideChildren(item.children, item.item.expandChildren);
          }
          this.markAllTreeSearchedRecursively(i);
        }
      }

    }
  }
  markItemSearched(searchboxValue) {

    for (const i of this.lstCollectionSitesTree) {

      if (i.item.siteName.toLowerCase().indexOf(searchboxValue.toLowerCase()) > -1) {
        i.item.searched = true;
        i.item.expandChildren = true;
        this.showHideChildren(i.children, i.item.expandChildren);
        this.markAllTreeSearchedRecursively(i, true);
      } else {
        i.item.searched = this.markItemSearchedRecursively2(i, searchboxValue);
        if (i.item.searched) {
          i.item.expandChildren = true;
          this.showHideChildren(i.children, i.item.expandChildren);
        }
      }

    }
  }
  // markItemSearchedRecursively(item, searchboxValue) {
  //
  //   if (item.children && item.children.length == 0) {
  //     return false;
  //   } else {
  //     for (const i of item.children) {
  //       if (i.item.siteName.toLowerCase().indexOf(searchboxValue.toLowerCase()) > -1) {
  //         i.item.searched = true;
  //         this.markAllTreeSearchedRecursively(i);
  //       } else {
  //         i.item.searched = this.markItemSearchedRecursively(i, searchboxValue);
  //       }

  //     }
  //   }
  //   return false;
  // }
  markItemSearchedRecursively2(item, searchboxValue) {

    let parentRemain = false;
    if (item.children && item.children.length == 0) {
      if (item.item.siteName.toLowerCase().indexOf(searchboxValue.toLowerCase()) > -1) {
        item.item.searched = true;
        item.item.expandChildren = true;
        this.showHideChildren(item.children, item.item.expandChildren);
      } else {
        item.item.searched = false;
      }
      return item.item.searched;
    } else {
      for (const i of item.children) {
        if (i.item.siteName.toLowerCase().indexOf(searchboxValue.toLowerCase()) > -1) {
          i.item.searched = true;
          i.item.expandChildren = true;
          this.showHideChildren(i.children, i.item.expandChildren);
          this.markAllTreeSearchedRecursively(i, true);
          parentRemain = true;

        } else {
          let result = this.markItemSearchedRecursively2(i, searchboxValue);
          i.item.searched = result;
          parentRemain = parentRemain ? parentRemain : result;
          if (result) {
            item.item.expandChildren = true;
            this.showHideChildren(item.children, item.item.expandChildren);
          }
        }

      }
    }


    item.item.searched = parentRemain;
    if (item.item.searched) {
      item.item.expandChildren = true;
      this.showHideChildren(item.children, item.item.expandChildren);
    }
    return parentRemain;
  }

  onSelectAll() {

    if (this.selectedAll) {
      for (const i of this.lstCollectionSitesTree) {
        if (!i.item.disabled && i.item.searched) {
          i.item.selected = true;
          this.markChildrenRecursively(i.children, true);
        }
      }
      this.traverseTree();
      // this.checkSelectAll();
    } else {
      for (const i of this.lstCollectionSitesTree) {
        if (!i.item.disabled && i.item.searched) {
          i.item.selected = false;
          this.unmarkParentRecursively(i);
        }
      }
      // this.checkSelectAll();
    }
  }

  checkSelectAll() {

    this.checkedCount = 0;
    this.selectCount = 0;
    this.searchCount = 0;
    for (const i of this.lstCollectionSitesTree) {
      if (!i.item.disabled && i.item.searched) {
        this.selectCount = this.selectCount + 1;
      }
      if (!i.item.disabled && i.item.selected && i.item.searched) {
        this.searchCount = this.searchCount + 1;
      }
      if (!i.item.disabled && i.item.selected) {
        this.checkedCount = this.checkedCount + 1;
      }
      this.traverseTreeSelectAll(i);
    }
    this.selectedAll = this.searchCount === this.selectCount;
  }

  traverseTreeSelectAll(item) {
    if (item.children.length == 0) {
      return;
    } else {
      for (const i of item.children) {
        if (!i.item.disabled && i.item.searched) {
          this.selectCount = this.selectCount + 1;
        }
        if (!i.item.disabled && i.item.selected && i.item.searched) {
          this.searchCount = this.searchCount + 1;
        }
        if (!i.item.disabled && i.item.selected) {
          this.checkedCount = this.checkedCount + 1;
        }
        this.traverseTreeSelectAll(i);
      }
    }
  }

}
