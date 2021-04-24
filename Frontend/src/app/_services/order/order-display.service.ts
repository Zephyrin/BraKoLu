import { OrderService } from '@app/_services/order/order.service';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { StockService } from '@app/_services/stock/stock.service';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { BrewService } from '@app/_services/brew/brew.service';
import { Injectable, SimpleChange, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Order } from '@app/_models/order';
import { Ingredient } from '@app/_models/ingredient';

import { StockSearchService } from '@app/_services/stock/stock-search.service';
import { BrewSearchService } from '@app/_services/brew/brew-search.service';
import { IngredientStock } from '@app/_models';
@Injectable({
  providedIn: 'root'
})
export class OrderDisplayService {

  public selectedOrders = new Array<Order>();
  public formSelectedOrder = new FormControl(0);
  public hasNewOrder = false;
  public newOrderOpen = false;
  public brewExpanded = true;
  public filterOrder = true;
  public launchOrder = new EventEmitter<any>();
  public addIngredientToOrderSignal = new EventEmitter<Ingredient>();
  private selectedChangeSubscription: Subscription;
  loadStockAndBrewFormOrder = false;


  constructor(
    public brewService: BrewService,
    public supplierService: SupplierService,
    public stockService: StockService,
    public ingredientService: IngredientService,
    public orderService: OrderService
  ) { }

  private orderSelectedChange(order: Order) {
    if (order.state === 'created') {
      this.initServices();
    } else {
      this.newOrderOpen = false;
    }
    const index = this.selectedOrders.findIndex(x => x.id === order?.id);
    if (index >= 0) {
      this.formSelectedOrder.setValue(index + 1);
    } else {
      this.selectedOrders.push(order);
      this.formSelectedOrder.setValue(this.selectedOrders.length);
    }
  }
  public changeSelectedIndex(index: number) {
    this.formSelectedOrder.setValue(index);
    // Le 0 est pour l'onglets des commandes. Donc décalage de 1...
    if (index > 0 && index <= this.selectedOrders.length) {
      const order = this.selectedOrders[index - 1];
      if (order.state === 'created') {
        this.initServices();
      } else {
        this.newOrderOpen = false;
      }
    } else { this.newOrderOpen = false; }
  }

  public init() {
    this.selectedChangeSubscription = this.orderService.selectedChange.subscribe(
      order => { this.orderSelectedChange(order); });
  }

  public destroy() {
    this.formSelectedOrder.setValue(0);
    this.selectedOrders.splice(0, this.selectedOrders.length);
    this.changeSelectedIndex(0);
    this.loadStockAndBrewFormOrder = false;
    if (this.selectedChangeSubscription) { this.selectedChangeSubscription.unsubscribe(); }
  }

  public endUpdate(change: SimpleChange) {
    if (change === undefined) {
      const index = this.orderService.model.findIndex(x => x.state === 'created');
      if (index >= 0) {
        this.hasNewOrder = true;
      }
    } else if (change && change.previousValue === null) {
      this.selectedOrders.push(change.currentValue as Order);
      this.formSelectedOrder.setValue(this.selectedOrders.length);
    } else if (change && (change.currentValue === null || change.currentValue === undefined)) {
      const index = this.selectedOrders.findIndex(x => x.id === change.previousValue.id);
      if (index >= 0) { this.selectedOrders.splice(index, 1); }
    } else {
      if (change.previousValue.state === 'created' && change.currentValue.state !== 'created') {
        this.hasNewOrder = false;
      }
    }
  }

  public closeTab(event: MouseEvent, order: Order, index: number) {
    event.stopPropagation();
    if (order.state === 'created') {
      this.loadStockAndBrewFormOrder = false;
      this.newOrderOpen = false;
    }
    this.formSelectedOrder.setValue(0);
    this.selectedOrders.splice(index, 1);
  }


  public addNewOrder(): void {
    const index = this.orderService.model.findIndex(x => x.state === 'created');
    if (index >= 0) {
      const indexSelected = this.selectedOrders.findIndex(x => x.state === 'created');
      if (indexSelected >= 0) {
        this.formSelectedOrder.setValue(indexSelected + 1);
      } else {
        this.selectedOrders.push(this.orderService.model[index]);
        this.formSelectedOrder.setValue(this.selectedOrders.length);
      }
    } else {
      this.loadStockAndBrewFormOrder = false;
      this.orderService.createOrder();
    }
    this.initServices();
  }

  public launchOrderClick($event: any): void {
    this.launchOrder.emit($event);
  }

  private initServices() {
    this.newOrderOpen = true;
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

  public addIngredientToOrder(newIngredient: Ingredient): void {
    this.addIngredientToOrderSignal.emit(newIngredient);
  }
}
