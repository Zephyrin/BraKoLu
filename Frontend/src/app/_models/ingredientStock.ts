import { IngredientFactory } from './ingredientFactory';
import { Ingredient } from '@app/_models';

export class IngredientStock {
  id: number;
  creationDate: Date;
  quantity: number;
  price: number;
  state: string;
  orderedDate: Date;
  endedDate: Date;
  ingredient: Ingredient;

  public constructor(stock: IngredientStock | undefined) {
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
    }
  }

  quantityCalc() {
    return this.quantity / this.ingredient.unitFactor;
  }

  toJSON() {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (this.quantity) { data[`quantity`] = this.quantity; }
    if (this.price) { data[`price`] = this.price; }
    if (this.state) { data[`state`] = this.state; }
    if (this.ingredient) { data[`ingredient`] = this.ingredient.id; }
    return data;
  }
}
