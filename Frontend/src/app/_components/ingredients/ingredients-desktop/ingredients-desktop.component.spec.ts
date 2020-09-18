import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsDesktopComponent } from './ingredients-desktop.component';

describe('IngredientsDesktopComponent', () => {
  let component: IngredientsDesktopComponent;
  let fixture: ComponentFixture<IngredientsDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientsDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientsDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
