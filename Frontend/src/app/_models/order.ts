import { IngredientStock } from './ingredientStock';

export class Order {
  id: number;
  stocks: IngredientStock[];

  constructor(value: Order | undefined) {
    this.stocks = new Array();
    if (value) {
      this.id = value.id;
      if (value.stocks) {
        value.stocks.forEach(x => this.stocks.push(new IngredientStock(x)));
      }
    }
  }

  toJSON() {
    const data = [];
    if (this.id) { data[`id`] = this.id; }
    if (this.stocks) {
      const stocks = new Array();
      this.stocks.forEach(x => stocks.push(x.toJSON(true)));
      data[`stocks`] = stocks;
    }
    return data;
  }
}
