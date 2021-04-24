import { TestBed } from '@angular/core/testing';

import { SupplierDisplayService } from './supplier-display.service';

describe('SupplierDisplayService', () => {
  let service: SupplierDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
