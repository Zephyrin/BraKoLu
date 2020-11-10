export class Order {
  id: number;

  constructor(value: Order | undefined) {
    if (value) {
      this.id = value.id;
    }
  }

  toJSON() {
    const data = [];
    if (this.id) { data[`id`] = this.id; }
    return data;
  }
}
