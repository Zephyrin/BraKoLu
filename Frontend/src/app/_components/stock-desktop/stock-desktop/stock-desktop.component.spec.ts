import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDesktopComponent } from './stock-desktop.component';

describe('StockDesktopComponent', () => {
  let component: StockDesktopComponent;
  let fixture: ComponentFixture<StockDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
