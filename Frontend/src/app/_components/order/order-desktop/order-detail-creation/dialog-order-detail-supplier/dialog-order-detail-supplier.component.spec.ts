import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrderDetailSupplierComponent } from './dialog-order-detail-supplier.component';

describe('DialogOrderDetailSupplierComponent', () => {
  let component: DialogOrderDetailSupplierComponent;
  let fixture: ComponentFixture<DialogOrderDetailSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOrderDetailSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrderDetailSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
