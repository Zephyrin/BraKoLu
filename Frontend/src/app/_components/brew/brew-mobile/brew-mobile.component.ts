import { BrewCreateComponent } from './../brew-create/brew-create.component';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
  selector: 'app-brew-mobile',
  templateUrl: './brew-mobile.component.html',
  styleUrls: ['./brew-mobile.component.scss']
})
export class BrewMobileComponent extends ChildBaseComponent<BrewCreateComponent> {

  constructor(public dialog: MatDialog) {
    super(dialog, BrewCreateComponent);
  }

}
