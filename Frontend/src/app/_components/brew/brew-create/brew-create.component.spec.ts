import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewCreateComponent } from './brew-create.component';

describe('BrewCreateComponent', () => {
  let component: BrewCreateComponent;
  let fixture: ComponentFixture<BrewCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
