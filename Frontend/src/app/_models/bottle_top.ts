import { Ingredient } from './ingredient';

export class Bottle_Top extends Ingredient {
  size: number;
  color: string;

  public constructor(bottle_top: Bottle_Top | undefined) {
    super(bottle_top);
    if (bottle_top) {
      this.size = bottle_top.size;
      this.color = bottle_top.color;
    } else {
      this.childName = 'bottle top';
    }
  }

  toJSON() {
    const data = super.toJSON();
    if (this.size) { data[`size`] = this.size; }
    if (this.color) { data[`color`] = this.color; }
    return data;
  }
}
