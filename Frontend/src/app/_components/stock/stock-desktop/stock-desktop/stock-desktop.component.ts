import { SupplierService } from '@app/_services/supplier/supplier.service';
import { TableComponent } from '@app/_components/helpers/table/table.component';

import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component, ViewChild, AfterViewInit, SimpleChange } from '@angular/core';
import { StockCreateComponent } from '@app/_components/stock/stock-create/stock-create.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StockDisplayService } from '@app/_services/stock/stock-display.service';

@Component({
  selector: 'app-stock-desktop',
  templateUrl: './stock-desktop.component.html',
  styleUrls: ['./stock-desktop.component.scss'],
  animations: [
    trigger('filterExpand', [
      state('collapsed', style({ width: '0px', minWidth: '0', visibility: 'hidden', padding: '0px' })),
      state('expanded', style({ width: '*', visibility: 'visible', padding: '10px' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
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

  public init() {
    this.serviceSupplier.load(false);
  }
}
