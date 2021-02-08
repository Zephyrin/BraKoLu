import { TestBed } from '@angular/core/testing';

import { StockDisplayService } from './stock-display.service';

describe('StockDisplayService', () => {
  let service: StockDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
