import { StockService } from './../../../../../_services/stock/stock.service';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BrewIngredientOrder, OrderStock } from '@app/_mapper/order/order-detail-creation';
import { ValueViewChild } from '@app/_services';

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-brews-for-ingredient',
  templateUrl: './brews-for-ingredient.component.html',
  styleUrls: ['./brews-for-ingredient.component.scss'],
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
  ]
})
export class BrewsForIngredientComponent implements OnInit, OnDestroy {
  @ViewChild('matTable') table: MatTable<any>;
  private element$: OrderStock;
  @Input()
  set element(value: OrderStock) {
    if (this.stockSubscription) { this.stockSubscription.unsubscribe(); }
    this.element$ = value;
    if (this.element$) {
      this.stockSubscription = this.element$.brewIngredientsUpdate.subscribe(change => {
        this.table.renderRows();
      });
    }
  }
  get element() { return this.element$; }

  public headersDetailStock: ValueViewChild[];
  public displayedColumnsDetailStock = new Array<string>();

  stockSubscription: Subscription;

  constructor(
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.headersDetailStock = new Array<ValueViewChild>();
    this.headersDetailStock.push({ value: 'brewName', viewValue: 'Brassin' });
    this.headersDetailStock.push({ value: 'startDate', viewValue: 'À brasser le' });
    this.headersDetailStock.push({ value: 'quantity', viewValue: 'Quantité' });
    this.headersDetailStock.push({ value: 'quantityMissing', viewValue: 'Quantité manquante' });
    this.headersDetailStock.forEach(val => { this.displayedColumnsDetailStock.push(val.value); });

  }

  ngOnDestroy(): void {
    if (this.stockSubscription) { this.stockSubscription.unsubscribe(); }
  }

  getDisplayBrewIngredient(name: string, brewIng: BrewIngredientOrder) {
    switch (name) {
      case 'brewName':
        return brewIng.brewIngredient.brew.number + ' - '
          + brewIng.brewIngredient.brew.name + ' ';
      case 'startDate':
        return this.datepipe.transform(brewIng.brewIngredient.brew.started, 'dd-MM-y');
      case 'quantity':
        return brewIng.brewIngredient.quantity / brewIng.brewIngredient.ingredient.unitFactor + ' '
          + brewIng.brewIngredient.ingredient.unit;
      case 'quantityMissing':
        return brewIng.quantityLeft / brewIng.brewIngredient.ingredient.unitFactor + ' ' + brewIng.brewIngredient.ingredient.unit;
      case 'unit':
        return brewIng.brewIngredient.ingredient.unit;
      default:
        break;
    }
    return 'non trouvé';
  }
}
