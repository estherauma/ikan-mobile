import { TestBed } from '@angular/core/testing';

import { ConsentFormGuard } from './consent-form.guard';

describe('ConsentFormGuard', () => {
  let guard: ConsentFormGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConsentFormGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
