import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewToolbarComponent } from './brew-toolbar.component';

describe('BrewToolbarComponent', () => {
  let component: BrewToolbarComponent;
  let fixture: ComponentFixture<BrewToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
