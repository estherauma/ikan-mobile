import { TestBed } from '@angular/core/testing';

import { PaymentsDataService } from './payments-data.service';

describe('PaymentsDataService', () => {
  let service: PaymentsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
