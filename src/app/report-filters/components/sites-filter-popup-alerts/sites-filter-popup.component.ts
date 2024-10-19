import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SiteTypeID } from 'src/app/shared/helper/Enums';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
@Component({
  selector: 'app-sites-filter-popup-alert',
  templateUrl: './sites-filter-popup.component.html',
  styleUrls: ['./sites-filter-popup.component.scss']
})
export class SitesFilterPopupAlertComponent implements OnInit {

  @Input() automationId = 'list-title';
  @Input() selectedValues = [];
  @Input() lstCollectionSitesTree = [];

  @Output() onClose = new EventEmitter<any>();
  @Output() onApply = new EventEmitter<Array<any>>();
  @Output() onClear = new EventEmitter<Array<any>>();
  @Input() resetControl = false;
  values: any = [];

  siteTypeID = SiteTypeID;
  trackSelectedValues= null;
  datezoneFormat;
  datezoneFormatMoment = '';
  titleForId = 'list-title';

  constructor(
    private account: AccountService,
    protected notification: NotificationServiceService) { }
  ngOnInit() {
    this.datezoneFormat = this.account.user.userDateFormat;
    this.datezoneFormatMoment = ''; this.datezoneFormat.replace(/d/gi, "D");
    this.titleForId = this.automationId.split(' ').join('-');
    if(this.selectedValues.length > 0){
      this.checkSelectedItems();
    }
  }

  ngOnChanges() {
    
    if(this.resetControl) {
      for (const i of this.lstCollectionSitesTree) {
        i.item.selected = false;
        this.unmarkParentRecursively(i);
      }
      this.values = [];
      this.trackSelectedValues = null;
      this.selectedValues = [];
      this.onApply.emit(this.values);
    } else {
      if(this.trackSelectedValues){
        this.selectedValues = this.trackSelectedValues;
      }
      this.checkSelectedItems();
      for (const i of this.lstCollectionSitesTree) {
        this.markParentRecursively(i);
      }
    }
  }
  getPaddingLeftByLevel(level) {
    return level === 1 ?  0 : 10 * (level);
  }

  getWidthByLevel(level) {
    return level === 1 ?  167 : (167 - 10 * (level));
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
        if(!state) {
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
    // for (const i of this.lstCollectionSitesTree) {
    //   this.markDisabledParentRecursively(i);
    // }
  }

  markDisabledParentRecursively(item) {
    if(item.children.length === 0) {
      return;
    } else {
      for (const i of item.children) {
        if(i.children.length > 0) {
          this.markDisabledParentRecursively(i);
        }
        if(i.item.disabled) {
          i.item.selected = false;
        }
      }
    }
  }

  markChildrenRecursively(children: Array<any>, state: any) {
    if (children.length === 0 || children === null) {
      return state;
    } else {
      for (const i of children) {
        i.item.selected = state;
        this.markChildrenRecursively(i.children, state);
      }
    }
  }

  traverseTree(getIDs = false) {
    if(getIDs) {
      for (const i of this.lstCollectionSitesTree) {
        if(i.children.length > 0) {
          this.getMarkedNodesForPrintingRecursively(i);
        }
        if(i.item.selected && !i.item.disabled && !i.item.toBeDeleted){
          this.values.push(i.item.siteId);
        }
      }
    } else {
      for (const i of this.lstCollectionSitesTree) {
        this.markParentRecursively(i);
      }
    }
  }

  getMarkedNodesForPrintingRecursively(item) {
    if(item.children.length === 0) {
      return;
    } else {
      for (const i of item.children) {
        if(i.item.selected && !i.item.disabled && !i.item.toBeDeleted) {
          this.values.push(i.item.siteId);
        }
        if(i.children.length > 0) {
          this.getMarkedNodesForPrintingRecursively(i);
        }
      }
    }
  }

  markParentRecursively(item) {
    let allChildrenSelected: boolean = true;
    if(item.children.length === 0) {
      return;
    } else {
      for (const i of item.children) {
        if(i.children.length > 0) {
          this.markParentRecursively(i);
          if(!i.item.selected) {
            allChildrenSelected = false;
          }
        } else {
          if(!i.item.selected) {
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
    this.onClear.emit(this.values);
  }
  resetControlByParent() {
    for (const i of this.lstCollectionSitesTree) {
      i.item.selected = false;
      this.unmarkParentRecursively(i);
    }
    this.values = [];
    this.onApply.emit(this.values);
  }

  unmarkParentRecursively(item) {
    if(item.children.length === 0) {
      return;
    } else {
      for (const i of item.children) {
        i.item.selected = false;
        if(i.children.length > 0) {
          this.unmarkParentRecursively(i);
        }
      }
    }
  }

  emitList(){

    this.values = [];
    this.traverseTree(true);
    // if (this.values.length == 0) {
    //   return;
    // }
    this.trackSelectedValues = this.values;
    this.onApply.emit(this.values);
  }

  checkSelectedItems(){
    for (const i of this.lstCollectionSitesTree) {
      if(this.selectedValues.includes(i.item.siteId)){
        i.item.selected = true;
        this.values.push(i.item.siteId);
      }
      else{
        i.item.selected = false;
      }
      this.markSelectedValuesRecursively(i);
    }
  }

  markSelectedValuesRecursively(item) {
    if(item.children.length === 0) {
      return;
    } else {
      for (const i of item.children) {
        if(this.selectedValues.includes(i.item.siteId)){
          i.item.selected = true;
          this.values.push(i.item.siteId);
        }
        if(i.children.length > 0) {
          this.markSelectedValuesRecursively(i);
        }
      }
    }
  }
}
