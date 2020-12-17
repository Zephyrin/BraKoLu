import { Ingredient } from './ingredient';

export class Cereal extends Ingredient {
  plant: string;
  type: string;
  format: string;
  ebc: number;
  category: string;

  public constructor(cereal: Cereal | undefined) {
    super(cereal);
    if (cereal) {
      this.plant = cereal.plant;
      this.type = cereal.type;
      this.format = cereal.format;
      this.ebc = cereal.ebc;
      this.category = cereal.category;
    } else {
      this.childName = 'cereal';
    }
  }

  toJSON() {
    const data = super.toJSON();
    if (this.plant) { data[`plant`] = this.plant; }
    if (this.type) { data[`type`] = this.type; }
    if (this.format) { data[`format`] = this.format; }
    if (this.ebc) { data[`ebc`] = this.ebc; }
    if (this.category) { data[`category`] = this.category; }
    return data;
  }
}
