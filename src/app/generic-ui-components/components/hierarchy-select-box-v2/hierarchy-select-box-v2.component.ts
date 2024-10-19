import { Component, Input, OnInit, TemplateRef, ContentChild, Output, EventEmitter, forwardRef, ViewChild, ElementRef, HostListener, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Observable, Subscription } from "rxjs";
import { debounceTime } from 'rxjs/operators';
import { SiteTypeID } from 'src/app/shared/helper/Enums';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';

@Component({
  selector: 'app-hierarchy-select-box-v2',
  templateUrl: './hierarchy-select-box-v2.component.html',
  styleUrls: ['./hierarchy-select-box-v2.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HierarchySelectBoxV2Component),
      multi: true
    }
  ]
})
export class HierarchySelectBoxV2Component implements OnInit {

  @Input() id = 'input-id';
  @Input('placeholder') placeholderKey = 'placeholde-key';
  @Input() translate = true;
  @Input() mandatory = false;

  @ContentChild(TemplateRef, { static: true })
  layoutTemplate: TemplateRef<any>;
  @Input() displayError = false;

  @Input() itemsList = [];
  @Input() bindValue = 'code';
  @Input() bindLabel = 'name';
  @Input() selectionKey = 'siteType'
  @Input() selectionValue: any;
  @Input() multiple = false;
  @ViewChild('input', { static: true })
  inputRef: ElementRef;
  @ViewChild('errorText', { static: true })
  errorTextRef: ElementRef;

  errorVisible = false;

  showList = false;

  selectedList: any = [];

  @Input() tagLimit;
  @Input() clearable = false;
  separatorKey = '';
  pluralKey = '';
  disabled = false;
  @Input() displayValue = true;
  @Input() valueSearched = false;
  constructor() { }

  onChange: any = () => { }
  onTouch: any = () => { }
  inputVal = "";

  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription

  @ViewChild('searchbox', { static: true })
  private searchboxRef: ElementRef;
  source: any;
  @Output() onLoader = new EventEmitter<any>();
  selectCount = -1;
  searchCount = 0;
  siteTypeID = SiteTypeID;
  searchTxt: any;

  isSelectionValueExist = false;
  controlValue = null;

  ngAfterViewInit(): void {
    this.setErrorContainerWidth();
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {

      this.setErrorContainerWidth();
    })
    this.source = fromEvent(this.searchboxRef.nativeElement, 'keyup');
    this.source.pipe(debounceTime(1000)).subscribe(c => {
      this.onLoader.emit(true);
      this.ShowHideItems();
      this.onLoader.emit(false);
    });
  }

  ngOnInit() {
    // this.setErrorContainerWidth(true);
    // this.markAllTreeSearched();
  }

  writeValue(value: any) {

    if (value && value !== '') {

      let arr = [];
      if(this.multiple) {
        arr = value.split(',');
      } else {
        arr.push(value);
      }

      this.selectedList = [];
      this.traverseTree(arr);
      // this.isSelectionValueExist = false;
      // this.markAllTreeSearched();
      // if (!this.isSelectionValueExist) {
      //   this.itemsList = [];
      //   this.selectedList = [];
      //   this.onChange(null);
      //   this.onTouch();
      // }
      if (this.selectedList.length > 0) {
        this.controlValue = this.selectedList[0][this.bindValue];
        this.onChange(this.controlValue);
        this.onTouch();
        if(this.valueSearched) {
          this.searchboxRef.nativeElement.value = this.selectedList[0][this.bindLabel];
          this.onLoader.emit(true);
          this.ShowHideItems();
          this.onLoader.emit(false);
          this.valueSearched = false;
        }
      } else {
        this.controlValue = '';
        this.onChange(this.controlValue);
        this.onTouch();
      }



    } else {
      this.selectedList = [];
      this.inputVal = value;
      this.showList = false;

    }

  }



  traverseTree(arr) {

    for (const i of this.itemsList) {

      if (i.children.length > 0) {

        this.selectNodesRecursively(i, arr);

      }

      if (arr.includes(i.item[this.bindValue])) {

        this.selectedList.push(i.item);

      }

    }

  }



  selectNodesRecursively(item, arr) {

    if (item.children.length === 0) {

      return;

    } else {

      for (const i of item.children) {

        if (arr.includes(i.item[this.bindValue])) {

          this.selectedList.push(i.item);

        }

        if (i.children.length > 0) {

          this.selectNodesRecursively(i, arr);

        }

      }

    }

  }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn
  }

  setErrorState(state: boolean) {
    this.displayError = state ? state : false;
    // this.toggled.emit(this.displayError);
  }

  setErrorVisible() {
    this.errorVisible = true;
    let elem = document.getElementById(`${this.id}-error-container`);
    if (elem) {
      elem.classList.add('z-i-10');
    }
  }
  setErrorHidden() {
    this.errorVisible = false;
    let elem = document.getElementById(`${this.id}-error-container`);
    if (elem) {
      elem.classList.remove('z-i-10');
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {

    this.setErrorContainerWidth();
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.isSelectionValueExist = false;
    this.markAllTreeSearched();
    if (!this.isSelectionValueExist) {
      this.itemsList = [];
      this.selectedList = [];
      if (this.controlValue && this.controlValue != '') {
        this.onChange(null);
        this.onTouch();
      }
    }

    this.setErrorContainerWidth();
  }

  setErrorContainerWidth(first = false) {

    if (this.inputRef.nativeElement) {
      let width = this.inputRef.nativeElement.clientWidth;
      if (window.outerWidth === window.innerWidth && !first) {
        width = width > 0 ? width - 32 : width;
      } else {
        width = width > 0 ? width - 16 : width;
      }
      if (this.errorTextRef.nativeElement) {
        this.errorTextRef.nativeElement.setAttribute('style', `width:${width}px`);
      }
    }
  }

  ngOnDestroy() {
    // if (this.source) {
    //   this.source.unsubscribe();
    // }
    if (this.resizeSubscription$) {
      this.resizeSubscription$.unsubscribe()
    }
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

  }

  getPaddingLeftByLevel(level) {
    return level === 1 ? 8 : 10 * (level) + 8;
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

  markAllTreeSearched() {
    for (const i of this.itemsList) {
      i.item.searched = true;
      if (this.selectionValue.length) {
        if (!this.isSelectionValueExist) {
          this.isSelectionValueExist = this.selectionValue.includes(i.item[this.selectionKey])
        }
      } else {
        if (!this.isSelectionValueExist) {
          this.isSelectionValueExist = this.selectionValue === i.item[this.selectionKey];
        }
      }
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
      if (this.selectionValue.length) {
        if (!this.isSelectionValueExist) {
          this.isSelectionValueExist = this.selectionValue.includes(item.item[this.selectionKey])
        }
      } else {
        if (!this.isSelectionValueExist) {
          this.isSelectionValueExist = this.selectionValue === item.item[this.selectionKey];
        }
      }
      return;
    } else {
      if (item.children) {
        for (const i of item.children) {
          i.item.searched = true;
          if (this.selectionValue.length) {
            if (!this.isSelectionValueExist) {
              this.isSelectionValueExist = this.selectionValue.includes(i.item[this.selectionKey])
            }
          } else {
            if (!this.isSelectionValueExist) {
              this.isSelectionValueExist = this.selectionValue === i.item[this.selectionKey];
            }
          }
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

    for (const i of this.itemsList) {

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

  selectNode(item) {
    if(this.disabled) {
      return;
    }
    if (Array.isArray(this.selectionValue)) {
      if (this.selectionValue.includes(item[this.selectionKey])) {
        this.addItemToSelectedList(item);
        if (!this.multiple) {
          this.showList = false;
        }
      }
    } else {
      if (this.selectionValue == item[this.selectionKey]) {
        this.addItemToSelectedList(item);
        if (!this.multiple) {
          this.showList = false;
        }
      }
    }

  }

  addItemToSelectedList(item) {
    if (this.multiple) {
      if (!this.selectedList.find(x => x[this.bindValue] === item[this.bindValue])) {
        this.selectedList.push(item);
        this.onChange(this.selectedList.map(x => x[this.bindValue]));
        this.onTouch();
      }
    } else {
      this.selectedList = [];
      this.selectedList.push(item);
      this.onChange(this.selectedList[0][this.bindValue]);
      this.onTouch();
    }
  }

  identity(index, item) {
    return item[this.bindValue];
  }

  clearItem(item) {
    if(this.disabled) {
      return;
    }
    let index = this.selectedList.findIndex(x => x[this.bindValue] === item[this.bindValue])
    if (index > -1) {
      this.selectedList.splice(index, 1);
      this.onChange(null);
      this.onTouch();
    }
  }

  getHoverClass(item) {
    if (Array.isArray(this.selectionValue)) {
      if (this.selectionValue.includes(item[this.selectionKey])) {
        return 'selectable';
      }
    } else {
      if (this.selectionValue == item[this.selectionKey]) {
        return 'selectable';
      }
    }
  }

  setDisabledState(isDisabled: boolean) {

    this.disabled = isDisabled;
    if(this.disabled && !this.displayValue) {
      this.selectedList = [];
      this.inputVal = '';
      this.showList = false;
    }
  }

  openHierarchyBox() {
    // if(this.disabled) {
    //   this.showList = false;
    // } else {
      this.showList = !this.showList;
    // }
  }

}
