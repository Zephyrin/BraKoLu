import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewIngredientCreateComponent } from './brew-ingredient-create.component';

describe('BrewIngredientCreateComponent', () => {
  let component: BrewIngredientCreateComponent;
  let fixture: ComponentFixture<BrewIngredientCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewIngredientCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewIngredientCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
