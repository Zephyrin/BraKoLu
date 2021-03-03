import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSelectorFilterComponent } from './supplier-selector-filter.component';

describe('SupplierSelectorFilterComponent', () => {
  let component: SupplierSelectorFilterComponent;
  let fixture: ComponentFixture<SupplierSelectorFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierSelectorFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierSelectorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
