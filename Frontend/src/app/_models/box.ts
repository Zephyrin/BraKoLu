import { Bottle } from './bottle';
import { Ingredient } from './ingredient';

export class Box extends Ingredient {
  capacity: number;
  bottle: Bottle;

  public constructor(box: Box | undefined) {
    super(box);
    if (box) {
      this.capacity = box.capacity;
      if (box.bottle !== undefined && box.bottle !== null) {
        this.bottle = new Bottle(box.bottle);
      }
    } else {
      this.childName = 'box';
    }
  }

  toJSON() {
    const data = super.toJSON();
    if (this.capacity) { data[`capacity`] = this.capacity; }
    if (this.bottle) { data[`bottle`] = this.bottle.toJSON(); }
    return data;
  }
}
