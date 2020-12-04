import { IngredientFactory } from './ingredientFactory';
import { Ingredient } from '@app/_models';
import { IngredientStock } from './ingredientStock';
export class Brew {
  id: number;
  number: number;
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
    if (value && value !== null) {
      this.id = value.id;
      this.number = value.number;
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

  update(value: Brew | undefined) {
    // Pour le moment seulement les types simples sont mise à jour. À voir
    // si il faut aussi mettre à jour le reste.
    if (value && value !== null) {
      if (this.number !== value.number) { this.number = value.number; }
      if (this.name !== value.name) { this.name = value.name; }
      if (this.abv !== value.abv) { this.abv = value.abv; }
      if (this.ibu !== value.ibu) { this.ibu = value.ibu; }
      if (this.ebc !== value.ebc) { this.ebc = value.ebc; }
      if (this.state !== value.state) { this.state = value.state; }
      if (this.producedQuantity !== value.producedQuantity) { this.producedQuantity = value.producedQuantity; }
      if (this.started !== value.started) {
        if (value.started) { this.started = new Date(value.started); }
        else { this.started = undefined; }
      }
      if (this.ended !== value.ended) {
        if (value.ended) { this.ended = new Date(value.ended); }
        else { this.ended = undefined; }
      }
      if (this.created !== value.created) {
        if (value.created) { this.created = new Date(value.created); }
        else { this.created = undefined; }
      }
    }
  }
  toJSON(includeSupplier = true) {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (this.number) { data[`number`] = this.number; }
    if (this.name) { data[`name`] = this.name; }
    if (this.abv) { data[`abv`] = this.abv; }
    if (this.ibu) { data[`ibu`] = this.ibu; }
    if (this.ebc) { data[`ebc`] = this.ebc; }
    if (this.state) { data[`state`] = this.state; }
    if (this.producedQuantity) { data[`producedQuantity`] = this.producedQuantity; }
    if (this.started !== undefined) {
      if (this.started === null || isNaN(this.started.getTime())) {
        data[`started`] = null;
      } else if (typeof this.started === 'string') {
        data[`started`] = this.started;
      } else {
        data[`started`] =
          this.started.getFullYear()
          + '-'
          + (this.started.getMonth() + 1).toString().padStart(2, '0')
          + '-'
          + this.started.getDate().toString().padStart(2, '0')
          + ' '
          + this.started.getHours().toString().padStart(2, '0')
          + ':'
          + this.started.getMinutes().toString().padStart(2, '0');
      }
    }
    if (this.ended !== undefined) {
      if (this.ended === null || isNaN(this.ended.getTime())) {
        data[`ended`] = null;
      } else if (typeof this.ended === 'string') {
        data[`ended`] = this.ended;
      } else {
        data[`ended`] =
          this.ended.getFullYear()
          + '-'
          + (this.ended.getMonth() + 1).toString().padStart(2, '0')
          + '-'
          + this.ended.getDate().toString().padStart(2, '0')
          + ' '
          + this.ended.getHours().toString().padStart(2, '0')
          + ':'
          + this.ended.getMinutes().toString().padStart(2, '0');
      }
    }
    return data;
  }
}

export class BrewIngredient {
  id: number;
  brew: Brew;
  ingredient: Ingredient;
  quantity: number;

  public constructor(value: BrewIngredient | undefined) {
    this.quantity = 0;
    if (value && value !== null) {
      this.id = value.id;
      this.brew = value.brew;
      if (value.ingredient) {
        this.ingredient = IngredientFactory.createCpy(value.ingredient);
      }
      this.quantity = value.quantity;
    }
  }

  toJSON() {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (this.ingredient) { data[`ingredient`] = this.ingredient.toJSON(); }
    if (this.quantity !== undefined) { data[`quantity`] = this.quantity; }
    return data;
  }
}

export class BrewStock {
  id: number;
  brew: Brew;
  stock: IngredientStock;
  quantity: number;
  apply: boolean;

  public constructor(value: BrewStock | undefined) {
    this.quantity = 0;
    this.apply = false;
    if (value && value !== null) {
      this.id = value.id;
      this.brew = value.brew;
      if (value.stock) {
        this.stock = new IngredientStock(value.stock);
      }
      this.quantity = value.quantity;
    }
  }

  toJSON(includeStock = true) {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (includeStock && this.stock) { data[`stock`] = this.stock.toJSON(true); }
    if (this.quantity !== undefined) { data[`quantity`] = this.quantity; }
    if (this.apply !== undefined) { data[`apply`] = this.apply; }
    return data;
  }
}

