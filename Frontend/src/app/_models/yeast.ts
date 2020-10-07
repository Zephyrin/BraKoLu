import { Ingredient } from './ingredient';

export class Yeast extends Ingredient {
  type: number;
  productionYear: Date;

  public constructor(yeast: Yeast | undefined) {
    super(yeast);
    if (yeast) {
      this.type = yeast.type;
      this.productionYear = yeast.productionYear;
    } else {
      this.childName = 'yeast';
    }
  }

  toJSON() {
    const data = super.toJSON();
    if (this.type) { data[`type`] = this.type; }
    if (this.productionYear) {
      if (typeof this.productionYear === 'string') {
        data[`productionYear`] = this.productionYear;
      } else {
        data[`productionYear`] =
          this.productionYear.getFullYear()
          + '-'
          + this.productionYear.getMonth();
      }
    }
    return data;
  }
}
