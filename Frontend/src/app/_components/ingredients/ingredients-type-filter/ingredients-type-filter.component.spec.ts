import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsTypeFilterComponent } from './ingredients-type-filter.component';

describe('IngredientsTypeFilterComponent', () => {
  let component: IngredientsTypeFilterComponent;
  let fixture: ComponentFixture<IngredientsTypeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientsTypeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientsTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
