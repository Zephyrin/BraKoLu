import { StockNotOrder } from './../../../_models/order';
import { StockService } from './../../../_services/stock/stock.service';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BrewStock, Brew } from '@app/_models/brew';
import { Order } from '@app/_models/order';
import { OrderService } from '@app/_services/order/order.service';
import { BrewService } from '@app/_services/brew/brew.service';
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { DataSource } from '@angular/cdk/table';
import { IngredientStock, Ingredient } from '@app/_models';
import { CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-order-pronostic',
  templateUrl: './order-pronostic.component.html',
  styleUrls: ['./order-pronostic.component.scss']
})
export class OrderPronosticComponent implements OnInit, AfterViewInit {
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      const arrOptions = this.brews.options.toArray();
      this.order.stocks.forEach(stock => {
        stock.brewStocks.forEach(brewStock => {
          const index = this.brews.selectedOptions.selected.findIndex(x => x.value.id === brewStock.brew.id);
          if (index < 0) {
            const value = arrOptions.find(x => x.value.id === brewStock.brew.id);
            if (value) {
              this.brews.selectedOptions.select(value);
            }
          }
        });
      });
    });
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

  dropIntoBrewStock(event: CdkDragDrop<BrewStock[]>, tableOrder: TableOrder) {
    if (event.previousContainer === event.container) {
      return;
    } else {
      const brewOrder = (event.item.data as BrewStock);
      let brewStock: BrewStock;
      tableOrder.brewStock.forEach(bStock => {
        if (bStock.stock.ingredient.id === brewOrder.stock.ingredient.id
          && bStock.brew.id === brewOrder.brew.id) {
          brewStock = bStock;
        }
      });
      const obs = this.service.brewOrderToStock(brewOrder, brewStock, tableOrder.order);
      obs?.subscribe(() => {
        if (brewOrder.quantity <= tableOrder.quantityInStock) {
          brewStock.quantity = brewOrder.quantity;
          tableOrder.quantityInStock -= brewOrder.quantity;
          brewOrder.quantity = 0;
        } else {
          brewStock.quantity = brewOrder.quantity - tableOrder.quantityInStock;
          tableOrder.quantityInStock = 0;
          brewOrder.quantity -= brewStock.quantity;
        }
        tableOrder.currentStock.quantity -= brewStock.quantity;
      });
    }
  }

  dropIntoBrewOrder(event: CdkDragDrop<BrewStock[]>, tableOrder: TableOrder) {
    if (event.previousContainer === event.container) {
      return;
    } else {
      const brewStock = event.item.data;
      let brewOrder: BrewStock;
      tableOrder.brewOrder.forEach(bOrder => {
        if (bOrder.stock.ingredient.id === brewStock.stock.ingredient.id
          && bOrder.brew.id === brewStock.brew.id) {
          brewOrder = bOrder;
        }
      });
      this.service.brewStockToOrder(brewStock, brewOrder, tableOrder.order)?.subscribe(() => {
        if (brewOrder) {
          brewOrder.quantity += brewStock.quantity;
          tableOrder.quantityInStock += brewStock.quantity;
          tableOrder.currentStock.quantity += brewStock.quantity;
          brewStock.quantity = 0;
        }
      });
    }

  }

  compareWithId(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  updateMoreQuantity(evt: any, tableOrder: TableOrder) {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      tableOrder.currentStock.quantity += +evt.srcElement.value;
      tableOrder.currentStock.quantity -= tableOrder.quantityMoreOrder;
      tableOrder.quantityMoreOrder = +evt.srcElement.value;
      this.inputIntervalBeforeSave = undefined;
      this.stockService.update('quantity', tableOrder.currentStock, tableOrder.currentStock.quantity);
    }, 300);
  }

  updatePrice(evt: any, tableOrder: TableOrder) {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      this.stockService.update('price', tableOrder.currentStock, evt.srcElement.value);
      this.inputIntervalBeforeSave = undefined;
    }, 300);
  }

  updateSupplier(evt: any, tableOrder: TableOrder) {
    this.stockService.update('supplier', tableOrder.currentStock, evt.value === null ? null : evt.value?.id);
  }
}

export class TableOrder {
  ingredient: Ingredient;
  stocks: IngredientStock[];
  brewStock: BrewStock[];
  brewOrder: BrewStock[];
  currentStock: IngredientStock;
  order: Order;
  quantityMinOrder: number;
  quantityMoreOrder = 0;
  quantityInStock: number;
  brewList: Brew[];
  constructor(ingredient: Ingredient, brewList: Brew[], order: Order) {
    this.ingredient = ingredient;
    this.stocks = new Array<IngredientStock>();
    this.brewStock = new Array<BrewStock>();
    this.brewOrder = new Array<BrewStock>();
    this.brewList = brewList;
    this.order = order;
  }

  public addStock(stock: IngredientStock) {
    this.stocks.push(stock);
    if (!this.quantityInStock) { this.quantityInStock = 0; }
    let quantityUsed = 0;
    let quantityUsedByCreated = 0;

    stock.brewStocks.forEach(brewStock => {
      const index = this.brewList.findIndex(x => x.id === brewStock.brew.id);
      if (index >= 0) {
        if (stock.state === 'stock') {
          this.brewStock.push(brewStock);
          quantityUsed += brewStock.quantity;
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
      this.currentStock = stock;
      this.quantityMoreOrder = this.currentStock.quantity - quantityUsedByCreated;
    }
  }

  public addBrewStock(brewStock: BrewStock) {
    if (this.stocks.findIndex(x => x.id === brewStock.stock.id) < 0) {
      this.stocks.push(brewStock.stock);
      if (!this.quantityInStock) { this.quantityInStock = 0; }
      this.quantityInStock += brewStock.stock.quantity;
    }
    this.brewStock.push(brewStock);
    this.quantityInStock -= brewStock.quantity;
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
        tableIngredient = new TableOrder(ingredient, this.brewList, order);
        src.push(tableIngredient);
      }
      tableIngredient.addStock(stock);
    });
    order.stockNotOrders.forEach(stockNotOrder => {
      const ingredient = stockNotOrder.brewStock.stock.ingredient;
      let tableIngredient = src.find(x => x.ingredient.id === ingredient.id);
      if (!tableIngredient) {
        tableIngredient = new TableOrder(ingredient, this.brewList, order);
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
