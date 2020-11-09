import { IngredientStock } from './ingredientStock';
export class Brew {
  id: number;
  name: string;
  abv: number;
  ibu: number;
  ebc: number;
  state: string;
  producedQuantity: number;
  started: Date;
  ended: Date;
  created: Date;
  brewIngredients: BrewIngredient[];
  public constructor(value: Brew | undefined) {
    this.brewIngredients = new Array();
    this.state = 'created';
    if (value && value !== null) {
      this.id = value.id;
      this.name = value.name;
      this.abv = value.abv;
      this.ibu = value.ibu;
      this.ebc = value.ebc;
      this.state = value.state;
      this.producedQuantity = value.producedQuantity;
      if (value.started) {
        this.started = new Date(value.started);
      }
      if (value.ended) {
        this.ended = new Date(value.ended);
      }
      if (value.created) {
        this.created = new Date(value.created);
      }
      if (value.brewIngredients?.length > 0) {
        value.brewIngredients.forEach(e => {
          const child = new BrewIngredient(e);
          child.brew = this;
          this.brewIngredients.push(child);
        });
      }
    }
  }

  toJSON(includeSupplier = true) {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (this.name) { data[`name`] = this.name; }
    if (this.abv) { data[`abv`] = this.abv; }
    if (this.ibu) { data[`ibu`] = this.ibu; }
    if (this.ebc) { data[`ebc`] = this.ebc; }
    if (this.state) { data[`state`] = this.state; }
    if (this.producedQuantity) { data[`producedQuantity`] = this.producedQuantity; }
    if (this.started) {
      if (typeof this.started === 'string') {
        data[`started`] = this.started;
      } else {
        data[`started`] =
          this.started.getFullYear()
          + '-'
          + this.started.getMonth()
          + '-'
          + this.started.getDay()
          + ' '
          + this.started.getHours()
          + ':'
          + this.started.getMinutes();
      }
    }
    if (this.ended) {
      if (typeof this.ended === 'string') {
        data[`ended`] = this.ended;
      } else {
        data[`ended`] =
          this.ended.getFullYear()
          + '-'
          + this.ended.getMonth()
          + '-'
          + this.ended.getDay()
          + ' '
          + this.ended.getHours()
          + ':'
          + this.ended.getMinutes();
      }
    }
    return data;
  }
}

export class BrewIngredient {
  id: number;
  brew: Brew;
  stock: IngredientStock;
  quantity: number;

  public constructor(value: BrewIngredient | undefined) {
    this.quantity = 0;
    if (value && value !== null) {
      this.id = value.id;
      this.brew = value.brew;
      if (value.stock) {
        this.stock = new IngredientStock(value.stock);
      }
      this.quantity = value.quantity;
    }
  }

  toJSON() {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (this.stock) { data[`stock`] = this.stock.toJSON(true); }
    if (this.quantity !== undefined) { data[`quantity`] = this.quantity; }
    return data;
  }
}
