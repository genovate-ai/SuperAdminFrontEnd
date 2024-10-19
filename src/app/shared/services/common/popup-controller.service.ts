import { Injectable, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class PopupControllerService {

  component = new BehaviorSubject<boolean>(false);
  public close = new Subject<boolean>();
  result = new BehaviorSubject<boolean>(false);
  params = new BehaviorSubject<boolean>(false);
  public parameters = {};
  public popupHeader: string = '';
  public screenId: number = 0;
  public eventId: number = 0;
  public isSafeToClose: boolean = true;
  public confirmationV2 = false;

  constructor() {
    this.confirmationV2 = false;
   }

  updateComponent(component: any) {


    this.component.next(component);

  }

  getComponent() {
    return this.component.asObservable();
  }
  closePopup() {
    this.confirmationV2 = false;
    this.close.next(true)
  }
  isClosed() {
    return this.close.asObservable()
  }
  updateResult(result: any) {
    this.result.next(result);
  }
  getResultOnClose() {
    return this.result.asObservable()
  }
  updateParams(params: any) {
    this.parameters = params
  }
  getParams() {
    var params = this.parameters;
    this.parameters = null;
    return params;
  }
  setConfirmationV2(params: boolean) {
    this.confirmationV2 = params;
  }
  getConfirmationV2() {
    return this.confirmationV2 as boolean;
  }

  modalSize: string = null  //lg,md,sm,
  updateModalSize(size: string) {
    this.modalSize = size;
  }
}
