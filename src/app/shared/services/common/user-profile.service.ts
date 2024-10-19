import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {


  private param = new BehaviorSubject<any>({dateFormat: '', timeZoneFormat: ''});
  getUserParam = this.param.asObservable();

  constructor() { }

  changeUserParam(obj: any) {
     
    this.param.next(
      {
        dateFormat : obj.userDateFormat || '',
        timeZoneFormat: obj.userTimeZone || ''
      });
  }
}