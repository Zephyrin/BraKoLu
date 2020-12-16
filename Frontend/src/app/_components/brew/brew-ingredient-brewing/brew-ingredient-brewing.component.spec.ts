import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewIngredientBrewingComponent } from './brew-ingredient-brewing.component';

describe('BrewIngredientBrewingComponent', () => {
  let component: BrewIngredientBrewingComponent;
  let fixture: ComponentFixture<BrewIngredientBrewingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewIngredientBrewingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewIngredientBrewingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
