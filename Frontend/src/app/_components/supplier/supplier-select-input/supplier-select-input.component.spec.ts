import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSelectInputComponent } from './supplier-select-input.component';

describe('SupplierSelectInputComponent', () => {
  let component: SupplierSelectInputComponent;
  let fixture: ComponentFixture<SupplierSelectInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierSelectInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
