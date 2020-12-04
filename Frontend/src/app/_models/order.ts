import { IngredientStock } from './ingredientStock';

export class Order {
  id: number;
  stocks: IngredientStock[];
  state: string;
  created: Date;

  constructor(value: Order | undefined, includeStocks: boolean = true) {
    this.stocks = new Array();
    if (value) {
      this.id = value.id;
      if (value.stocks && includeStocks) {
        value.stocks.forEach(x => {
          const stock = new IngredientStock(x, false);
          stock.order = this;
          this.stocks.push(stock);
        });
      }
      this.state = value.state;
      this.created = value.created;
    }
  }

  update(value: Order) {
    this.stocks = new Array();
    if (value.stocks) {
      value.stocks.forEach(x => this.stocks.push(new IngredientStock(x)));
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
    return data;
  }
}
