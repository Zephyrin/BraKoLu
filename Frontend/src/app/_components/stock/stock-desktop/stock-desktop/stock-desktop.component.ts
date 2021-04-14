import { SupplierService } from '@app/_services/supplier/supplier.service';
import { TableComponent } from '@app/_components/helpers/table/table.component';

import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component, ViewChild, AfterViewInit, SimpleChange } from '@angular/core';
import { StockCreateComponent } from '@app/_components/stock/stock-create/stock-create.component';
import { StockDisplayService } from '@app/_services/stock/stock-display.service';

@Component({
  selector: 'app-stock-desktop',
  templateUrl: './stock-desktop.component.html',
  styleUrls: ['./stock-desktop.component.scss'],

})
export class StockDesktopComponent extends ChildBaseComponent<StockCreateComponent> implements AfterViewInit {
  @ViewChild('Table') tableComponent: TableComponent;
  constructor(
    public dialog: MatDialog,
    public serviceSupplier: SupplierService,
    public displayService: StockDisplayService) {
    super(dialog, StockCreateComponent);
  }

  ngAfterViewInit(): void {
    this.tableComponent.UpdateComponentOrTemplateRef(StockCreateComponent);
  }

  public endUpdate(change: SimpleChange) {
    this.tableComponent.endUpdate(change);
  }
}
