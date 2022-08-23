import { TestBed } from '@angular/core/testing';

import { SharedmethodsService } from './sharedmethods.service';

describe('SharedmethodsService', () => {
  let service: SharedmethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedmethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
