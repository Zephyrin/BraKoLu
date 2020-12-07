import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrderDetailDateComponent } from './dialog-order-detail-date.component';

describe('DialogOrderDetailDateComponent', () => {
  let component: DialogOrderDetailDateComponent;
  let fixture: ComponentFixture<DialogOrderDetailDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOrderDetailDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrderDetailDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
