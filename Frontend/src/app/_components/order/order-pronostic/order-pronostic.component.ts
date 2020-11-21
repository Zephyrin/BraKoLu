import { RemoveDialogComponent } from '@app/_components/helpers/remove-dialog/remove-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { BrewIngredientCreateComponent } from '@app/_components/brew/brew-ingredient-create/brew-ingredient-create.component';
import { StockService } from '@app/_services/stock/stock.service';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BrewStock, Brew } from '@app/_models/brew';
import { Order } from '@app/_models/order';
import { OrderService } from '@app/_services/order/order.service';
import { BrewService } from '@app/_services/brew/brew.service';
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { DataSource } from '@angular/cdk/table';
import { IngredientStock, Ingredient } from '@app/_models';
import { CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

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
  @Input() ingredientService: IngredientService;
  private afterClosedSubscription: Subscription;
  dataSourceOrder = new DataSourceOrder();
  brewList = new Array<Brew>();
  private inputIntervalBeforeSave: any;

  constructor(public stockService: StockService, public dialog: MatDialog) {
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
      const quantityInStock = tableOrder.quantityInStock;
      const currentStockQuantity = tableOrder.currentStock.quantity;
      const brewOrderQuantity = brewOrder.quantity;
      let brewStockQuantity = 0;
      tableOrder.brewStock.forEach(bStock => {
        if (bStock.stock.ingredient.id === brewOrder.stock.ingredient.id
          && bStock.brew.id === brewOrder.brew.id) {
          brewStock = bStock;
          brewStockQuantity = brewStock.quantity;
        }
      });
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
      this.service.brewOrderToStock(brewOrder, brewStock, tableOrder.order);
      /* Pour le moment crée un doublons d'appel. À voir comment faire pour gérer
      les erreurs */
      /* obs?.subscribe(() => { }, () => {
        tableOrder.quantityInStock = quantityInStock;
        tableOrder.currentStock.quantity = currentStockQuantity;
        brewOrder.quantity = brewOrderQuantity;
        if (brewStock) { brewStock.quantity = brewStockQuantity; }
      }); */
    }
  }

  dropIntoBrewOrder(event: CdkDragDrop<BrewStock[]>, tableOrder: TableOrder) {
    if (event.previousContainer === event.container) {
      return;
    } else {
      const brewStock = event.item.data;
      let brewOrder: BrewStock;
      const brewStockQuantity = brewStock.quantity;
      const quantityInStock = tableOrder.quantityInStock;
      const quantityOrder = tableOrder.currentStock.quantity;
      let brewOrderQuantity = 0;
      tableOrder.brewOrder.forEach(bOrder => {
        if (bOrder.stock.ingredient.id === brewStock.stock.ingredient.id
          && bOrder.brew.id === brewStock.brew.id) {
          brewOrder = bOrder;
          brewOrderQuantity = brewOrder.quantity;
        }
      });
      if (brewOrder) {
        brewOrder.quantity += brewStock.quantity;
        tableOrder.quantityInStock += brewStock.quantity;
        tableOrder.currentStock.quantity += brewStock.quantity;
        brewStock.quantity = 0;
      }
      this.service.brewStockToOrder(brewStock, brewOrder, tableOrder.order);
      /* ?.subscribe(() => { }, err => {
      brewStock.quantity = brewStockQuantity;
      tableOrder.quantityInStock = quantityInStock;
      tableOrder.currentStock.quantity = quantityOrder;
      if (brewOrder) { brewOrder.quantity = brewOrderQuantity; }
    }); */
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

  addIngredient() {
    if (this.order) {
      const dialogRef = this.dialog.open(BrewIngredientCreateComponent, { minWidth: '30em' });
      (dialogRef.componentInstance as unknown as BrewIngredientCreateComponent)
        .ingredientService = this.ingredientService;
      this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.addIngredientToOrder(this.order, result, this.addIngredientSuccess, this);
        }
        if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
      });
    }
  }

  addIngredientSuccess(sender: OrderPronosticComponent, ingredientStock: IngredientStock) {
    sender.dataSourceOrder.addIngredientStock(ingredientStock, sender.order);
  }

  deleteIngredientStock(ingredientStock: IngredientStock) {
    if (this.order) {
      const dialogRef = this.dialog.open(RemoveDialogComponent, { minWidth: '30em' });
      (dialogRef.componentInstance as RemoveDialogComponent).title = ingredientStock.ingredient.name;
      this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
        if (result && result.data) {
          this.service.deleteIngredientToOrder(this.order, ingredientStock, this.deleteIngredientStockSuccess, this);
        }
        if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
      });
    }
  }

  deleteIngredientStockSuccess(sender: OrderPronosticComponent, id: number) {
    sender.dataSourceOrder.deleteIngredientSource(id);
  }
}

export class HelperTableOrder {
  stock: IngredientStock;
  quantity = 0;
  idsPointerForDropList = new Array<string>();

  constructor(stock: IngredientStock) {
    let quantity = 0;
    this.stock = stock;
    stock.brewStocks.forEach(x => {
      quantity += x.quantity;
    });
    this.quantity = stock.quantity - quantity;
  }

  public get getDropId(): string { return this.stock.state + '_' + this.stock.id; }
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

  stocksLink: HelperTableOrder[];
  stocksOrder: HelperTableOrder[];

  constructor(ingredient: Ingredient, brewList: Brew[], order: Order) {
    this.ingredient = ingredient;
    this.stocks = new Array<IngredientStock>();
    this.brewStock = new Array<BrewStock>();
    this.brewOrder = new Array<BrewStock>();
    this.stocksLink = new Array<HelperTableOrder>();
    this.stocksOrder = new Array<HelperTableOrder>();
    this.brewList = brewList;
    this.order = order;
  }

  public addStock(stock: IngredientStock) {
    this.stocks.push(stock);
    if (!this.quantityInStock) { this.quantityInStock = 0; }
    let quantityUsed = 0;
    let quantityUsedByCreated = 0;
    if (stock.state === 'stocked') {
      this.stocksLink.push(new HelperTableOrder(stock));
    } else {
      this.stocksOrder.push(new HelperTableOrder(stock));
    }

    stock.brewStocks.forEach(brewStock => {
      const index = this.brewList.findIndex(x => x.id === brewStock.brew.id);
      if (index >= 0) {
        if (stock.state === 'stocked') {
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

  public addIngredientStock(stock: IngredientStock, order: Order) {
    const ingredient = stock.ingredient;
    let tableIngredient = this.source.value.find(x => x.ingredient.id === ingredient.id);
    if (!tableIngredient) {
      tableIngredient = new TableOrder(ingredient, this.brewList, order);
      this.source.value.push(tableIngredient);
      this.source.next(this.source.value);
    }
    tableIngredient.addStock(stock);
  }

  public deleteIngredientSource(id: number) {
    const index = this.source.value.findIndex(x => x.currentStock.id === id);
    if (index >= 0) {
      this.source.value.splice(index, 1);
      this.source.next(this.source.value);
    }

  }

  connect(collectionViewer: CollectionViewer): Observable<TableOrder[] | readonly TableOrder[]> {
    return this.source.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.source.value.splice(0, this.source.value.length);
    this.source.complete();
  }
}