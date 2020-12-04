import { SupplierService } from '@app/_services/supplier/supplier.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Order } from '@app/_models/order';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { BrewIngredient } from '@app/_models/brew';
import { ValueViewChild } from '@app/_services/iservice';
import { OrderService } from '@app/_services/order/order.service';
import { StockService } from '@app/_services/stock/stock.service';
import { BrewService } from '@app/_services/brew/brew.service';
import { Component, OnInit, OnDestroy, Input, SimpleChange } from '@angular/core';
import { Ingredient, IngredientStock, Supplier } from '@app/_models';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-order-detail-creation',
  templateUrl: './order-detail-creation.component.html',
  styleUrls: ['./order-detail-creation.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class OrderDetailCreationComponent implements OnInit, OnDestroy {
  accordionOrder = new Array<AccordionOrder>();
  brewSubscription: Subscription;
  stockSubscription: Subscription;
  @Input() order: Order;

  public headersStock: ValueViewChild[];
  public displayedColumnsStock = new Array<string>();
  public headersBrewIngredient = new Array<ValueViewChild>();
  public displayedColumnsBrewIngredient = new Array<string>();
  public undefValue = undefined;
  private inputIntervalBeforeSave: any;

  constructor(
    public brewService: BrewService,
    public stockService: StockService,
    public orderService: OrderService,
    public ingredientService: IngredientService,
    public supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.accordionOrder.splice(0, this.accordionOrder.length);
    this.headersStock = new Array<ValueViewChild>();
    this.headersStock.push({ value: 'ingredient', viewValue: 'Ingrédient' });
    this.headersStock.push({ value: 'quantityRecommanded', viewValue: 'Qt. Préconisée' });
    this.headersStock.push({ value: 'quantityOrder', viewValue: 'Qt. commandée' });
    this.headersStock.push({ value: 'price', viewValue: 'Prix' });
    this.headersStock.push({ value: 'supplier', viewValue: 'Fournisseur' });
    this.headersStock.push({ value: 'deliveryPlanned', viewValue: 'Livraison prévue le' });
    this.displayedColumnsStock.push('expanded');
    this.headersStock.forEach(val => { this.displayedColumnsStock.push(val.value); });
    this.displayedColumnsStock.push('action');
    this.headersBrewIngredient.push({ value: 'brewName', viewValue: 'Nom du brassin' });
    this.headersBrewIngredient.push({ value: 'quantity', viewValue: 'Quantité' });
    this.headersBrewIngredient.push({ value: 'quantityMissing', viewValue: 'Quantité manquante' });
    this.headersBrewIngredient.forEach(val => this.displayedColumnsBrewIngredient.push(val.value));
    this.brewSubscription = this.brewService.endUpdate.subscribe(change => {
      if (!change) { this.createPartIngredientType(); }
    });

    this.stockSubscription = this.stockService.endUpdate.subscribe(change => {
      if (!change) {
        // Initialisation
        this.createPartIngredientType();
      }
      else {
        // Mise à jour
        this.updateIngredientStock(change);
      }
    });

  }

  ngOnDestroy(): void {
    if (this.brewSubscription) { this.brewSubscription.unsubscribe(); }
    if (this.stockSubscription) { this.stockSubscription.unsubscribe(); }
  }

  createPartIngredientType() {
    if (this.brewService.model && this.stockService.model) {
      this.order.stocks.forEach(stock => {
        const childName = this.ingredientService.ingredientChildrenNames.find(x => x.value === stock.ingredient.childName);
        const indexAccordion = this.accordionOrder.findIndex(x => x.childName.value === childName.value);
        if (indexAccordion < 0) {
          const accordion = new AccordionOrder(childName, this.stockService, this.order);
          accordion.addStockOrder(stock);
          this.accordionOrder.push(accordion);
        } else {
          const accordion = this.accordionOrder[indexAccordion];
          accordion.addStockOrder(stock);
        }
      });
      this.brewService.model.forEach(brew => {
        brew.brewIngredients.forEach(brewIngredient => {
          if (brewIngredient.brew.state === 'planed') {
            let indexAccordion = this.accordionOrder.findIndex(x => x.childName.value === brewIngredient.ingredient.childName);
            if (indexAccordion < 0) {
              const childname = this.ingredientService.ingredientChildrenNames.find(x => x.value === brewIngredient.ingredient.childName);
              const accordion = new AccordionOrder(childname, this.stockService, this.order);
              const stock = new IngredientStock(undefined);
              stock.init(brewIngredient.ingredient, this.order);
              accordion.addStockOrder(stock);
              this.accordionOrder.push(accordion);
              indexAccordion = this.accordionOrder.length - 1;
            }
            this.accordionOrder[indexAccordion].addBrewIngredient(brewIngredient);
          }
        });
      });
    }
  }

  selectedRow(event: MouseEvent, orderStock: OrderStock) {
    event.stopPropagation();
    orderStock.expanded = !orderStock.expanded;
  }

  getDisplay(name: string, orderStock: OrderStock): string | number {
    switch (name) {
      case 'ingredient':
        return orderStock.ingredient.name;
      case 'quantityRecommanded':
        return (orderStock.quantityRecommanded / orderStock.ingredient.unitFactor) + ' ' + orderStock.ingredient.unit;
      case 'quantityOrder':
        return 'tmp';
      case 'price':
        return 'tmp';
      case 'supplier':
        return 'tmp';
      case 'deliveryPlanned':
        return 'tmp';
    }
    return 'non trouvé';
  }

  getDisplayBrewIngredient(name: string, brewIng: BrewIngredientOrder) {
    switch (name) {
      case 'brewName':
        return brewIng.brewIngredient.brew.number + ' - ' + brewIng.brewIngredient.brew.name;
      case 'quantity':
        return brewIng.brewIngredient.quantity;
      case 'quantityMissing':
        return brewIng.quantityLeft;
      default:
        break;
    }
    return 'non trouvé';
  }

  public compareId(c1: Supplier, c2: Supplier): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  public addNewStockOrder(event: MouseEvent, row: OrderStock): void {
    event.stopPropagation();
    row.addOrderStock(undefined);
  }

  public removeStockOrder(event: MouseEvent, row: OrderStock, index: number): void {
    event.stopPropagation();
    if (index >= 0 && index <= row.orderStocks.length) {
      row.updateQuantity(row.orderStocks[index], 0);
      if (row.orderStocks[index].id > 0) {
        this.stockService.update(undefined, row.orderStocks[index], undefined);
      }
      row.orderStocks.splice(index, 1);
    }
  }

  private updateIngredientStock(change: SimpleChange) {
    if (change.previousValue && !change.previousValue[`id`]) {
      // C'est un ajout. Sinon c'est un update et ça devrait être bon par le process de IService.
      const indexAcc = this.accordionOrder.findIndex(x => x.childName.value === change.previousValue.ingredient.childName);
      if (indexAcc >= 0) {
        const row = this.accordionOrder[indexAcc];
        const indexRow = row.orderStocks.findIndex(x => x.ingredient.id === change.previousValue.ingredient.id);
        if (indexRow >= 0) {
          const orderStock = row.orderStocks[indexRow];
          const index = orderStock.orderStocks.findIndex(x => x === change.previousValue);
          if (index >= 0) {
            orderStock.orderStocks[index] = change.currentValue;
          }
        }
      }
    }
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

  public updateStockSupplier(evt: MatSelectChange, orderStock: OrderStock, stock: IngredientStock, name: string): void {
    this.stockService.update('supplier', stock, evt.value, true);
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
}

class AccordionOrder {
  childName: ValueViewChild;
  orderStocks = new Array<OrderStock>();
  stockService: StockService;
  order: Order;
  expanded = false;
  public constructor(
    childName: ValueViewChild,
    stockService: StockService,
    order: Order
  ) {
    this.childName = childName;
    this.stockService = stockService;
    this.order = order;
  }

  public addStockOrder(stock: IngredientStock) {
    const index = this.orderStocks.findIndex(x => x.ingredient.id === stock.ingredient.id);
    if (index < 0) {
      const orderStock = new OrderStock(stock.ingredient, this.order, stock, this.stockService);
      this.orderStocks.push(orderStock);
    } else {
      this.orderStocks[index].addOrderStock(stock);
    }
  }

  public addBrewIngredient(brewIngredient: BrewIngredient) {
    let index = this.orderStocks.findIndex(x => x.ingredient.id === brewIngredient.ingredient.id);
    if (index < 0) {
      const orderStock = new OrderStock(brewIngredient.ingredient, this.order, undefined, this.stockService);
      this.orderStocks.push(orderStock);
      index = this.orderStocks.length - 1;
    }
    this.orderStocks[index].addBrewIngredient(brewIngredient);
    if (this.orderStocks[index].expanded) {
      this.expanded = true;
    }
  }
}

class DataSourceStock extends DataSource<OrderStock> {
  source = new BehaviorSubject<OrderStock[]>([]);
  connect(collectionViewer: CollectionViewer): Observable<OrderStock[] | readonly OrderStock[]> {
    return this.source.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.source.value.splice(0, this.source.value.length);
    this.source.complete();
  }
}

class OrderStock {
  order: Order;
  ingredient: Ingredient;
  orderStocks = new Array<IngredientStock>();
  inStocks = new Array<IngredientStock>();
  inOrders = new Array<IngredientStock>();
  quantityInStock = 0;
  quantityNeeded = 0;
  quantityRecommanded = 0;
  brewIngredients = new Array<BrewIngredientOrder>();
  stockService: StockService;
  expanded = false;
  public constructor(ingredient: Ingredient, order: Order, stock: IngredientStock, stockService: StockService) {
    this.ingredient = ingredient;
    this.order = order;
    this.addOrderStock(stock);
    this.stockService = stockService;
    const stocks = this.stockService.model.filter(x => x.ingredient.id === this.ingredient.id);
    stocks.forEach(inStock => {
      if (inStock.state === 'stocked') {
        this.inStocks.push(inStock);
        this.quantityInStock += inStock.quantity;
      }
      if (inStock.state === 'ordered') {
        this.inOrders.push(inStock);
      }
    });
  }

  public addOrderStock(stock: IngredientStock) {
    if (stock === undefined) {
      stock = new IngredientStock(undefined);
      stock.init(this.ingredient, this.order);
    }
    if (!stock.quantity) { stock.quantity = 0; }
    this.orderStocks.push(stock);
  }

  public addBrewIngredient(brewIngredient: BrewIngredient) {
    let quantityOrder = 0;
    let quantityInOrder = 0;
    this.orderStocks.forEach(stock => {
      if (stock.deliveryScheduledFor === undefined || stock.deliveryScheduledFor === null) {
        quantityOrder += stock.quantity;
      } else if (stock.deliveryScheduledFor < brewIngredient.brew.started) {
        quantityOrder += stock.quantity;
      }
    });
    this.inOrders.forEach(stock => {
      if (stock.deliveryScheduledFor === undefined || stock.deliveryScheduledFor === null) {
        quantityInOrder += stock.quantity;
      } else if (stock.deliveryScheduledFor > brewIngredient.brew.started) {
        quantityInOrder += stock.quantity;
      }
    });

    this.brewIngredients.push(new BrewIngredientOrder(brewIngredient,
      (this.quantityInStock + quantityOrder + quantityInOrder) - this.quantityNeeded)
    );
    this.quantityNeeded += brewIngredient.quantity;
    if (this.quantityInStock + quantityInOrder > this.quantityNeeded) { this.quantityRecommanded = 0; }
    else if (this.quantityInStock + quantityInOrder > 0 && this.quantityNeeded > this.quantityInStock + quantityInOrder) {
      this.quantityRecommanded = this.quantityNeeded - (this.quantityInStock + quantityInOrder);
    } else {
      this.quantityRecommanded = this.quantityNeeded;
    }
    if (this.brewIngredients[this.brewIngredients.length - 1].quantityLeft > 0) {
      this.expanded = true;
    }
  }

  public updateQuantity(iStock: IngredientStock, quantity: number) {
    if (iStock && quantity) { iStock.quantity = quantity; }
    let quantityUsed = 0;
    this.brewIngredients.forEach(brewIngredient => {
      let quantityOrder = 0;
      this.orderStocks.forEach(stock => {
        if (stock.deliveryScheduledFor === undefined || stock.deliveryScheduledFor === null) {
          quantityOrder += stock.quantity;
        } else if (stock.deliveryScheduledFor < brewIngredient.brewIngredient.brew.started) {
          quantityOrder += stock.quantity;
        }
      });
      this.inOrders.forEach(stock => {
        if (stock.deliveryScheduledFor === undefined || stock.deliveryScheduledFor === null) {
          quantityOrder += stock.quantity;
        } else if (stock.deliveryScheduledFor > brewIngredient.brewIngredient.brew.started) {
          quantityOrder += stock.quantity;
        }
      });
      brewIngredient.quantityLeft = brewIngredient.brewIngredient.quantity;
      if (quantityOrder + this.quantityInStock - quantityUsed >= brewIngredient.quantityLeft) {
        quantityUsed += brewIngredient.quantityLeft;
        brewIngredient.quantityLeft = 0;
      } else {
        brewIngredient.quantityLeft -= (quantityOrder + this.quantityInStock - quantityUsed);
        quantityUsed += brewIngredient.brewIngredient.quantity - brewIngredient.quantityLeft;
      }
    });
  }
}

class BrewIngredientOrder {
  brewIngredient: BrewIngredient;
  quantityLeft: number;

  public constructor(brewIngredient: BrewIngredient, quantityLeft: number) {
    this.brewIngredient = brewIngredient;
    if (quantityLeft >= brewIngredient.quantity) {
      this.quantityLeft = 0;
    } else if (quantityLeft >= 0) {
      this.quantityLeft = brewIngredient.quantity - quantityLeft;
    } else {
      this.quantityLeft = brewIngredient.quantity;
    }
  }
}
