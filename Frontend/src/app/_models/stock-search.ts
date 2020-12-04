export class StockSearch {
  states: string[];

  public addState(value: string) {
    if (!this.states) { this.states = new Array<string>(); }
    this.states.push(value);
  }
}
