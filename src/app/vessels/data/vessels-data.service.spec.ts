import { TestBed } from '@angular/core/testing';

import { VesselsDataService } from './vessels-data.service';

describe('VesselsDataService', () => {
  let service: VesselsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VesselsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
