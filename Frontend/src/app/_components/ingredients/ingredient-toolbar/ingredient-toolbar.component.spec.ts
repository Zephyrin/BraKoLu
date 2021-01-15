import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientToolbarComponent } from './ingredient-toolbar.component';

describe('IngredientToolbarComponent', () => {
  let component: IngredientToolbarComponent;
  let fixture: ComponentFixture<IngredientToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
