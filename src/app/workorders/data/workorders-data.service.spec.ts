import { TestBed } from '@angular/core/testing';

import { WorkordersDataService } from './workorders-data.service';

describe('WorkordersDataService', () => {
  let service: WorkordersDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkordersDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
