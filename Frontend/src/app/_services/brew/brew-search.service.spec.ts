import { TestBed } from '@angular/core/testing';

import { BrewSearchService } from './brew-search.service';

describe('BrewSearchService', () => {
  let service: BrewSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrewSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
