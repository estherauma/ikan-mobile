import { TestBed } from '@angular/core/testing';

import { TutorialsGuard } from './tutorials.guard';

describe('TutorialsGuard', () => {
  let guard: TutorialsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TutorialsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
