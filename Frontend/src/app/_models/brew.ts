export class Brew {
  id: number;
  name: string;
  abv: number;
  ibu: number;
  ebc: number;
  state: string;
  producedQuantity: number;
  started: Date;
  ended: Date;
  created: Date;

  public constructor(value: Brew | undefined) {
    if (value && value !== null) {
      this.id = value.id;
      this.name = value.name;
      this.abv = value.abv;
      this.ibu = value.ibu;
      this.ebc = value.ebc;
      this.state = value.state;
      this.producedQuantity = value.producedQuantity;
      if (value.started) {
        this.started = new Date(value.started);
      }
      if (value.ended) {
        this.ended = new Date(value.ended);
      }
      if (value.created) {
        this.created = new Date(value.created);
      }
    }
  }

  toJSON(includeSupplier = true) {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (this.name) { data[`name`] = this.name; }
    if (this.abv) { data[`abv`] = this.abv; }
    if (this.ibu) { data[`ibu`] = this.ibu; }
    if (this.ebc) { data[`ebc`] = this.ebc; }
    if (this.state) { data[`state`] = this.state; }
    if (this.producedQuantity) { data[`producedQuantity`] = this.producedQuantity; }
    if (this.started) {
      if (typeof this.started === 'string') {
        data[`started`] = this.started;
      } else {
        data[`started`] =
          this.started.getFullYear()
          + '-'
          + this.started.getMonth()
          + '-'
          + this.started.getDay()
          + ' '
          + this.started.getHours()
          + ':'
          + this.started.getMinutes();
      }
    }
    if (this.ended) {
      if (typeof this.ended === 'string') {
        data[`ended`] = this.ended;
      } else {
        data[`ended`] =
          this.ended.getFullYear()
          + '-'
          + this.ended.getMonth()
          + '-'
          + this.ended.getDay()
          + ' '
          + this.ended.getHours()
          + ':'
          + this.ended.getMinutes();
      }
    }
    return data;
  }
}
