import { BrewStock } from './brew';
import { IngredientFactory } from './ingredientFactory';
import { Supplier } from './supplier';
import { Ingredient } from './ingredient';

export class IngredientStock {
  id: number;
  creationDate: Date;
  quantity: number;
  price: number;
  state: string;
  orderedDate: Date;
  endedDate: Date;
  ingredient: Ingredient;
  brewStocks: BrewStock[];
  supplier: Supplier;

  public constructor(stock: IngredientStock | undefined) {
    this.brewStocks = new Array();
    if (stock && stock !== null) {
      this.id = stock.id;
      if (stock.creationDate) {
        this.creationDate = new Date(stock.creationDate);
      }
      this.quantity = stock.quantity;
      this.price = stock.price;
      this.state = stock.state;
      if (stock.orderedDate) {
        this.orderedDate = new Date(stock.orderedDate);
      }
      if (stock.endedDate) {
        this.endedDate = new Date(stock.endedDate);
      }
      this.ingredient = IngredientFactory.createCpy(stock.ingredient);
      if (stock.supplier) {
        this.supplier = new Supplier(stock.supplier);
      }
      if (stock.brewStocks) {
        stock.brewStocks.forEach(brewStock => this.brewStocks.push(new BrewStock(brewStock)));
      }
    }
  }

  quantityCalc() {
    return this.quantity / this.ingredient.unitFactor;
  }

  toJSON(includeSupplier = true) {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (this.quantity !== undefined) { data[`quantity`] = this.quantity; }
    if (this.price) { data[`price`] = this.price; }
    if (this.state) { data[`state`] = this.state; }
    if (this.ingredient) { data[`ingredient`] = this.ingredient.id; }
    if (includeSupplier === true) {
      if (this.supplier) {
        data[`supplier`] = this.supplier.toJSON(true);
      }
    }
    {
      const brewStocks = new Array();
      this.brewStocks.forEach(brewStock => brewStocks.push(brewStock.toJSON()));
      data[`brewStocks`] = brewStocks;
    }
    return data;
  }
}
