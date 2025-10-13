import { TestBed } from '@angular/core/testing';

import { WagesDataService } from './wages-data.service';

describe('WagesDataService', () => {
  let service: WagesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WagesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
