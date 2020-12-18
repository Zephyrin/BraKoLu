import { Ingredient } from './ingredient';

export class Hop extends Ingredient {
  type: string;
  acidAlpha: string;
  harvestYear: number;

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
      data[`harvestYear`] = this.harvestYear;
    }
    return data;
  }
}
