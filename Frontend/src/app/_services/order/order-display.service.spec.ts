import { TestBed } from '@angular/core/testing';

import { OrderDisplayService } from './order-display.service';

describe('OrderDisplayService', () => {
  let service: OrderDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
