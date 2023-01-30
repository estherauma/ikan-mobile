import { TestBed } from '@angular/core/testing';

import { AgentsDataService } from './agents-data.service';

describe('AgentsDataServiceService', () => {
  let service: AgentsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
