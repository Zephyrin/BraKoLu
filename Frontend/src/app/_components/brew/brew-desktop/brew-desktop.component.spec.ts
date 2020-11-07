import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewDesktopComponent } from './brew-desktop.component';

describe('BrewDesktopComponent', () => {
  let component: BrewDesktopComponent;
  let fixture: ComponentFixture<BrewDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
