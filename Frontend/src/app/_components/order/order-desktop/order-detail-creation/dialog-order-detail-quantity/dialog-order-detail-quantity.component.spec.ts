import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrderDetailQuantityComponent } from './dialog-order-detail-quantity.component';

describe('DialogOrderDetailQuantityComponent', () => {
  let component: DialogOrderDetailQuantityComponent;
  let fixture: ComponentFixture<DialogOrderDetailQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOrderDetailQuantityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrderDetailQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
