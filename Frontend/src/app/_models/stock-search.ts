export class StockSearch {
  states: string[];

  public addState(value: string) {
    if (!this.states) { this.states = new Array<string>(); }
    if (this.states.findIndex(x => x === value) < 0) {
      this.states.push(value);
    }
  }
}
