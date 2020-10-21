import { IngredientStock } from './ingredientStock';

export class Supplier {
  id: number;
  name: string;
  ingredientStocks: IngredientStock[];

  public constructor(supplier: Supplier | undefined, createStock = true) {
    this.ingredientStocks = new Array();
    if (supplier && supplier !== null) {
      this.id = supplier.id;
      this.name = supplier.name;
      if (supplier.ingredientStocks) {
        if (createStock === true) {
          supplier.ingredientStocks.forEach(stock => {
            this.ingredientStocks.push(new IngredientStock(stock, false));
          });
        } else {
          supplier.ingredientStocks.forEach(stock => {
            this.ingredientStocks.push(stock);
          });
        }
      }
    }
  }

  toJSON(includeId = false, includeStock = true) {
    const data = {};
    if (includeId && this.id) { data[`id`] = this.id; }
    if (this.name) { data[`name`] = this.name; }
    if (includeStock) {
      const stocks = new Array();
      this.ingredientStocks.forEach(stock => stocks.push(stock.toJSON(false)));
      data[`ingredientStocks`] = stocks;
    }
    return data;
  }
}
