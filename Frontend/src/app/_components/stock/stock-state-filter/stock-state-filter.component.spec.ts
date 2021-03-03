import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockStateFilterComponent } from './stock-state-filter.component';

describe('StockStateFilterComponent', () => {
  let component: StockStateFilterComponent;
  let fixture: ComponentFixture<StockStateFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockStateFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockStateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
