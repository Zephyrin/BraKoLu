import { SupplierService } from '@app/_services/supplier/supplier.service';
import { StockDisplayService } from '@app/_services/stock/stock-display.service';
import { StockService } from '@app/_services/stock/stock.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BaseComponent } from '@app/_components/base-component';
import { Component } from '@angular/core';
import { StockSearchService } from '@app/_services/stock/stock-search.service';
import { Supplier } from '@app/_models/supplier';
import { filterExpand } from '@app/_components/animations/filter-animation';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  animations: [
    filterExpand
  ]
})
export class StockComponent extends BaseComponent {

  constructor(
    protected breakpointObserver: BreakpointObserver,
    public service: StockService,
    public display: StockDisplayService,
    public supplierService: SupplierService
  ) {
    super(breakpointObserver, service);
  }

  public init() {
    this.supplierService.load(true);
  }

  public selectedSuppliersChange(suppliers: Supplier[]) {
    ((this.service as StockService).search as StockSearchService).updateSuppliers(suppliers);
  }

  public selectedStatesChange(states: string[]) {
    ((this.service as StockService).search as StockSearchService).updateStates(states);
  }
}
