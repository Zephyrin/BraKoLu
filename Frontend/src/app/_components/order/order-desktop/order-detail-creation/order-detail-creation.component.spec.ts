import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailCreationComponent } from './order-detail-creation.component';

describe('OrderDetailCreationComponent', () => {
  let component: OrderDetailCreationComponent;
  let fixture: ComponentFixture<OrderDetailCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
