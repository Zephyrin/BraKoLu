import { DatePipe } from '@angular/common';
import { OrderDisplayService } from '@app/_services/order/order-display.service';
import { DialogOrderDetailPriceComponent } from './dialog-order-detail-price/dialog-order-detail-price.component';
import { DialogOrderDetailSupplierComponent } from './dialog-order-detail-supplier/dialog-order-detail-supplier.component';
import { DialogOrderDetailDateComponent } from './dialog-order-detail-date/dialog-order-detail-date.component';
import { DialogOrderDetailQuantityComponent } from './dialog-order-detail-quantity/dialog-order-detail-quantity.component';
import { MatDialog } from '@angular/material/dialog';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Order } from '@app/_models/order';
import { Ingredient } from '@app/_models/ingredient';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { OrderService } from '@app/_services/order/order.service';
import { StockService } from '@app/_services/stock/stock.service';
import { BrewService } from '@app/_services/brew/brew.service';
import { Component, OnInit, OnDestroy, Input, SimpleChange } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogOrderDetailResult } from './dialog-order-detail-base';
import { OrderDetailCreation } from '@app/_mapper/order/order-detail-creation';
import { contentSideMain, filterDialogExpand } from '@app/_components/animations/filter-animation';

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
    filterDialogExpand,
    contentSideMain
  ]
})
export class OrderDetailCreationComponent implements OnInit, OnDestroy {
  orderDetailCreation: OrderDetailCreation;
  brewSubscription: Subscription;
  stockSubscription: Subscription;
  @Input() order: Order;

  public undefValue = undefined;

  private afterClosedSubscription: Subscription;
  private orderDisplaySubscription: Subscription;
  private orderAddIngredientSubscription: Subscription;
  constructor(
    public brewService: BrewService,
    public stockService: StockService,
    public orderService: OrderService,
    public ingredientService: IngredientService,
    public supplierService: SupplierService,
    public dialog: MatDialog,
    public orderDisplayService: OrderDisplayService,
    public datepipe: DatePipe,
  ) {
    this.orderDisplaySubscription = this.orderDisplayService.launchOrder.subscribe(x => {
      this.launchOrder(x);
    });
    this.orderAddIngredientSubscription = this.orderDisplayService.addIngredientToOrderSignal.subscribe(x => {
      this.addIngredient(x);
    });
  }

  ngOnInit(): void {
    this.orderDetailCreation = new OrderDetailCreation(this.ingredientService, this.stockService, this.brewService);

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
        this.orderDetailCreation.updateIngredientStock(change);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.brewSubscription) { this.brewSubscription.unsubscribe(); }
    if (this.stockSubscription) { this.stockSubscription.unsubscribe(); }
    if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
    if (this.orderDisplaySubscription) { this.orderDisplaySubscription.unsubscribe(); }
    if (this.orderAddIngredientSubscription) { this.orderAddIngredientSubscription.unsubscribe(); }
  }

  createPartIngredientType() {
    if (this.brewService.model && this.stockService.model) {
      this.orderDetailCreation.init(this.order);
    }
  }

  addIngredient(ingredient: Ingredient) {
    this.orderDetailCreation.addIngredient(ingredient);
  }

  launchOrder(event: any) {
    let popupDate = false;
    let popupSupplier = false;
    let popupPrice = false;
    let popupQuantity = false;
    this.order.stocks.forEach(stock => {
      if (stock.id > 0) {
        if (stock.deliveryScheduledFor === null || stock.deliveryScheduledFor === undefined) {
          popupDate = true;
        }
        if (stock.supplier === null || stock.supplier === undefined) {
          popupSupplier = true;
        }
        if (stock.price === undefined || stock.price === 0) {
          popupPrice = true;
        }
        if (stock.quantity === undefined || stock.quantity === 0) {
          popupQuantity = true;
        }
      }
    });
    this.order.stocks = this.order.stocks.filter(x => x.id > 0);
    this.tryLaunchOrder(popupQuantity, popupDate, popupSupplier, popupPrice);
  }

  private tryLaunchOrder(popupQuantity: boolean, popupDate: boolean, popupSupplier: boolean, popupPrice: boolean) {
    const showPopup = popupQuantity || popupDate || popupSupplier || popupPrice;
    let template: any;
    if (popupQuantity) {
      template = DialogOrderDetailQuantityComponent;
      popupQuantity = false;
    } else if (popupDate) {
      template = DialogOrderDetailDateComponent;
      popupDate = false;
    } else if (popupSupplier) {
      template = DialogOrderDetailSupplierComponent;
      popupSupplier = false;
    } else if (popupPrice) {
      template = DialogOrderDetailPriceComponent;
      popupPrice = false;
    }

    if (showPopup) {
      const dialogRef = this.dialog.open(template, { minWidth: '30em' });
      if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
      this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
        if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
        if (result.data === DialogOrderDetailResult.removeEmptyQuantity) {
          this.order.stocks.forEach(stock => {
            if (!stock.quantity) { this.stockService.update(undefined, stock, undefined); }
          });
        }
        else if (result.data === DialogOrderDetailResult.updateMissingDate) {
          this.order.stocks.forEach(stock => {
            if (!stock.deliveryScheduledFor) {
              this.stockService.update('deliveryScheduledFor', stock, result.newDate, true, true);
            }
          });
        }
        if (result.data !== DialogOrderDetailResult.cancel) {
          this.tryLaunchOrder(popupQuantity, popupDate, popupSupplier, popupPrice);
        }
      });
    } else {
      this.orderService.changeState(this.order);
    }
  }
}
