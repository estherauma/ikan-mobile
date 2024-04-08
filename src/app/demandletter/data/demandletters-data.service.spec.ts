import { TestBed } from '@angular/core/testing';

import { DemandlettersDataService } from './demandletters-data.service';

describe('DemandlettersDataService', () => {
  let service: DemandlettersDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandlettersDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
