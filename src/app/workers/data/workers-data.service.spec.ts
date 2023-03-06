import { TestBed } from '@angular/core/testing';

import { WorkersDataService } from './workers-data.service';

describe('WorkersDataService', () => {
  let service: WorkersDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkersDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
