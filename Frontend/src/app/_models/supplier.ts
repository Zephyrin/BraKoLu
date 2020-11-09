export class Supplier {
  id: number;
  name: string;

  public constructor(supplier: Supplier | undefined) {
    if (supplier && supplier !== null) {
      this.id = supplier.id;
      this.name = supplier.name;
    }
  }

  toJSON(includeId = false) {
    const data = {};
    if (includeId && this.id) { data[`id`] = this.id; }
    if (this.name) { data[`name`] = this.name; }
    return data;
  }
}
