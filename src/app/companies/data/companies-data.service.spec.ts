import { TestBed } from '@angular/core/testing';

import { CompaniesDataService } from './companies-data.service';

describe('CompaniesDataService', () => {
  let service: CompaniesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompaniesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
