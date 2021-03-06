export class BrewSearch {
  states: string[];
  orderBy: string;
  direction: string;
  public clearStates() {
    if (this.states) { this.states = undefined; }
  }
  public addState(value: string) {
    if (!this.states) { this.states = new Array<string>(); }
    if (this.states.findIndex(x => x === value) < 0) {
      this.states.push(value);
    }
  }

  public order(orderBy: string, direction: string) {
    this.orderBy = orderBy;
    this.direction = direction;
  }
}
