import { BrewCreateComponent } from './../brew-create/brew-create.component';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-brew-mobile',
  templateUrl: './brew-mobile.component.html',
  styleUrls: ['./brew-mobile.component.scss']
})
export class BrewMobileComponent extends ChildBaseComponent<BrewCreateComponent> {

  constructor(public dialog: MatDialog, public breakpointObserver: BreakpointObserver) {
    super(dialog, breakpointObserver);
    this.componentOrTemplateRef = BrewCreateComponent;
  }

}
