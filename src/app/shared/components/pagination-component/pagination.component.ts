import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Constants } from "src/app/shared/helper/Constants";

@Component({
  selector: "app-pagination-component",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit {
  @Input() activePageNumber: any;
  @Input() rowNumber: any;
  @Input() totalRecord: any;
  @Input() maxPageCount: any;
  @Output() onPageChange = new EventEmitter();
  @Output() onRowNumberChange = new EventEmitter();
  @Output() onDisplayFilters = new EventEmitter();
  constructor() {}
  pages = [];
  totalPages = Constants.totalPagesOnPagination;
  ngOnInit() {
    this.initPagesNumbers();
  }
  showFilters() {
    this.onDisplayFilters.emit(true);
  }
  initPagesNumbers() {
    var startingIndex = this.initStartingIndex();
    this.pages = [];
    for (var i = 0; i < this.totalPages; i++) {
      if (startingIndex <= this.maxPageCount) {
        this.pages.push(startingIndex);
      }

      startingIndex++;
    }
  }
  initStartingIndex() {
    this.activePageNumber = parseInt(this.activePageNumber);

    if (
      this.activePageNumber == this.maxPageCount ||
      this.activePageNumber >= this.maxPageCount - 10
    ) {
      if (this.activePageNumber < 10 && this.activePageNumber > 2) {
        // return this.activePageNumber - 2; // this logic move the hide the page no 1 if we select page 4 from 1 2 3 4
        return 1; // Explicitly passing the starting index 1 so no page will shift untill its page no 10 and no page no will hide
      } else if (this.activePageNumber <= 2) {
        // return this.activePageNumber; // this logic move the hide the page 1 if we select page 4 from 1 2 3 4
        return 1; // Explicitly passing the starting index 1 so no page will shift untill its page no 10 and no page no will hide
      } else {
        return this.activePageNumber - 9;
      }
    } else if (this.activePageNumber - 2 >= 1) {
      return this.activePageNumber - 2;
    } else if (this.activePageNumber - 1 >= 1) {
      return this.activePageNumber - 1;
    } else {
      return this.activePageNumber;
    }
  }
  onPageClick(pageNumber) {
    this.emitPageValue(pageNumber);
  }
  emitPageValue(pageNumber) {
    if (this.activePageNumber == pageNumber) {
      return;
    }
    this.onPageChange.emit(pageNumber);
  }
  previousPage() {
    if (this.activePageNumber - 1 < 1) {
      return;
    }
    this.emitPageValue(this.activePageNumber - 1);
  }
  nextPage() {
    if (this.activePageNumber + 1 > this.maxPageCount) {
      return;
    }
    this.emitPageValue(this.activePageNumber + 1);
  }
  lastPage() {
    // this.activePageNumber = this.maxPageCount;
    this.emitPageValue(this.maxPageCount);
  }
  firstPage() {
    this.emitPageValue(1);
  }
  ngOnChanges(pageNumber) {
    if (pageNumber.maxPageCount) {
      this.maxPageCount = pageNumber.maxPageCount.currentValue;
    }
    if (pageNumber.activePageNumber) {
      this.activePageNumber = pageNumber.activePageNumber.currentValue;
    }

    this.initPagesNumbers();
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
  }
  rowNumberChange(e) {

    this.emitRowChange(e.target.value);
  }
  emitRowChange(rowNumber) {
    if (this.rowNumber == rowNumber) {
      return;
    }
    this.onRowNumberChange.emit(rowNumber);
  }
}
