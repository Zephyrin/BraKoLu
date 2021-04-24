import { TestBed } from '@angular/core/testing';

import { SupplierSearchService } from './supplier-search.service';

describe('SupplierSearchService', () => {
  let service: SupplierSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
