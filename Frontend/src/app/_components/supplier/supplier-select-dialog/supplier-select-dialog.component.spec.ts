import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSelectDialogComponent } from './supplier-select-dialog.component';

describe('SupplierSelectDialogComponent', () => {
  let component: SupplierSelectDialogComponent;
  let fixture: ComponentFixture<SupplierSelectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierSelectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
