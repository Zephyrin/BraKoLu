import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockToolbarComponent } from './stock-toolbar.component';

describe('StockToolbarComponent', () => {
  let component: StockToolbarComponent;
  let fixture: ComponentFixture<StockToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
