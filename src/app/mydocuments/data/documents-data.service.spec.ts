import { TestBed } from '@angular/core/testing';

import { DocumentsDataService } from './documents-data.service';

describe('DocumentsDataService', () => {
  let service: DocumentsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
