import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewIngredientTableComponent } from './brew-ingredient-table.component';

describe('BrewIngredientTableComponent', () => {
  let component: BrewIngredientTableComponent;
  let fixture: ComponentFixture<BrewIngredientTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewIngredientTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewIngredientTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
