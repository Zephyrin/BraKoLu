import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInOrderTableComponent } from './stock-in-order-table.component';

describe('StockInOrderTableComponent', () => {
  let component: StockInOrderTableComponent;
  let fixture: ComponentFixture<StockInOrderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInOrderTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
