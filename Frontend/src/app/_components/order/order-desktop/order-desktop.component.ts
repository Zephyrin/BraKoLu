import { OrderDisplayService } from '@app/_services/order/order-display.service';

import { OrderService } from '@app/_services/order/order.service';
import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component, ViewChild, SimpleChange, OnInit } from '@angular/core';
import { TableComponent } from '@app/_components/helpers/table/table.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OrderSearchService } from '@app/_services/order/order-search.service';

@Component({
  selector: 'app-order-desktop',
  templateUrl: './order-desktop.component.html',
  styleUrls: ['./order-desktop.component.scss'],
  animations: [
    trigger('filterExpand', [
      state('collapsed', style({ width: '0px', minWidth: '0', visibility: 'hidden', padding: '0px' })),
      state('expanded', style({ width: '*', visibility: 'visible', padding: '10px' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
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
