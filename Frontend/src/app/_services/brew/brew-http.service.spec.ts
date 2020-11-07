import { TestBed } from '@angular/core/testing';

import { BrewHttpService } from './brew-http.service';

describe('BrewHttpService', () => {
  let service: BrewHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrewHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
