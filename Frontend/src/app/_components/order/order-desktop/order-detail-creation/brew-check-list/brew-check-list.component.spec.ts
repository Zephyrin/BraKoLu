import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewCheckListComponent } from './brew-check-list.component';

describe('BrewCheckListComponent', () => {
  let component: BrewCheckListComponent;
  let fixture: ComponentFixture<BrewCheckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewCheckListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
