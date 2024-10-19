import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from 'src/app/shared/helper/Constants';



@Component({
  selector: 'app-pagination-old-component',
  templateUrl: './pagination-old.component.html',
  styleUrls: ['./pagination-old.component.scss']
})
export class PaginationOldComponent implements OnInit {

  @Input() activePageNumber: any;
  @Input() maxPageCount: any;
  @Output() onPageChange = new EventEmitter()
  constructor() { }
  pages = []
  totalPages = Constants.totalPagesOnPagination;
  ngOnInit() {

    this.initPagesNumbers()

  }
  initPagesNumbers() {
    var startingIndex = this.initStartingIndex()
    this.pages = []
    for (var i = 0; i < this.totalPages; i++) {
      if (startingIndex <= this.maxPageCount) {
        this.pages.push(startingIndex)
      }

      startingIndex++;
    }
  }
  initStartingIndex() {
  
    this.activePageNumber = parseInt(this.activePageNumber)

    if (this.activePageNumber - 2 >= 1) {
      return this.activePageNumber - 2;
    }
    else if (this.activePageNumber - 1 >= 1) {
      return this.activePageNumber - 1;
    }
    else {
      return this.activePageNumber;
    }
  }
  onPageClick(pageNumber) {
    this.emitPageValue(pageNumber)
  }
  emitPageValue(pageNumber) {
    if(this.activePageNumber==pageNumber){return;}
    this.onPageChange.emit(pageNumber)
  }
  previousPage() {
    if ((this.activePageNumber - 1) < 1) { return }
    this.emitPageValue(this.activePageNumber - 1)
  }
  nextPage() {
    if ((this.activePageNumber + 1) > this.maxPageCount) { return; }
    this.emitPageValue(this.activePageNumber + 1)
  }
  lastPage() {

    this.emitPageValue(this.maxPageCount)
  }
  firstPage() {
    this.emitPageValue(1)
  }
  ngOnChanges(pageNumber) {

    if (pageNumber.maxPageCount) {
      this.maxPageCount = pageNumber.maxPageCount.currentValue
    }
    if (pageNumber.activePageNumber) {
      this.activePageNumber = pageNumber.activePageNumber.currentValue;
    }

    this.initPagesNumbers()
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

  }
}
