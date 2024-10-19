import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ScreenNameService {

  public name = new BehaviorSubject<string>('');
  currentScreen = this.name.asObservable();

  constructor() { }

  changeScreenName(screen: string) {
    this.name.next(screen)
  }

}