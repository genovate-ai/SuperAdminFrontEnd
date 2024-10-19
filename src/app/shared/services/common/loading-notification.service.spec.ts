import { TestBed } from '@angular/core/testing';

import { LoadingNotificationService } from './loading-notification.service';

describe('LoadingNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadingNotificationService = TestBed.get(LoadingNotificationService);
    expect(service).toBeTruthy();
  });
});
