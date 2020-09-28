import { Ingredient } from './ingredient';

export class Bottle extends Ingredient {
  type: string;
  volume: number;
  color: string;  

  public constructor(bottle: Bottle | undefined) {
    super(bottle);
    if (bottle) {
      this.type = bottle.type;
      this.volume = bottle.volume;
      this.color = bottle.color;
    } else {
      this.childName = 'bottle';
    }
  }

  toJSON() {
    const data = super.toJSON();
    if (this.type) { data[`type`] = this.type; }
    if (this.volume) { data[`volume`] = this.volume; }
    if (this.color) {data[`color`] = this.color; }
    return data;
  }
}
