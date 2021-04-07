import { Component, OnInit, Input } from '@angular/core';
import { OrderStock } from '@app/_mapper/order/order-detail-creation';
import { IngredientStock, Supplier } from '@app/_models';
import { StockService } from '@app/_services/stock/stock.service';

@Component({
  selector: 'app-stock-in-order-inline',
  templateUrl: './stock-in-order-inline.component.html',
  styleUrls: ['./stock-in-order-inline.component.scss']
})
export class StockInOrderInlineComponent implements OnInit {
  private inputIntervalBeforeSave: any;
  @Input() element: OrderStock;
  @Input() stock: IngredientStock;
  constructor(
    public stockService: StockService
  ) { }

  ngOnInit(): void {
  }

  public updateStock(evt: any, orderStock: OrderStock, stock: IngredientStock, name: string): void {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      let val = +evt.srcElement.value;
      if (name === 'quantity') { val = val * stock.ingredient.unitFactor; }
      if (name === 'price') { val = val * 100; }
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

  public removeStockOrder(event: MouseEvent, row: OrderStock): void {
    event.stopPropagation();
    row.updateQuantity(row.orderStocks[0], 0);
    if (row.orderStocks[0].id > 0) {
      this.stockService.update(undefined, row.orderStocks[0], undefined);
    }
    row.orderStocks.splice(0, 1);
    if (row.orderStocks.length === 0) {
      row.addOrderStock(undefined);
    }
  }
}
