import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPronosticComponent } from './order-pronostic.component';

describe('OrderPronosticComponent', () => {
  let component: OrderPronosticComponent;
  let fixture: ComponentFixture<OrderPronosticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPronosticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPronosticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
