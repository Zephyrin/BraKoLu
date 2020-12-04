import { BrewStock } from './brew';
import { IngredientFactory } from './ingredientFactory';
import { Supplier } from './supplier';
import { Ingredient } from './ingredient';
import { Order } from './order';

export class IngredientStock {
  id: number;
  creationDate: Date;
  quantity: number;
  price: number;
  state: string;
  orderedDate: Date;
  endedDate: Date;
  deliveryScheduledFor: Date;
  ingredient: Ingredient;
  brewStocks: BrewStock[];
  supplier: Supplier;
  order: Order;

  public constructor(stock: IngredientStock | undefined, includeOrder: boolean = true) {
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
      if (stock.deliveryScheduledFor) {
        this.deliveryScheduledFor = new Date(stock.deliveryScheduledFor);
      }
      this.ingredient = IngredientFactory.createCpy(stock.ingredient);
      if (stock.supplier) {
        this.supplier = new Supplier(stock.supplier);
      }
      if (includeOrder && stock.order) {
        this.order = new Order(stock.order, false);
      }
      if (stock.brewStocks) {
        stock.brewStocks.forEach(brewStock => {
          const newBrewStock = new BrewStock(brewStock);
          this.brewStocks.push(newBrewStock);
          if (!brewStock.stock) {
            newBrewStock.stock = this;
          }
        });
      }
    }
  }

  public init(ingredient: Ingredient, order: Order) {
    this.state = 'created';
    this.quantity = 0;
    this.creationDate = new Date('now');
    this.order = order;
    order.stocks.push(this);
    this.ingredient = ingredient;
  }

  quantityCalc() {
    return this.quantity / this.ingredient.unitFactor;
  }

  toJSON(includeSupplier: boolean | string = true) {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (this.quantity !== undefined) { data[`quantity`] = this.quantity; }
    if (this.price) { data[`price`] = this.price; }
    if (this.state) { data[`state`] = this.state; }
    if (this.ingredient) { data[`ingredient`] = this.ingredient.id; }
    if (includeSupplier === true || includeSupplier === '') {
      if (this.supplier) {
        data[`supplier`] = this.supplier.toJSON(true);
      }
    }
    if (this.order) {
      data[`order`] = this.order.id;
    }
    if (this.deliveryScheduledFor !== undefined) {
      if (this.deliveryScheduledFor === null || isNaN(this.deliveryScheduledFor.getTime())) {
        data[`deliveryScheduledFor`] = null;
      } else if (typeof this.deliveryScheduledFor === 'string') {
        data[`deliveryScheduledFor`] = this.deliveryScheduledFor;
      } else {
        data[`deliveryScheduledFor`] =
          this.deliveryScheduledFor.getFullYear()
          + '-'
          + (this.deliveryScheduledFor.getMonth() + 1).toString().padStart(2, '0')
          + '-'
          + this.deliveryScheduledFor.getDate().toString().padStart(2, '0');
      }
    }
    /* if (includeBrewStock) {
      const brewStocks = new Array();
      this.brewStocks.forEach(brewStock => brewStocks.push(brewStock.toJSON(false)));
      data[`brewStocks`] = brewStocks;
    } */
    return data;
  }
}
