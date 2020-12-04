import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Order } from '@app/_models/order';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { StockService } from '@app/_services/stock/stock.service';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { OrderService } from '@app/_services/order/order.service';
import { BrewService } from '@app/_services/brew/brew.service';
import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component, ViewChild, SimpleChange, OnInit } from '@angular/core';
import { TableComponent } from '@app/_components/helpers/table/table.component';
import { StockSearchService } from '@app/_services/stock/stock-search.service';
import { BrewSearchService } from '@app/_services/brew/brew-search.service';

@Component({
  selector: 'app-order-desktop',
  templateUrl: './order-desktop.component.html',
  styleUrls: ['./order-desktop.component.scss']
})
export class OrderDesktopComponent extends ChildBaseComponent<undefined>{
  @ViewChild('tableComponent') tableComponent: TableComponent;
  loadStockAndBrewFormOrder = false;
  get orderService() { return this.service as OrderService; }

  public selectedOrders = new Array<Order>();
  public formSelectedOrder = new FormControl(0);
  private selectedChangeSubscription: Subscription;
  constructor(
    public dialog: MatDialog,
    public brewService: BrewService,
    public supplierService: SupplierService,
    public stockService: StockService,
    public ingredientService: IngredientService,
  ) {
    super(dialog, undefined);
  }

  private orderSelectedChange(order: Order) {
    if (order.state === 'created') {
      this.initServices();
    }
    const index = this.selectedOrders.findIndex(x => x.id === order?.id);
    if (index >= 0) {
      this.formSelectedOrder.setValue(index + 1);
    } else {
      this.selectedOrders.push(order);
      this.formSelectedOrder.setValue(this.selectedOrders.length);
    }
  }

  public init() {
    this.selectedChangeSubscription = this.orderService.selectedChange.subscribe(
      order => { this.orderSelectedChange(order); });
  }

  public onDestroy() {
    this.formSelectedOrder.setValue(0);
    this.selectedOrders.splice(0, this.selectedOrders.length);
    if (this.selectedChangeSubscription) { this.selectedChangeSubscription.unsubscribe(); }
  }

  public endUpdate(change: SimpleChange) {
    this.tableComponent.endUpdate(change);
    if (change && change.previousValue === null) {
      this.selectedOrders.push(change.currentValue as Order);
      this.formSelectedOrder.setValue(this.selectedOrders.length);
    }
  }

  public closeTab(event: MouseEvent, order: Order, index: number) {
    event.stopPropagation();
    if (order.state === 'created') {
      this.loadStockAndBrewFormOrder = false;
    }
    this.formSelectedOrder.setValue(0);
    this.selectedOrders.splice(index, 1);
  }

  public addNewOrder(): void {
    this.initServices();
    let index = this.service.model.findIndex(x => x.state === 'created');
    if (index >= 0) {
      index = this.selectedOrders.findIndex(x => x.state === 'created');
      if (index >= 0) {
        this.formSelectedOrder.setValue(index + 1);
      } else {
        this.selectedOrders.push(this.service.model[index]);
        this.formSelectedOrder.setValue(this.selectedOrders.length);
      }
    } else {
      this.orderService.createOrder();
    }
  }

  private initServices() {
    if (this.loadStockAndBrewFormOrder === false) {
      this.ingredientService.initEnums();
      this.brewService.model = undefined;
      this.stockService.model = undefined;
      this.supplierService.load(true);
      (this.stockService.search as StockSearchService).stockSearch.addState('ordered');
      (this.stockService.search as StockSearchService).stockSearch.addState('stocked');
      this.stockService.load(true);
      (this.brewService.search as BrewSearchService).brewSearch.addState('planed');
      (this.brewService.search as BrewSearchService).brewSearch.order('started', 'asc');
      this.brewService.load(true);
      this.loadStockAndBrewFormOrder = true;
    }
  }
}
