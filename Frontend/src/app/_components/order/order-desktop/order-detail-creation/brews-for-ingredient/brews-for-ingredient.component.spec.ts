import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewsForIngredientComponent } from './brews-for-ingredient.component';

describe('BrewsForIngredientComponent', () => {
  let component: BrewsForIngredientComponent;
  let fixture: ComponentFixture<BrewsForIngredientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewsForIngredientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewsForIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
