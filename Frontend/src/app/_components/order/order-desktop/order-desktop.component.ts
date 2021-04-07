import { OrderDisplayService } from '@app/_services/order/order-display.service';

import { OrderService } from '@app/_services/order/order.service';
import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component, ViewChild, SimpleChange, OnInit } from '@angular/core';
import { TableComponent } from '@app/_components/helpers/table/table.component';
import { OrderSearchService } from '@app/_services/order/order-search.service';
import { filterExpand } from '@app/_components/animations/filter-animation';

@Component({
  selector: 'app-order-desktop',
  templateUrl: './order-desktop.component.html',
  styleUrls: ['./order-desktop.component.scss'],
  animations: [
    filterExpand
  ]
})
export class OrderDesktopComponent extends ChildBaseComponent<undefined>{
  @ViewChild('tableComponent') tableComponent: TableComponent;
  get orderService() { return this.service as OrderService; }

  constructor(
    public dialog: MatDialog,
    public displayService: OrderDisplayService
  ) {
    super(dialog, undefined);
    displayService.destroy();
  }

  public init() {
    this.displayService.init();
  }

  public onDestroy() {
    this.displayService.destroy();
  }

  public endUpdate(change: SimpleChange) {
    this.tableComponent.endUpdate(change);
    this.displayService.endUpdate(change);
  }

  public selectedStatesChange(states: string[]) {
    ((this.service as OrderService).search as OrderSearchService).updateStates(states);
  }
}
