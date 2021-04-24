import { Observable, Subscription } from 'rxjs';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { StockDisplayService } from '@app/_services/stock/stock-display.service';
import { StockService } from '@app/_services/stock/stock.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BaseComponent } from '@app/_components/base-component';
import { Component, OnDestroy } from '@angular/core';
import { StockSearchService } from '@app/_services/stock/stock-search.service';
import { Supplier } from '@app/_models/supplier';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent extends BaseComponent implements OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isSmallScreen$ = this.breakpointObserver.observe('(max-width: 950px)').pipe(
    map(result => result.matches),
    shareReplay()
  );
  private isSmallScreenSubscription: Subscription;
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
    this.isSmallScreenSubscription = this.isSmallScreen$.subscribe(isSmallScreen => {
      if (isSmallScreen) {
        this.display.viewList();
      }
    });
  }

  ngOnDestroy() {
    if (this.isSmallScreenSubscription) { this.isSmallScreenSubscription.unsubscribe(); }
  }

  public selectedSuppliersChange(suppliers: Supplier[]) {
    ((this.service as StockService).search as StockSearchService).updateSuppliers(suppliers);
  }

  public selectedStatesChange(states: string[]) {
    ((this.service as StockService).search as StockSearchService).updateStates(states);
  }
}
