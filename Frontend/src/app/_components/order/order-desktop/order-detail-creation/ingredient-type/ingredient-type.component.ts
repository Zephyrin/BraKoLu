import { Subscription } from 'rxjs';
import { StockService } from '@app/_services/stock/stock.service';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IngredientsByType, OrderStock } from '@app/_mapper/order/order-detail-creation';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ValueViewChild } from '@app/_services';
import { MatTable } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-ingredient-type',
  templateUrl: './ingredient-type.component.html',
  styleUrls: ['./ingredient-type.component.scss'],
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
    trigger('brewExpand', [
      state('collapsed', style({ width: '0px', minWidth: '0', visibility: 'hidden' })),
      state('expanded', style({ width: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class IngredientTypeComponent implements OnInit, OnDestroy {
  public headersStock: ValueViewChild[];
  public displayedColumnsStock = new Array<string>();
  @ViewChild('matTable') table: MatTable<any>;
  private ing: IngredientsByType;
  private orderStocksSubscription: Subscription;
  @Input()
  set ingredientsByType(value: IngredientsByType) {
    if (this.orderStocksSubscription) { this.orderStocksSubscription.unsubscribe(); }
    this.ing = value;
    if (this.ing) {
      this.orderStocksSubscription = this.ing.orderStocksUpdate.subscribe(change => {
        this.table.renderRows();
      });
    }
  }
  get ingredientsByType() { return this.ing; }
  constructor(
    public stockService: StockService,
    public datepipe: DatePipe
  ) { }
  ngOnDestroy(): void {
    if (this.orderStocksSubscription) { this.orderStocksSubscription.unsubscribe(); }
  }

  ngOnInit(): void {
    this.headersStock = new Array<ValueViewChild>();
    this.headersStock.push({ value: 'ingredient', viewValue: 'Ingrédient' });
    this.headersStock.push({ value: 'quantityRecommanded', viewValue: 'Qt. Préconisée' });
    /* this.headersStock.push({ value: 'quantityOrder', viewValue: 'Qt. commandée' });
    this.headersStock.push({ value: 'price', viewValue: 'Prix' });
    this.headersStock.push({ value: 'supplier', viewValue: 'Fournisseur' });
    this.headersStock.push({ value: 'deliveryPlanned', viewValue: 'Livraison prévue le' }); */

    this.displayedColumnsStock.push('expanded');
    this.headersStock.forEach(val => { this.displayedColumnsStock.push(val.value); });
    this.displayedColumnsStock.push('action');
  }

  getDisplay(name: string, orderStock: OrderStock): string | number | boolean {
    switch (name) {
      case 'ingredient':
        return orderStock.ingredient.name;
      case 'quantityRecommanded':
        return (orderStock.quantityRecommanded / orderStock.ingredient.unitFactor) + ' ' + orderStock.ingredient.unit;
      case 'quantityOrder':
        {
          let ret = '';
          if (orderStock.quantityOrder > 0) {
            ret += (orderStock.quantityOrder / orderStock.ingredient.unitFactor) + ' ' + orderStock.ingredient.unit;
          }
          return ret;
        }
      case 'displayTruck':
        if (orderStock.lastDeliverySchedule > new Date(1, 1, 1)) {
          return true;
        }
        return false;
      case 'lastDeliverySchedule':
        {
          let ret = '';
          if (orderStock.lastDeliverySchedule > new Date(1, 1, 1)) {
            ret += this.datepipe.transform(orderStock.lastDeliverySchedule, 'dd-MM-yyyy');
          }
          return ret;
        }
      default:
        break;
    }
    return 'non trouvé';
  }

  selectedRow(event: MouseEvent, orderStock: OrderStock) {
    event.stopPropagation();
    orderStock.expanded = !orderStock.expanded;
  }

  public addNewStockOrder(event: MouseEvent, row: OrderStock, table: MatTable<any>): void {
    event.stopPropagation();
    row.addOrderStock(undefined);
    if (table) { table.renderRows(); }
  }
}
