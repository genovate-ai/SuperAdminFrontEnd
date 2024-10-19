import { max } from 'rxjs/operators';

export class PaginationModel {
    activePageNumber: number;
    maxPageCount: number;
    pageSize: number;
    totalResult: number;
    constructor(pageSize: number, totalResult: number) {

        this.activePageNumber = 1;
        this.pageSize = pageSize;
        this.totalResult = totalResult;
        var maxPageCount = this.totalResult / this.pageSize;
        this.maxPageCount = Math.floor(maxPageCount) + 1;

    }
}