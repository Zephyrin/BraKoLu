import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewMobileComponent } from './brew-mobile.component';

describe('BrewMobileComponent', () => {
  let component: BrewMobileComponent;
  let fixture: ComponentFixture<BrewMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
