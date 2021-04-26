import { BreakpointObserver } from '@angular/cdk/layout';
import { OrderDisplayService } from '@app/_services/order/order-display.service';

import { OrderService } from '@app/_services/order/order.service';
import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component, ViewChild, SimpleChange } from '@angular/core';
import { TableComponent } from '@app/_components/helpers/table/table.component';
import { OrderSearchService } from '@app/_services/order/order-search.service';
import { contentSideMain, filterDialogExpand } from '@app/_components/animations/filter-animation';

@Component({
  selector: 'app-order-desktop',
  templateUrl: './order-desktop.component.html',
  styleUrls: ['./order-desktop.component.scss'],
  animations: [
    filterDialogExpand,
    contentSideMain
  ]
})
export class OrderDesktopComponent extends ChildBaseComponent<undefined>{
  @ViewChild('tableComponent') tableComponent: TableComponent;
  get orderService() { return this.service as OrderService; }

  constructor(
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    public display: OrderDisplayService
  ) {
    super(dialog, breakpointObserver);
    display.destroy();
  }

  public init() {
    this.display.init();
  }

  public onDestroy() {
    this.display.destroy();
  }


  public endUpdate(change: SimpleChange) {
    this.tableComponent.endUpdate(change);
    this.display.endUpdate(change);
  }

  public selectedStatesChange(states: string[]) {
    ((this.service as OrderService).search as OrderSearchService).updateStates(states);
  }
}
