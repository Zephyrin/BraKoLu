import { OrderDisplayService } from '@app/_services/order/order-display.service';

import { OrderService } from '@app/_services/order/order.service';
import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component, ViewChild, SimpleChange, OnInit } from '@angular/core';
import { TableComponent } from '@app/_components/helpers/table/table.component';

@Component({
  selector: 'app-order-desktop',
  templateUrl: './order-desktop.component.html',
  styleUrls: ['./order-desktop.component.scss']
})
export class OrderDesktopComponent extends ChildBaseComponent<undefined>{
  @ViewChild('tableComponent') tableComponent: TableComponent;
  get orderService() { return this.service as OrderService; }

  constructor(
    public dialog: MatDialog,
    public orderDisplayService: OrderDisplayService
  ) {
    super(dialog, undefined);
    orderDisplayService.destroy();
  }

  public init() {
    this.orderDisplayService.init();
  }

  public onDestroy() {
    this.orderDisplayService.destroy();
  }

  public endUpdate(change: SimpleChange) {
    this.tableComponent.endUpdate(change);
    this.orderDisplayService.endUpdate(change);
  }
}
