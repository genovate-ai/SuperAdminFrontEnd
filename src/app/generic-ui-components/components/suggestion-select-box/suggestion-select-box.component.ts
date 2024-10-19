import { Component, Input, OnInit, TemplateRef, ContentChild, Output, EventEmitter, forwardRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Observable, Subscription } from "rxjs";
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';

@Component({
  selector: 'app-suggestion-select-box',
  templateUrl: './suggestion-select-box.component.html',
  styleUrls: ['./suggestion-select-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SuggestionSelectBoxComponent),
      multi: true
    }
  ]
})
export class SuggestionSelectBoxComponent implements OnInit {

  @Input() id = 'input-id';
  @Input('placeholder') placeholderKey = 'placeholde-key';
  @Input() translate = true;
  @Input() mandatory = false;
  @Input() numeric = true;
  @ContentChild(TemplateRef, { static: true })
  layoutTemplate: TemplateRef<any>;
  @Input() displayError = false;
  @Input() enableAddItem = true;
  @Input() checkDisabled = false;
  // @Output() toggled: EventEmitter<boolean> = new EventEmitter();

  @Input() itemsList = [];
  @Input() bindValue = 'code';
  @Input() bindLabel = 'name';
  @Output() addItem = new EventEmitter<any>();
  @Output() selectedItem = new EventEmitter<any>();

  @ViewChild('input', { static: true })
  inputRef: ElementRef;
  @ViewChild('errorText', { static: true })
  errorTextRef: ElementRef;

  errorVisible = false
  // enableTransition = false;

  // searchKeyword = '';
  showList = false;
  multiple = false;
  displayLimit = false;
  showAddNew = false;
  lstFiltered = [];
  selectedValue;
  selectedObj = null

  constructor() { }

  onChange: any = () => { }
  onTouch: any = () => { }
  inputVal = "";

  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription

  ngAfterViewInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {

      this.setErrorContainerWidth();
    })
  }

  ngOnInit() {
    this.setErrorContainerWidth(true);
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

  writeValue(value: any) {

    if (value && value !== '') {
      let obj = this.itemsList.find(x => x.id === value);

      if (obj) {
        this.selectedObj = obj;
        this.inputVal = obj[this.bindLabel];
        this.selectedValue = obj[this.bindValue];
        this.showList = false;
        this.filterList();
        this.onChange(this.selectedValue);
        this.onTouch();

      } else {
        this.inputVal = value || '';
        if (this.selectedValue) {
          this.selectedValue = null;
          this.onChange(this.selectedValue);
          this.onTouch();
        }
      }
    } else {
      this.inputVal = value || '';
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn
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
    if (this.resizeSubscription$) {
      this.resizeSubscription$.unsubscribe()
    }
  }

  ngOnChanges() {
    // this.domEles = document.querySelectorAll("#" + this.id + " > *");
    this.setErrorContainerWidth();
    this.filterList()
    // this.search(this.inputVal, true);
  }
  search(keyword, hideList = false) {

    // this.searchKeyword = keyword || '';
    let c = this.inputVal;



    // if (keyword.length == 0) {
    //   this.showList = false;
    //   // this.showAddNew = false;
    //   // document.querySelectorAll(".drop-list").forEach((i) => {
    //   //   i.classList.remove("d-block");
    //   // });
    // }

    this.filterList();
    if (hideList) {
      this.showList = false;
    } else {
      this.showList = this.lstFiltered.length > 0;
    }

    if (this.lstFiltered.length > 0) {
      let obj = this.lstFiltered.find(x => x[this.bindLabel] === this.inputVal && this.selectedValue && x[this.bindValue] === this.selectedObj[this.bindValue])
      if (!obj) {
        this.selectedValue = null;
        this.onChange(this.selectedValue);
      }
    } else {
      if (this.selectedValue) {
        this.selectedValue = null;
        this.onChange(this.selectedValue);
      }
    }
    // var tmp = this.itemsList.filter((x) => x[this.bindLabel].toString().toLowerCase() == (this.inputVal.toString().toLowerCase()));

    // if(tmp.length > 0)
    // {
    //   this.setErrorState(false)
    //   this.selectItem(tmp[0])

    // }else{
    //   this.setErrorState(true)
    //   this.onChange(null);
    //   this.onTouch();

    // }
    // if (this.existingItem.length > 0) {
    //   this.showAddNew = false;
    //   this.selectedItem.emit(this.existingItem[0]);
    //   this.showTags = false;
    // } else {
    //   this.selectedItem.emit(null);
    // }
  }

  getFilteredList() {

    // this.selectedIndex = -1;
    // document.querySelectorAll(".drop-list > *").forEach((i) => {
    //   i.classList.remove("move");
    // });

    // document.querySelectorAll(".drop-list").forEach((i) => {
    //   i.classList.remove("d-block");
    // });

    // var id = document.querySelector("." + this.id);
    // // if (this.lstFiltered.length > 0) {
    // id.classList.add("d-block");
    // // }

    // setTimeout(() => {
    //   this.panel.nativeElement.scrollTop = 0;
    // }, 10);
    // if (this.showList) {
    //   document.querySelectorAll(".drop-list").forEach((i) => {
    //     i.classList.remove("d-block");
    //   });
    // }
    this.showList = !this.showList;
    this.filterList();

  }

  filterList() {
    this.lstFiltered = [];
    this.lstFiltered = this.itemsList.filter((x) => x[this.bindLabel].toString().toLowerCase().includes(this.inputVal.toString().toLowerCase()));
    if (!(this.itemsList.find(x => x[this.bindLabel].toString().toLowerCase() === this.inputVal.toString().toLowerCase()))) {
      this.showAddNew = true;
    } else {
      this.showAddNew = false
    }

  }

  selectItem(item) {
    this.showList = false;
    this.selectedObj = item;
    this.inputVal = item[this.bindLabel];
    this.selectedValue = item[this.bindValue];
    this.onChange(item[this.bindValue]);
    this.setErrorState(false);
    this.onTouch();
    this.showAddNew = false;
  }

  addNewItem() {
    this.showList = false;
    this.showAddNew= false;
    this.addItem.emit(this.inputVal);
  }

  identity(index, item) {
    return item[this.bindValue];
  }

  focusOut() {
    if (!this.selectedValue) {
      this.onTouch();
    }
  }

}
