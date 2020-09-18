import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsMobileComponent } from './ingredients-mobile.component';

describe('IngredientsMobileComponent', () => {
  let component: IngredientsMobileComponent;
  let fixture: ComponentFixture<IngredientsMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientsMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
