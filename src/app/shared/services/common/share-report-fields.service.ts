import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ShareReportFieldsService {

  private param = new BehaviorSubject<any>({arrLst: null});
  getFieldsParam = this.param.asObservable();

  constructor() { }

  setReportFieldsArr(arr) {

    this.param.next({
      arrLst: arr
    });

  }
}
