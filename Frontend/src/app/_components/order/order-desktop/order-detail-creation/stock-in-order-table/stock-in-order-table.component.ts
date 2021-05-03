import { Component, OnInit, ViewChild, OnDestroy, SimpleChange, Input } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { OrderStock } from '@app/_mapper/order/order-detail-creation';
import { IngredientStock, Supplier } from '@app/_models';
import { ValueViewChild } from '@app/_services';
import { StockService } from '@app/_services/stock/stock.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-in-order-table',
  templateUrl: './stock-in-order-table.component.html',
  styleUrls: ['./stock-in-order-table.component.scss']
})
export class StockInOrderTableComponent implements OnInit, OnDestroy {
  private inputIntervalBeforeSave: any;
  private stockSubscription: Subscription;
  public headersCreationStock: ValueViewChild[];
  public displayedColumnsCreationStock = new Array<string>();

  @Input() element: OrderStock;
  @Input() stocks: Array<IngredientStock>;
  @ViewChild('table') table: MatTable<any>;
  constructor(
    public stockService: StockService
  ) { }

  ngOnDestroy(): void {
    if (this.stockSubscription) { this.stockSubscription.unsubscribe(); }
  }

  ngOnInit(): void {
    this.headersCreationStock = new Array<ValueViewChild>();
    this.headersCreationStock.push({ value: 'quantity', viewValue: 'Quantité' });
    this.headersCreationStock.push({ value: 'supplier', viewValue: 'Fournisseur' });
    this.headersCreationStock.push({ value: 'deliveryAt', viewValue: 'Livraison prévu' });
    this.headersCreationStock.push({ value: 'price', viewValue: 'Prix' });
    this.headersCreationStock.push({ value: 'action', viewValue: '' });
    this.headersCreationStock.forEach(val => { this.displayedColumnsCreationStock.push(val.value); });
    this.stockSubscription = this.stockService.endUpdate.subscribe(change => {
      if (change) {
        this.updateIngredientStock(change);
      }
    });
  }

  private updateIngredientStock(change: SimpleChange) {
    // Todo optimiser le rendu uniquement sur la partie concernée.
    if (this.table) { this.table.renderRows(); }
  }

  public updateQuantity(evt: number, orderStock: OrderStock, stock: IngredientStock, name: string): void {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      let val = +evt;
      if (name === 'quantity') { val = val * stock.ingredient.unitFactor; }
      if (stock.id) { this.stockService.update(name, stock, val); }
      else {
        const old = stock[name];
        stock[name] = evt;
        this.stockService.update(undefined, stock, stock);
        stock[name] = old;
      }
      if (name === 'quantity') {
        orderStock.updateQuantity(stock, val);
      }
      this.inputIntervalBeforeSave = undefined;
    }, 300);
  }

  public updateStock(evt: any, orderStock: OrderStock, stock: IngredientStock, name: string): void {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      let val = +evt.srcElement.value;
      if (name === 'quantity') { val = val * stock.ingredient.unitFactor; }
      if (stock.id) { this.stockService.update(name, stock, val); }
      else {
        const old = stock[name];
        stock[name] = evt.srcElement.value;
        this.stockService.update(undefined, stock, stock);
        stock[name] = old;
      }
      if (name === 'quantity') {
        orderStock.updateQuantity(stock, val);
      }
      this.inputIntervalBeforeSave = undefined;
    }, 300);
  }

  public updateStockSupplier(supplier: Supplier, orderStock: OrderStock, stock: IngredientStock): void {
    this.stockService.update('supplier', stock, supplier, true);
  }

  updateDate(event: any, orderStock: OrderStock, stock: IngredientStock, date: string) {
    if (event.target.value) {
      this.stockService.update(date, stock, new Date(event.target.value));
      stock[date] = new Date(event.target.value);
    } else {
      this.stockService.update(date, stock, null);
      stock[date] = null;
    }
    orderStock.updateQuantity(undefined, undefined);
  }

  public removeStockOrder(event: MouseEvent, row: OrderStock, index: number): void {
    event.stopPropagation();
    if (index >= 0 && index < row.orderStocks.length) {
      row.updateQuantity(row.orderStocks[index], 0);
      if (row.orderStocks[index].id > 0) {
        this.stockService.update(undefined, row.orderStocks[index], undefined);
      }
      row.orderStocks.splice(index, 1);
    }
    if (row.orderStocks.length === 0) {
      row.addOrderStock(undefined);
    }
    if (this.table) { this.table.renderRows(); }
  }

  public addNewStockOrder(event: MouseEvent, row: OrderStock): void {
    event.stopPropagation();
    row.addOrderStock(undefined);
    if (this.table) { this.table.renderRows(); }
  }
}
