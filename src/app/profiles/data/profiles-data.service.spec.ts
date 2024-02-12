import { TestBed } from '@angular/core/testing';

import { ProfilesDataService } from './profiles-data.service';

describe('ProfilesDataService', () => {
  let service: ProfilesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
