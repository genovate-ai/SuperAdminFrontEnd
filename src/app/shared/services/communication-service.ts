import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private alignedImageryUpdate = new Subject<void>();
  alignedImageryUpdate$ = this.alignedImageryUpdate.asObservable();
  private editImagery = new Subject<void>();
  editImagery$ = this.editImagery.asObservable();

  triggerAlignedImageryUpdate() {
    this.alignedImageryUpdate.next();
  }
  triggerEditImagery() {
    this.editImagery.next();
  }
}