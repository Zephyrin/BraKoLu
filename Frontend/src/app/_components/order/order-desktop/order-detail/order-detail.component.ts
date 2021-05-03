import { StockBySupplier } from '@app/_mapper/order/order-detail-mapper';
import { ValueViewChild } from '@app/_services/iservice';
import { OrderDetailMapper } from '@app/_mapper/order/order-detail-mapper';
import { Order } from '@app/_models/order';
import { OrderService } from '@app/_services/order/order.service';
import { StockService } from '@app/_services/stock/stock.service';
import { Component, Input, OnInit } from '@angular/core';
import { IngredientStock } from '@app/_models';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  @Input()
  set order(value: Order) {
    this.orderMap = new OrderDetailMapper(value);
  }

  orderMap: OrderDetailMapper;
  public headersStock: ValueViewChild[];
  public displayedColumnsStock = new Array<string>();
  private inputIntervalBeforeSave: any;

  constructor(
    public stockService: StockService,
    public orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.headersStock = new Array<ValueViewChild>();
    this.headersStock.push({ value: 'ingredient', viewValue: 'Ingrédient' });
    this.headersStock.push({ value: 'quantityOrder', viewValue: 'Qt. commandée' });
    this.headersStock.push({ value: 'price', viewValue: 'Prix' });
    this.headersStock.push({ value: 'deliveryPlanned', viewValue: 'Livraison prévue le' });
    this.headersStock.forEach(val => { this.displayedColumnsStock.push(val.value); });
    this.displayedColumnsStock.push('action');
  }

  getDisplay(name: string, orderStock: IngredientStock): string | number {
    switch (name) {
      case 'ingredient':
        return orderStock.ingredient.name;
      default:
        break;
    }
    return 'non trouvé';
  }
  public updateQuantity(evt: number, stock: IngredientStock, name: string): void {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      const val = +evt;
      this.stockService.update(name, stock, val);
      this.inputIntervalBeforeSave = undefined;
    }, 300);
  }

  public updateStock(evt: any, stock: IngredientStock, name: string): void {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      const val = +evt.srcElement.value;
      this.stockService.update(name, stock, val);
      this.inputIntervalBeforeSave = undefined;
    }, 300);
  }

  updateDate(event: any, stock: IngredientStock, date: string) {
    if (event.target.value) {
      this.stockService.update(date, stock, new Date(event.target.value));
      stock[date] = new Date(event.target.value);
    } else {
      this.stockService.update(date, stock, null);
      stock[date] = null;
    }
  }

  updateStockState(event: MatSlideToggleChange, stock: IngredientStock, supplier: StockBySupplier) {
    if (event.checked) {
      this.stockService.update('state', stock, 'stocked');
      if (this.orderMap.stockArrived(stock, supplier)) {
        this.orderService.update('state', this.orderMap.order, 'received');
      }
    } else {
      this.stockService.update('state', stock, 'ordered');
      this.orderMap.stockStillInDelivery(stock, supplier);
      if (this.orderMap.order.state === 'received') {
        this.orderService.update('state', this.orderMap.order, 'ordered');
      }
    }
  }

}
