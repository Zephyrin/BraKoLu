import { TableComponent } from '@app/_components/helpers/table/table.component';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { BrewCreateComponent } from './../brew-create/brew-create.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-brew-desktop',
  templateUrl: './brew-desktop.component.html',
  styleUrls: ['./brew-desktop.component.scss']
})
export class BrewDesktopComponent extends ChildBaseComponent<BrewCreateComponent> implements AfterViewInit {
  @ViewChild('Table') tableComponent: TableComponent;

  constructor(public dialog: MatDialog) {
    super(dialog, BrewCreateComponent);
  }

  ngAfterViewInit(): void {
    this.tableComponent.UpdateComponentOrTemplateRef(BrewCreateComponent);
  }

  public endUpdate() {
    this.tableComponent.endUpdate();
  }


}
