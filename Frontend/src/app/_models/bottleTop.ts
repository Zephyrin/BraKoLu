import { Ingredient } from './ingredient';

export class BottleTop extends Ingredient {
  size: number;
  color: string;

  public constructor(bottleTop: BottleTop | undefined) {
    super(bottleTop);
    if (bottleTop) {
      this.size = bottleTop.size;
      this.color = bottleTop.color;
    } else {
      this.childName = 'bottleTop';
    }
  }

  toJSON() {
    const data = super.toJSON();
    if (this.size) { data[`size`] = this.size; }
    if (this.color) { data[`color`] = this.color; }
    return data;
  }
}
