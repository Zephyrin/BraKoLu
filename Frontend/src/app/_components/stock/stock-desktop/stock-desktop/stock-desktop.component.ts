import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
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
  dataSource: any;
  @ViewChild('matTable') matTable: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog) {
    super(dialog, StockCreateComponent);
  }

  public endUpdate() {
    this.dataSource = new MatTableDataSource(this.service.model);
    this.dataSource.sort = this.sort;
  }
}
