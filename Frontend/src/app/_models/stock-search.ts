import { Supplier } from '.';

export class StockSearch {
  states: string[];
  suppliers: Supplier[];
  searchValue = '';

  public addState(value: string) {
    if (!this.states) { this.states = new Array<string>(); }
    if (this.states.findIndex(x => x === value) < 0) {
      this.states.push(value);
    }
  }
}
