import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";

@Component({
  selector: "app-search-grid",
  templateUrl: "./search-grid.component.html",
  styleUrls: ["./search-grid.component.scss"],
  host: {
    "(document:keydown)": "handleKeyboardEvents($event)",
  },
})
export class SearchGridComponent implements OnInit {
  form: UntypedFormGroup;
  @Input() filterMode = false;
  @Input() listMode = false;
  @Input() searchList = [];
  @Input() columnList = [];
  @Input() treeGridSearch = false;
  @Input() resetCondition = false;
  @Output() filteredList = new EventEmitter<any[]>();
  @Output() selectedFilters = new EventEmitter<any[]>();
  @ViewChild("myInput", { static: true }) inputEl: ElementRef;
  lstFiltered = [];
  lstConditions = [];
  keyword: any;
  domEles: any;
  selectedIndex = -1;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnChanges() {
    this.domEles = document.querySelectorAll(".column-list > *");

    this.lstFiltered = [];
    this.searchList.forEach((o) => {
      this.lstFiltered.push(o);
    });

    if (this.resetCondition) {
      this.lstConditions = [];
      this.selectedFilters.emit(this.lstConditions);
    }
  }

  ngOnInit(): void {
    this.resetForm();
  }

  // search = node => {
  //   let found, { item, children = [] } = node;
  //   
  //   if (children.length) {
  //     
  //     for (let child of node.children)
  //     {
  //        
  //       if (found = this.search(child))
  //       {
  //         
  //         return node.children.concat(found);
  //       }
  //     }

  //   }

  //   if((item.siteName || '').toLowerCase() === (this.target || '').toLowerCase() && [item]) {
  //   return node;
  //   } else {
  //   return;
  //   }
  // }

  resetForm() {
    this.form = this.fb.group({
      fcSearch: null,
    });
  }
  goSearch(keyword) {
    this.keyword = keyword;
  }

  addCondition(item) {
    let obj = {
      name: item.name,
      keyword: this.keyword,
      key: item.key,
    };

    let index = -1;
    for (let i = 0; i < this.lstConditions.length; i++) {
      if (this.lstConditions[i].name == item.name) {
        index = i;
      }
    }

    if (index > -1) {
      this.lstConditions[index].name = item.name;
      this.lstConditions[index].keyword = this.keyword;

      if (this.filterMode) {
        this.selectedFilters.emit(this.lstConditions);
      }

      if (this.listMode) {
        if (this.treeGridSearch) {
          this.traverseTree(this.lstFiltered);
        } else {
          this.filterListRecursively(index);
        }
      }
    } else {
      this.lstConditions.push(obj);

      if (this.filterMode) {
        this.selectedFilters.emit(this.lstConditions);
      }

      if (this.listMode) {
        if (this.treeGridSearch) {
          this.traverseTree(this.searchList);
        } else {
          this.filterList(this.lstConditions.length - 1);
        }
      }
    }
    this.keyword = "";
    this.form.controls["fcSearch"].setValue(null);
  }

  filterList(i?) {
    this.lstFiltered = this.lstFiltered.filter(
      (x) =>
        !!x[this.lstConditions[i].key] &&
        x[this.lstConditions[i].key]
          .toLowerCase()
        .includes(this.lstConditions[i].keyword.toLowerCase())
    );

    this.filteredList.emit(this.lstFiltered);
  }
  filterListRecursively(i?) {
    this.lstFiltered = this.searchList.slice(0);
    for (let i = 0; i < this.lstConditions.length; i++) {
      this.lstFiltered = this.lstFiltered.filter(
        (x) =>
          !!x[this.lstConditions[i].key] &&
          x[this.lstConditions[i].key]
            .toLowerCase()
            .includes(this.lstConditions[i].keyword.toLowerCase())
      );
    }

    this.filteredList.emit(this.lstFiltered);
  }

  traverseTree(searchArr) {
    if (this.lstConditions.length > 0) {
      let tempArr = [];
      for (const i of searchArr) {
        if (this.searchInTreeRecursively(i)) {
          tempArr.push(i);
        }
      }

      this.lstFiltered = tempArr;

      this.filteredList.emit(this.lstFiltered);
    }
  }

  searchInTreeRecursively(item) {
    let exist = false;
    if (item.children.length === 0) {
      for (const obj of this.lstConditions) {
        if (
          (item.item[obj.key] || "")
            .toLowerCase()
            .includes((obj.keyword || "").toLowerCase())
        ) {
          exist = true;
          break;
        }
      }
    } else {
      for (const i of item.children) {
        for (const obj of this.lstConditions) {
          if (
            (item.item[obj.key] || "")
              .toLowerCase()
              .includes((obj.keyword || "").toLowerCase())
          ) {
            exist = true;
            break;
          }
        }
        if (i.children.length > 0) {
          exist = this.searchInTreeRecursively(i);
        }
      }
    }

    return exist;
  }

  deleteKeyword(keyword) {
    let index = this.lstConditions.indexOf(keyword);
    this.lstConditions.splice(index, 1);
    if (this.lstConditions.length == 0) {
      if (this.filterMode) {
        this.selectedFilters.emit(this.lstConditions);
      }
      if (this.listMode) {
        this.filteredList.emit(this.searchList);
        this.lstFiltered = this.searchList.slice();
      }

      // return;
    } else {
      if (this.filterMode) {
        this.selectedFilters.emit(this.lstConditions);
      }
      if (this.listMode) {
        if (this.treeGridSearch) {
          this.traverseTree(this.lstFiltered);
        } else {
          this.filterListRecursively();
        }
        // this.filteredList.emit(this.lstFiltered);
      }
    }

    // this.filterList();
  }

  focusInput() {
    this.inputEl.nativeElement.focus();
  }

  handleKeyboardEvents(event: KeyboardEvent) {


    if(!this.keyword )
    {
      return;
    }
    document.querySelectorAll(".column-list > *").forEach((i) => {
      i.classList.remove("move");
    });

    if (event.key == "ArrowDown") {
      event.preventDefault();
      if (this.selectedIndex == this.domEles.length - 1) {
        this.selectedIndex = 0;
        document
          .getElementById("tag-" + this.selectedIndex)
          .classList.add("move");
      } else {
        this.selectedIndex++;
        document
          .getElementById("tag-" + this.selectedIndex)
          .classList.add("move");
      }
    } else if (event.key == "ArrowUp") {
      event.preventDefault();

      if (this.selectedIndex == 0) {
        this.selectedIndex = this.domEles.length - 1;
        document
          .getElementById("tag-" + this.selectedIndex)
          .classList.add("move");
      } else {
        this.selectedIndex--;
        document
          .getElementById("tag-" + this.selectedIndex)
          .classList.add("move");
      }
    } else if (event.key == "Enter") {
      this.addCondition(this.columnList[this.selectedIndex]);
      this.selectedIndex = -1;
    } else if (event.key == "Escape") {
      this.keyword = null;
      this.form.controls["fcSearch"].setValue(null);
    }else if(event.key == "Backspace"){
      if(this.lstConditions.length != 0)
      {
        this.deleteKeyword(this.lstConditions[this.lstConditions.length]);
      }

    } else {
      this.selectedIndex = -1;
    }
  }

  removeFocus(){
    document.querySelectorAll(".column-list > *").forEach((i) => {
      i.classList.remove("move");
    });
    this.selectedIndex = -1;
  }
}
