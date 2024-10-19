import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";

@Component({
  selector: "app-custom-input-dropdown",
  templateUrl: "./custom-input-dropdown.component.html",
  styleUrls: ["./custom-input-dropdown.component.scss"],
  host: {
    "(document:keydown)": "handleKeyboardEvents($event)",
  },
})
export class CustomInputDropdownComponent implements OnInit {
  form: UntypedFormGroup;
  existingItem: any;
  @Input() lstInput = [];
  @Input() placeholder;
  @Input() id;
  @Input() keyword;
  @Input() cssClass = '';
  @Output() addItem = new EventEmitter<any>();
  @Output() selectedItem = new EventEmitter<any>();
  @ViewChild("myInput", { static: true }) inputEl: ElementRef;
  showList: boolean = false;
  showAddNew: boolean = false;
  showTags: boolean = false;
  lstFiltered = [];
  lstTags = [];
  domEles: any;
  selectedIndex = -1;
  @ViewChild("droplist", { static: true }) public panel: ElementRef<any>;
  @Input() translatePlaceholder = false;
  @Input() disabledControl = false;
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    
  }

  resetForm() {
    this.form = this.fb.group({
      fcSearch: [''],
    });
  }

  ngOnChanges() {
    this.domEles = document.querySelectorAll("#" + this.id + " > *");
    this.resetForm();
    this.goSearch(this.keyword, true);
  }
  goSearch(keyword, isFromSelect?) {
    if (this.disabledControl) {
      
      this.form.controls["fcSearch"].reset();
      this.form.disable();
      // this.form.controls["fcSearch"].disable();
    } else {
      setTimeout(() => {
        this.form.enable();
        // this.form.controls["fcSearch"].enable();
      }, 0);
    }
    if (!isFromSelect) {
      this.showTags = true;
    } else {
      this.showTags = false;
    }

    if (keyword == undefined) {
      keyword = "";
    } else {
      this.form.controls["fcSearch"].setValue(keyword);
    }

    if (keyword.length == 0) {
      this.showList = false;
      this.showAddNew = false;
      document.querySelectorAll(".drop-list").forEach((i) => {
        i.classList.remove("d-block");
      });
    }
    this.lstFiltered = [];
    this.lstTags = [];
    this.keyword = keyword;
    this.lstFiltered = this.lstInput.filter((x) =>
      x["name"].toLowerCase().includes(keyword.toLowerCase())
    );

    if (keyword.length > 0) {
      if (!isFromSelect) {
        this.showList = false;
        this.getFilteredList();
      }
    }
    this.existingItem = this.lstFiltered.filter(
      (x) => x["name"].toLowerCase() == keyword.toLowerCase()
    );




    // IF LIST IS NOT NULL, CREATE TAGS
    if (this.lstFiltered.length > 0) {
      //IF LIST LENGTH > 4, WE NEED TO SHOW 4 TAGS ONLY, SO LOOPING UNTIL 4
      if (this.lstFiltered.length > 4) {
        for (let i = 0; i < 4; i++) {
          this.lstTags.push(this.lstFiltered[i]);
        }
      }
      //LIST LENGTH < 4
      else {
        for (let i = 0; i < this.lstFiltered.length; i++) {
          this.lstTags.push(this.lstFiltered[i]);
        }
      }
    }
    //IF LIST IS NULL, SHOW ADD NEW ENTRY
    else {
      this.showAddNew = true;
    }

    if (this.existingItem.length > 0) {
      this.showAddNew = false;
      this.selectedItem.emit(this.existingItem[0]);
      this.showTags = false;
    } else {
      this.selectedItem.emit(null);
    }
  }

  getFilteredList() {
    if (this.disabledControl) {
      return;
    }
    this.selectedIndex = -1;
    document.querySelectorAll(".drop-list > *").forEach((i) => {
      i.classList.remove("move");
    });

    document.querySelectorAll(".drop-list").forEach((i) => {
      i.classList.remove("d-block");
    });

    var id = document.querySelector("." + this.id);
    // if (this.lstFiltered.length > 0) {
    id.classList.add("d-block");
    // }

    setTimeout(() => {
      this.panel.nativeElement.scrollTop = 0;
    }, 10);
    if (this.showList) {
      document.querySelectorAll(".drop-list").forEach((i) => {
        i.classList.remove("d-block");
      });
    }
    this.showList = !this.showList;
  }
  closeDropdown() {
    document.querySelectorAll(".drop-list > *").forEach((i) => {
      i.classList.remove("move");
    });
    document.querySelectorAll(".drop-list").forEach((i) => {
      i.classList.remove("d-block");
    });
    this.selectedIndex = -1;
    this.showList = false;
  }
  selectItem(item) {
    this.showList = false;
    this.selectedIndex = -1;
    this.selectedItem.emit(item);
    this.form.controls["fcSearch"].setValue(item.name);
    this.keyword = item.name;
    document.querySelector("." + this.id).classList.remove("d-block");
    this.goSearch(this.keyword, true);
  }

  addNewItem() {
    this.showAddNew = false;
    this.closeDropdown()
    this.addItem.emit(this.keyword);
    this.showList = false;
  }

  focusInput() {
    this.inputEl.nativeElement.focus();
  }

  handleKeyboardEvents(event: KeyboardEvent) {
    if (
      event.key != "ArrowDown" &&
      event.key != "ArrowUp" &&
      event.key != "Enter"
    ) {
      return;
    }

    if (this.showAddNew && this.keyword.length > 0) {
      if (event.key == "ArrowDown") {
        var elem = document.getElementById("btnAddNewItem-" + this.id);
        var elem2 = document.getElementById("btnAddNew-" + this.id);
        if (elem) {
          elem.classList.add("move");
          this.selectedIndex = -2;
        }
        if (elem2) {
          elem2.classList.add("move");
          this.selectedIndex = -2;
        }
      } else if (event.key == "Enter") {
        // if (this.selectedIndex == -2) {
        this.addNewItem();
        // }
      }
    }

    if (this.showList) {
      if (this.selectedIndex == -2) {
        this.selectedIndex = -1;
      }
      var height = document.getElementById("tag-0-" + this.id).offsetHeight;

      document.querySelectorAll("#" + this.id + " > *").forEach((i) => {
        i.classList.remove("move");
      });

      if (event.key == "ArrowDown") {
        event.preventDefault();
        if (this.selectedIndex == this.lstFiltered.length - 1) {
          if (this.existingItem.length == 0 && this.keyword.length > 0) {
            document
              .getElementById("btnAddNew-" + this.id)
              .classList.add("move");
            this.selectedIndex = this.lstFiltered.length;
            this.panel.nativeElement.scrollTop =
              this.panel.nativeElement.scrollHeight;
            return;
          }
          this.selectedIndex = 0;
          this.panel.nativeElement.scrollTop = 0;

          document
            .getElementById("tag-" + this.selectedIndex + "-" + this.id)
            .classList.add("move");
        } else if (this.selectedIndex == this.lstFiltered.length) {
          this.selectedIndex = 0;
          this.panel.nativeElement.scrollTop = 0;
          document
            .getElementById("tag-" + this.selectedIndex + "-" + this.id)
            .classList.add("move");
        } else {
          this.selectedIndex++;
          document
            .getElementById("tag-" + this.selectedIndex + "-" + this.id)
            .classList.add("move");

          if (this.selectedIndex != 0) {
            this.panel.nativeElement.scrollTop += height;
          }
        }
      } else if (event.key == "ArrowUp") {
        event.preventDefault();

        if (this.selectedIndex == -1) {
          this.selectedIndex = 0;
        }
        if (this.selectedIndex == 0) {
          this.selectedIndex = this.lstFiltered.length - 1;
          this.panel.nativeElement.scrollTop =
            this.panel.nativeElement.scrollHeight;

          document
            .getElementById("tag-" + this.selectedIndex + "-" + this.id)
            .classList.add("move");
        } else {
          // if (this.existingItem.length == 0 && this.keyword.length > 0) {
          //   this.selectedIndex = this.lstFiltered.length;
          // }
          this.selectedIndex--;
          document
            .getElementById("tag-" + this.selectedIndex + "-" + this.id)
            .classList.add("move");

          if (this.selectedIndex != 0) {
            this.panel.nativeElement.scrollTop -= height;
          } else {
            this.panel.nativeElement.scrollTop = 0;
          }
        }
      } else if (event.key == "Enter") {
        if (this.selectedIndex == this.lstFiltered.length) {
          this.addNewItem();
        } else if (this.selectedIndex != -1) {
          this.selectItem(this.lstFiltered[this.selectedIndex]);
        }
      }

    }

  }
}
