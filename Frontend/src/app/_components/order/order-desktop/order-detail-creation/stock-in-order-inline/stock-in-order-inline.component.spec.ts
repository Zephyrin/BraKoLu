import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInOrderInlineComponent } from './stock-in-order-inline.component';

describe('StockInOrderInlineComponent', () => {
  let component: StockInOrderInlineComponent;
  let fixture: ComponentFixture<StockInOrderInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInOrderInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInOrderInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
