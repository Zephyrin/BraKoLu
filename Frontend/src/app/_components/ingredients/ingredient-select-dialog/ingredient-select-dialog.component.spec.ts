import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientSelectDialogComponent } from './ingredient-select-dialog.component';

describe('IngredientSelectDialogComponent', () => {
  let component: IngredientSelectDialogComponent;
  let fixture: ComponentFixture<IngredientSelectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientSelectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
