import { IngredientStock } from './ingredientStock';

export class Order {
  id: number;
  stocks: IngredientStock[];
  state: string;
  created: Date;

  constructor(value: Order | undefined, includeStocks: boolean = true, initLists: boolean = true) {
    if (initLists) { this.stocks = new Array(); }
    if (value) {
      this.id = value.id;
      if (value.stocks && includeStocks) {
        value.stocks.forEach(x => {
          const stock = new IngredientStock(x, false);
          stock.order = this;
          this.stocks.push(stock);
        });
      }
      this.state = value.state;
      this.created = value.created;
    }
  }

  update(value: Order) {
    if (value.state) { this.state = value.state; }
    if (value.stocks) {
      value.stocks.forEach(x => {
        const index = this.stocks.findIndex(y => y.id === x.id);
        if (index < 0) { this.stocks.push(new IngredientStock(x)); }
        else { this.stocks[index].update(x); }
      });
    }
    this.state = value.state;
  }

  toJSON() {
    const data = {};
    if (this.id) { data[`id`] = this.id; }
    if (this.state) { data[`state`] = this.state; }
    /* On inclut pas les stocks car ils sont créés à la volé.
    Attention, lors du passage de la commande de créé à en commande,
    on fait une mise à jour partielle, du coup on ne doit pas mettre
    une liste de stocks vide...
    */
    /*  if (this.stocks) {
       const stocks = new Array();
       this.stocks.forEach(x => stocks.push(x.toJSON(true)));
       data[`stocks`] = stocks;
     } */
    return data;
  }
}
