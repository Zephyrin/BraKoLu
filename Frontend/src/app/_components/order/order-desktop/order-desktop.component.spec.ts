import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDesktopComponent } from './order-desktop.component';

describe('OrderDesktopComponent', () => {
  let component: OrderDesktopComponent;
  let fixture: ComponentFixture<OrderDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
