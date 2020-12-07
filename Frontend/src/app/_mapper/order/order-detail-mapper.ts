import { IngredientStock, Supplier } from '@app/_models';
import { Order } from '@app/_models/order';
export class OrderDetailMapper {
  order: Order;
  suppliers = new Array<StockBySupplier>();
  constructor(order: Order) {
    this.order = order;
    this.order.stocks.forEach(stock => {
      const index = this.suppliers.findIndex(x => x.supplier?.id === stock.supplier?.id);
      if (index >= 0) {
        this.suppliers[index].addStock(stock);
      } else {
        this.suppliers.push(new StockBySupplier(stock));
      }
    });
  }

  public stockArrived(stock: IngredientStock, supplier: StockBySupplier): boolean {
    supplier.stockArrived(stock);
    let allArrived = true;
    this.suppliers.forEach(x => {
      if (x.expanded) { allArrived = false; }
    });
    return allArrived;
  }

  public stockStillInDelivery(stock: IngredientStock, supplier: StockBySupplier): boolean {
    supplier.stockStillInDelivery(stock);
    return false;
  }
}

export class StockBySupplier {
  supplier: Supplier;
  stocks = new Array<IngredientStock>();
  expanded = false;
  constructor(stock: IngredientStock) {
    this.supplier = stock.supplier;
    this.addStock(stock);
  }

  addStock(stock: IngredientStock) {
    this.stocks.push(stock);
    if (stock.state === 'ordered') {
      this.expanded = true;
    }
  }

  stockArrived(stock: IngredientStock) {
    let exp = false;
    this.stocks.forEach(x => {
      if (x.id !== stock.id && stock.state === 'ordered') {
        exp = true;
      }
    });
    this.expanded = exp;
  }

  stockStillInDelivery(stock: IngredientStock) {
    this.expanded = true;
  }
}
