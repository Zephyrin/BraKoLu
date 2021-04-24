import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientSelectInputComponent } from './ingredient-select-input.component';

describe('IngredientSelectInputComponent', () => {
  let component: IngredientSelectInputComponent;
  let fixture: ComponentFixture<IngredientSelectInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientSelectInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
