import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierToolbarComponent } from './supplier-toolbar.component';

describe('SupplierToolbarComponent', () => {
  let component: SupplierToolbarComponent;
  let fixture: ComponentFixture<SupplierToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
