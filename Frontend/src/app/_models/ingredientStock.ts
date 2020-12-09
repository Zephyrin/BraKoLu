import { BrewStock } from './internal';
import { Ingredient } from './internal';
import { Order } from './internal';
import { Supplier } from './internal';
import { IngredientFactory } from './internal';

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

  public constructor(stock: IngredientStock | undefined, includeOrder: boolean = true, initLists: boolean = true) {
    if (initLists) { this.brewStocks = new Array(); }
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

  public update(value: IngredientStock) {
    if (value.creationDate) {
      this.creationDate = new Date(value.creationDate);
    }
    if (value.quantity) { this.quantity = value.quantity; }
    if (value.price) { this.price = value.price; }
    if (value.state) { this.state = value.state; }
    if (value.orderedDate) { this.orderedDate = new Date(value.orderedDate); }
    if (value.endedDate) { this.endedDate = new Date(value.endedDate); }
    if (value.deliveryScheduledFor) { this.deliveryScheduledFor = new Date(value.deliveryScheduledFor); }
    if (value.supplier && value.supplier.id !== this.supplier?.id) {
      this.supplier = new Supplier(value.supplier);
    }
    if (value.order && value.order?.id !== this.order?.id) {
      this.order = new Order(value.order);
    }
  }

  public init(ingredient: Ingredient, order: Order) {
    this.state = 'created';
    this.quantity = 0;
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
    if (this.price !== undefined) { data[`price`] = this.price; }
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
