import { Ingredient } from './ingredient';

export class Other extends Ingredient {
  type: string;

  public constructor(other: Other | undefined) {
    super(other);
    if (other) {
      this.type = other.type;
    } else {
      this.childName = 'other';
    }
  }

  toJSON() {
    const data = super.toJSON();
    if (this.type) { data[`type`] = this.type; }
    return data;
  }
}
