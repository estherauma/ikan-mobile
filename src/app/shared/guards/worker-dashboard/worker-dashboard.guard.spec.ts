import { TestBed } from '@angular/core/testing';

import { WorkerDashboardGuard } from './worker-dashboard.guard';

describe('WorkerDashboardGuard', () => {
  let guard: WorkerDashboardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WorkerDashboardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
