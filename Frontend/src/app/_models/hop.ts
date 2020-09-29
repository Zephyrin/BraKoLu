import { Ingredient } from './ingredient';

export class Hop extends Ingredient {
  type: string;
  acidAlpha: string;
  harvestYear: Date;

  public constructor(hop: Hop | undefined) {
    super(hop);
    if (hop) {
      this.type = hop.type;
      this.acidAlpha = hop.acidAlpha;
      this.harvestYear = hop.harvestYear;
    } else {
      this.childName = 'hop';
    }
  }

  toJSON() {
    const data = super.toJSON();
    if (this.type) { data[`type`] = this.type; }
    if (this.acidAlpha) { data[`acidAlpha`] = this.acidAlpha; }
    if (this.harvestYear) {
      if (typeof this.harvestYear === 'string') {
        data[`harvestYear`] = this.harvestYear;
      } else {
        data[`harvestYear`] =
          this.harvestYear.getFullYear()
          + '-'
          + (this.harvestYear.getMonth() + 1)
          + '-'
          + this.harvestYear.getDay();
      }
    }
    return data;
  }
}
