import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrderDetailPriceComponent } from './dialog-order-detail-price.component';

describe('DialogOrderDetailPriceComponent', () => {
  let component: DialogOrderDetailPriceComponent;
  let fixture: ComponentFixture<DialogOrderDetailPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOrderDetailPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrderDetailPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
