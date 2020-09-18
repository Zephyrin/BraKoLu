import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientCreateFormComponent } from './ingredient-create-form.component';

describe('IngredientCreateFormComponent', () => {
  let component: IngredientCreateFormComponent;
  let fixture: ComponentFixture<IngredientCreateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientCreateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
