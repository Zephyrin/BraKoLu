import { TestBed } from '@angular/core/testing';

import { BrewDisplayService } from './brew-display.service';

describe('BrewDisplayService', () => {
  let service: BrewDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrewDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
