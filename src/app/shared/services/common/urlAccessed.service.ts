import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class LasturlAccessed {

  private url = new BehaviorSubject<any>('/home');
  previousURL = this.url.asObservable();
  param = new BehaviorSubject<any>({ report: '', id: 1, code: '' });
  paramURL = this.param.asObservable();
  private homeURL = new BehaviorSubject<any>(false);
  isHomeURL = this.homeURL.asObservable();
  constructor() { }

  changeurl(url: string) {
    if(url == '/home'){
      this.homeURL.next(true);
    }
    else{
      this.homeURL.next(false);
    }
    this.url.next(url)
  }
  makeHomeFalse(){
    this.homeURL.next(false);
  }
  changeParam(reportName: string, ID: number, Code: string) {
    this.param.next({ report: reportName, id: ID, code: Code })
  }
}
