import { BrewStock } from './brew';
import { IngredientStock } from './ingredientStock';

export class Order {
  id: number;
  stocks: IngredientStock[];
  state: string;
  stockNotOrders: StockNotOrder[];
  created: Date;

  constructor(value: Order | undefined) {
    this.stocks = new Array();
    this.stockNotOrders = new Array();
    if (value) {
      this.id = value.id;
      if (value.stocks) {
        value.stocks.forEach(x => this.stocks.push(new IngredientStock(x)));
      }
      if (value.stockNotOrders) {
        value.stockNotOrders.forEach(x => this.stockNotOrders.push(new StockNotOrder(x)));
      }
      this.state = value.state;
      this.created = value.created;
    }
  }

  update(value: Order) {
    this.stocks = new Array();
    this.stockNotOrders = new Array();
    if (value.stocks) {
      value.stocks.forEach(x => this.stocks.push(new IngredientStock(x)));
    }
    if (value.stockNotOrders) {
      value.stockNotOrders.forEach(x => this.stockNotOrders.push(new StockNotOrder(x)));
    }
    this.state = value.state;
  }

  toJSON() {
    const data = [];
    if (this.id) { data[`id`] = this.id; }
    if (this.state) { data[`state`] = this.state; }
    if (this.stocks) {
      const stocks = new Array();
      this.stocks.forEach(x => stocks.push(x.toJSON(true)));
      data[`stocks`] = stocks;
    }
    if (this.stocks) {
      const stockNotOrders = new Array();
      this.stockNotOrders.forEach(x => stockNotOrders.push(x.toJSON()));
      data[`stockNotOrders`] = stockNotOrders;
    }
    return data;
  }
}

export class StockNotOrder {
  id: number;
  order: Order;
  brewStock: BrewStock;

  constructor(value: StockNotOrder | undefined) {
    if (value) {
      this.id = value.id;
      this.brewStock = new BrewStock(value.brewStock);
    }
  }

  toJSON() {
    const data = [];
    if (this.id) { data[`id`] = this.id; }
    if (this.brewStock) { data[`brewStock`] = this.brewStock.toJSON(); }
    return data;
  }
}
