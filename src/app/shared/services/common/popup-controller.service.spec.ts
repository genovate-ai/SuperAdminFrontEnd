import { TestBed, inject } from '@angular/core/testing';

import { PopupControllerService } from './popup-controller.service';

describe('PopupControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopupControllerService]
    });
  });

  it('should be created', inject([PopupControllerService], (service: PopupControllerService) => {
    expect(service).toBeTruthy();
  }));
});
