import { StockService } from './../../../_services/stock/stock.service';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BrewStock, Brew } from '@app/_models/brew';
import { Order } from '@app/_models/order';
import { OrderService } from '@app/_services/order/order.service';
import { BrewService } from '@app/_services/brew/brew.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { DataSource } from '@angular/cdk/table';
import { IngredientStock, Ingredient } from '@app/_models';
import { CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-order-pronostic',
  templateUrl: './order-pronostic.component.html',
  styleUrls: ['./order-pronostic.component.scss']
})
export class OrderPronosticComponent implements OnInit {
  @ViewChild('brews') brews: MatSelectionList;
  @Input() order: Order;
  @Input() brewService: BrewService;
  @Input() service: OrderService;
  @Input() supplierService: SupplierService;
  dataSourceOrder = new DataSourceOrder();
  brewList = new Array<Brew>();
  private inputIntervalBeforeSave: any;

  constructor(public stockService: StockService) {
  }

  ngOnInit(): void {
    this.service.setBrewList(this.brewList, this.brewService.model, this.order);
    this.dataSourceOrder.setSelectedBrewList(this.brewList);
    this.dataSourceOrder.updateSource(this.order);
  }

  pronostic(): void {
    const brews = [];
    this.brewList.forEach(brew => {
      if (this.brews.selectedOptions.selected.findIndex(x => x.value.id === brew.id) >= 0) {
        brews.push(brew);
      }
    });
    this.service.getPronostic(brews, this.order, this.dataSourceOrder);
  }

  drop(event: CdkDragDrop<Brew[]>) {
    moveItemInArray(this.brewList, event.previousIndex, event.currentIndex);
  }

  updateMoreQuantity(evt: any, tableOrder: TableOrder) {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      tableOrder.order.quantity += +evt.srcElement.value;
      tableOrder.order.quantity -= tableOrder.quantityMoreOrder;
      tableOrder.quantityMoreOrder = +evt.srcElement.value;
      this.inputIntervalBeforeSave = undefined;
      this.stockService.update('quantity', tableOrder.order, tableOrder.order.quantity);
    }, 300);
  }

  updatePrice(evt: any, tableOrder: TableOrder) {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      this.stockService.update('price', tableOrder.order, evt.srcElement.value);
      this.inputIntervalBeforeSave = undefined;
    }, 300);
  }

  updateSupplier(evt: any, tableOrder: TableOrder) {
    this.stockService.update('supplier', tableOrder.order, evt.value.id);
  }
}

export class TableOrder {
  ingredient: Ingredient;
  stock: IngredientStock[];
  brewStock: BrewStock[];
  brewOrder: BrewStock[];
  order: IngredientStock;
  quantityMinOrder: number;
  quantityMoreOrder = 0;
  quantityInStock: number;
  brewList: Brew[];
  constructor(ingredient: Ingredient, brewList: Brew[]) {
    this.ingredient = ingredient;
    this.stock = new Array<IngredientStock>();
    this.brewStock = new Array<BrewStock>();
    this.brewOrder = new Array<BrewStock>();
    this.brewList = brewList;
  }

  public addStock(stock: IngredientStock) {
    this.stock.push(stock);
    if (!this.quantityInStock) { this.quantityInStock = 0; }
    let quantityUsed = 0;
    let quantityUsedByCreated = 0;

    stock.brewStocks.forEach(brewStock => {
      const index = this.brewList.findIndex(x => x.id === brewStock.brew.id);
      if (index >= 0) {
        if (stock.state === 'stock') {
          this.brewStock.push(brewStock);
        } else {
          this.brewOrder.push(brewStock);
          quantityUsedByCreated += brewStock.quantity;
        }
      } else {
        if (brewStock.id && !brewStock.apply) {
          quantityUsed += brewStock.quantity;
        }
      }
    });
    if (stock.state === 'stocked') {
      this.quantityInStock += stock.quantity - quantityUsed;
    }
    if (stock.state === 'created') {
      this.order = stock;
      this.quantityMoreOrder = this.order.quantity - quantityUsedByCreated;
    }
  }

  public addBrewStock(brewStock: BrewStock) {
    if (this.stock.findIndex(x => x.id === brewStock.stock.id) < 0) {
      this.stock.push(brewStock.stock);
      if (!this.quantityInStock) { this.quantityInStock = 0; }
      this.quantityInStock = brewStock.stock.quantity;
    }
    this.brewStock.push(brewStock);
  }
}
export class DataSourceOrder extends DataSource<TableOrder> {
  source = new BehaviorSubject<TableOrder[]>([]);
  brewList: Brew[];
  public setSelectedBrewList(brewList: Array<Brew>) {
    this.brewList = brewList;
  }
  public updateSource(order: Order) {
    const src = new Array<TableOrder>();
    order.stocks.forEach(stock => {
      const ingredient = stock.ingredient;
      let tableIngredient = src.find(x => x.ingredient.id === ingredient.id);
      if (!tableIngredient) {
        tableIngredient = new TableOrder(ingredient, this.brewList);
        src.push(tableIngredient);
      }
      tableIngredient.addStock(stock);
    });
    order.stockNotOrders.forEach(stockNotOrder => {
      const ingredient = stockNotOrder.brewStock.stock.ingredient;
      let tableIngredient = src.find(x => x.ingredient.id === ingredient.id);
      if (!tableIngredient) {
        tableIngredient = new TableOrder(ingredient, this.brewList);
        src.push(tableIngredient);
      }
      tableIngredient.addBrewStock(stockNotOrder.brewStock);
    });
    this.source.next(src);
  }
  connect(collectionViewer: CollectionViewer): Observable<TableOrder[] | readonly TableOrder[]> {
    return this.source.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.source.complete();
  }
}
