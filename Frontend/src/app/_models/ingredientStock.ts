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
  suppliers: Supplier[];

  public constructor(stock: IngredientStock | undefined, createSupplier = false) {
    this.suppliers = new Array();
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
      if (stock.suppliers) {
        if (createSupplier === true) {
          stock.suppliers.forEach(supplier => this.suppliers.push(new Supplier(supplier, false)));
        } else {
          stock.suppliers.forEach(supplier => this.suppliers.push(supplier));
        }
      }
    }
  }

  quantityCalc() {
    return this.quantity / this.ingredient.unitFactor;
  }

  toJSON(includeSupplier = true) {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (this.quantity) { data[`quantity`] = this.quantity; }
    if (this.price) { data[`price`] = this.price; }
    if (this.state) { data[`state`] = this.state; }
    if (this.ingredient) { data[`ingredient`] = this.ingredient.id; }
    if (includeSupplier === true) {
      const suppliers = new Array();
      this.suppliers.forEach(supplier => suppliers.push(supplier.toJSON(false)));
      data[`suppliers`] = suppliers;
    }
    return data;
  }
}
