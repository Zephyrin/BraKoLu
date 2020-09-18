import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsEditComponent } from './tools-edit.component';

describe('ToolsEditComponent', () => {
  let component: ToolsEditComponent;
  let fixture: ComponentFixture<ToolsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
