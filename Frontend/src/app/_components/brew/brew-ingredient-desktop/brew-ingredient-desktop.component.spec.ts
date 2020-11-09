import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewIngredientDesktopComponent } from './brew-ingredient-desktop.component';

describe('BrewIngredientDesktopComponent', () => {
  let component: BrewIngredientDesktopComponent;
  let fixture: ComponentFixture<BrewIngredientDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrewIngredientDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrewIngredientDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
