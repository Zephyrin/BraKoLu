import { Ingredient } from './ingredient';

export class Keg extends Ingredient {
  volume: number;
  head: string;

  public constructor(keg: Keg | undefined) {
    super(keg);
    if (keg) {
      this.volume = keg.volume;
      this.head = keg.head;
    } else {
      this.childName = 'keg';
    }
  }

  toJSON() {
    const data = super.toJSON();
    if (this.volume) { data[`volume`] = this.volume; }
    if (this.head) { data[`head`] = this.head; }
    return data;
  }
}
