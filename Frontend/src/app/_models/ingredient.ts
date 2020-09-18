
export abstract class Ingredient {
  id: number;
  name: string;
  comment: string;
  unit: string;
  unitFactor: string;
  childName: string;

  public constructor(ingredient: Ingredient | undefined) {
    if (ingredient && ingredient !== null) {
      this.id = ingredient.id;
      this.name = ingredient.name;
      this.comment = ingredient.comment;
      this.unit = ingredient.unit;
      this.unitFactor = ingredient.unitFactor;
      this.childName = ingredient.childName;
    }
  }

  toJSON() {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (this.name) { data[`name`] = this.name; }
    if (this.comment) { data[`comment`] = this.comment; }
    if (this.unit) { data[`unit`] = this.unit; }
    if (this.unitFactor) { data[`unitFactor`] = this.unitFactor; }
    if (this.childName) { data[`childName`] = this.childName; }
    return data;
  }
}
