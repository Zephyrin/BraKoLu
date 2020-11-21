import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewsTableComponent } from './brews-table.component';

describe('BrewsTableComponent', () => {
  let component: BrewsTableComponent;
  let fixture: ComponentFixture<BrewsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
