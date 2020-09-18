import { TestBed } from '@angular/core/testing';

import { IngredientHttpService } from './ingredient-http.service';

describe('IngredientHttpService', () => {
  let service: IngredientHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
