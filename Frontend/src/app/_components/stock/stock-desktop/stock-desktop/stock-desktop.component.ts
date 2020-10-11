import { TableComponent } from '@app/_components/helpers/table/table.component';

import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component, ViewChild } from '@angular/core';
import { StockCreateComponent } from '@app/_components/stock/stock-create/stock-create.component';

@Component({
  selector: 'app-stock-desktop',
  templateUrl: './stock-desktop.component.html',
  styleUrls: ['./stock-desktop.component.scss']
})
export class StockDesktopComponent extends ChildBaseComponent<StockCreateComponent> {
  @ViewChild('Table') tableComponent: TableComponent;
  constructor(public dialog: MatDialog) {
    super(dialog, StockCreateComponent);
  }

  public endUpdate() {
    this.tableComponent.endUpdate();
  }
}
