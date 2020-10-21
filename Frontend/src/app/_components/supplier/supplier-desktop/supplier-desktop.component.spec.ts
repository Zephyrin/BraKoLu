import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDesktopComponent } from './supplier-desktop.component';

describe('SupplierDesktopComponent', () => {
  let component: SupplierDesktopComponent;
  let fixture: ComponentFixture<SupplierDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
