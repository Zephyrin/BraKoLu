import { Ingredient } from './ingredient';

export class Box extends Ingredient {
  capacity: number;

  public constructor(box: Box | undefined) {
    super(box);
    if (box) {
      this.capacity = box.capacity;
    } else {
      this.childName = 'box';
    }
  }

  toJSON() {
    const data = super.toJSON();
    if (this.capacity) { data[`capacity`] = this.capacity; }
    return data;
  }
}
