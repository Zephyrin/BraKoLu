import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewDetailsDesktopComponent } from './brew-details-desktop.component';

describe('BrewDetailsDesktopComponent', () => {
  let component: BrewDetailsDesktopComponent;
  let fixture: ComponentFixture<BrewDetailsDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewDetailsDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewDetailsDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
