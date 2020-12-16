import { StockService } from '@app/_services/stock/stock.service';
import { IngredientStock } from '@app/_models/ingredientStock';
import { ValueViewChild } from '@app/_services/iservice';
import { BrewIngredient, BrewStock, Ingredient } from '@app/_models';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Brew } from '@app/_models/brew';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-brew-ingredient-brewing',
  templateUrl: './brew-ingredient-brewing.component.html',
  styleUrls: ['./brew-ingredient-brewing.component.scss']
})
export class BrewIngredientBrewingComponent implements OnInit {
  @Input()
  set brew(value: Brew) {
    this.brew$ = value;
    this.container.brew = this.brew$;
  }
  get brew(): Brew { return this.brew$; }
  private brew$: Brew;
  container = new ContainerIngredientByType();

  public headersIngByBrew: ValueViewChild[];
  public displayedColumnsIngByBrew = new Array<string>();
  constructor(
    public ingredientService: IngredientService,
    public stockService: StockService
  ) { }

  ngOnInit(): void {
    this.stockService.load(true);
    this.headersIngByBrew = new Array<ValueViewChild>();
    this.headersIngByBrew.push({ value: 'ingredient', viewValue: 'Ingrédient' });
    this.headersIngByBrew.push({ value: 'quantityReceipt', viewValue: 'Quantité' });
    this.headersIngByBrew.push({ value: 'detail', viewValue: '' });
    this.headersIngByBrew.forEach(val => { this.displayedColumnsIngByBrew.push(val.value); });
  }

  getDisplay(name: string, receiptAndStock: ReceiptAndStock): string | number {
    switch (name) {
      case 'ingredient':
        return receiptAndStock.ingredient.name;
      default:
        break;
    }
    return 'non trouvé';
  }

  public compareId(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

}

/**
 * Mapper pour l'affichage des brassins trié par les ingrédients puis par les
 * brewIngredient (les ingrédients de la recette du brassin).
 */
export class ContainerIngredientByType {
  /**
   * Container principal avec le tri sur les ingrédients.
   */
  ingredientsByType = new Array<IngredientsByType>();

  /**
   * Initialisation du container principal avec un brassin.
   * Il remplit la liste ingredientsByType avec les brewIngredients et les
   * brewStock, respectivement les ingrédients de la recette et les ingrédient
   * utilisés lors du brassage, en les réunissant par le sous type d'ingrédient
   * (childName).
   */
  set brew(value: Brew) {
    this.brew$ = value;
    this.ingredientsByType.splice(0, this.ingredientsByType.length - 1);
    this.brew$.brewIngredients.forEach(ing => {
      const ingByType = this.getIngByType(ing.ingredient.childName);
      ingByType.addBrewIngredient(ing);
    });
    this.brew$.brewStocks.forEach(ing => {
      const ingByType = this.getIngByType(ing.stock.ingredient.childName);
      ingByType.addBrewStock(ing);
    });
  }

  /**
   * Le brassin.
   */
  get brew() { return this.brew$; }
  private brew$: Brew;

  /**
   * Récupère un ingrédient d'ingredientsByType en fonction du sous type
   * d'ingrédient. Si il n'existe pas, ça le crée puis le retourne.
   */
  private getIngByType(childName: string): IngredientsByType {
    let index = this.ingredientsByType.findIndex(x => x.childName === childName);
    if (index < 0) {
      this.ingredientsByType.push(new IngredientsByType(childName, this.brew));
      index = this.ingredientsByType.length - 1;
    }
    return this.ingredientsByType[index];
  }
}

/**
 * Container des brewStock et BrewIngredient en fonction du sous type d'ingrédient.
 */
export class IngredientsByType {
  /**
   * Le nom du sous type d'ingrédient.
   */
  childName: string;
  /**
   * Le container des BrewIngredients et des BrewStock.
   */
  ingAndStocks = new Array<ReceiptAndStock>();
  /**
   * Le brassin.
   */
  brew: Brew;
  constructor(name: string, brew: Brew) {
    this.childName = name;
    this.brew = brew;
  }

  /**
   * Ajoute un ingrédient de la recette au container.
   */
  public addBrewIngredient(bIng: BrewIngredient): void {
    const ing = this.getIngAndStocks(bIng.ingredient);
    ing.addBrewIngredient(bIng);
  }

  /**
   * Ajoute un ingrédient lié au stock au container.
   * Cet ingrédient peut-être lié à un ingrédient de la recette ou pas.
   */
  public addBrewStock(bStock: BrewStock): void {
    const ing = this.getIngAndStocks(bStock.stock.ingredient);
    ing.addBrewStock(bStock);
  }

  /**
   * Récupère un ReceiptAndStock en fonction d'un ingredient. Le crée si il n'existe
   * pas.
   */
  private getIngAndStocks(ingredient: Ingredient): ReceiptAndStock {
    let index = this.ingAndStocks.findIndex(x => x.ingredient.id === ingredient.id);
    if (index < 0) {
      this.ingAndStocks.push(new ReceiptAndStock(ingredient, this.brew));
      index = this.ingAndStocks.length - 1;
    }
    return this.ingAndStocks[index];
  }
}

export class ReceiptAndStock {
  /**
   * L'ingrédient de base.
   */
  ingredient: Ingredient;
  /**
   * La liste des ingrédients de la recette lié aux ingrédients du stock.
   * Permet de lier les ingrédients qui vont être pris au stock par rapport à la recette.
   * Pour la suite, cela permettra de savoir quand utiliser cette ingrédient car il peut
   * être utilisé sur plusieurs phase.
   */
  brewIngredients = new Array<ReceiptLinkToStock>();
  /**
   * La liste des ingrédients du stock qui n'ont pas été créé avec la recette mais rajouter au moment du brassage.
   */
  brewStocksWithoutReceipt = new Array<BrewStock>();

  /**
   * Le brassin, utile pour la création/modification/suppression.
   */
  brew: Brew;

  /**
   * Permet de savoir si il n'y a qu'un seul ingrédient du stock à afficher. Du coup, c'est afficher sur la même ligne.
   */
  onlyOne = true;
  /**
   * Si onlyOne = false, alors il y a deux états possibles,
   * expanded : affiche la liste des ingrédients de la recette et du stock.
   * <see also="collapsed">collapsed</see>
   */
  expanded = false;
  /**
   * Si onlyOne = false, alors il y a deux états possibles,
   * collapsed : cache la liste des ingrédients de la recette et du stock.
   * <see also="expanded">collapsed</see>
   */
  collapsed = false;

  /**
   * Affiche sur la dernière ligne celle qui permet d'ajouter un ingrédient stock au brassin.
   */
  created = true;

  constructor(ingredient: Ingredient, brew: Brew) {
    this.ingredient = ingredient;
    this.brew = brew;
  }

  public addBrewIngredient(bIng: BrewIngredient): void {
    this.getReceiptLinkToStock(bIng);
    this.manageDisplay();

  }

  public addBrewStock(bStock: BrewStock): void {
    if (bStock.brewIngredient) {
      const ing = this.getReceiptLinkToStock(bStock.brewIngredient);
      ing.addBrewStock(bStock);
    } else {
      this.brewStocksWithoutReceipt.push(bStock);
    }
    this.manageDisplay();
  }

  public shouldBeDisplay(index: number): boolean {
    if (index === 0) { return true; }
    else if (this.expanded === true) { return true; }
    return false;
  }

  public createBrewStockFromStock(evt: any, ing: BrewIngredient): void {

  }

  public createBrewStockFromQuantity(evt: any, ing: BrewIngredient): void {
    const value = +evt.srcElement.value;
    const brewStock = new BrewStock(undefined);

    brewStock.brew = this.brew;
    brewStock.quantity = value;
    brewStock.apply = false;
    if (ing !== undefined) {
      brewStock.brewIngredient = ing;
      const receipt = this.getReceiptLinkToStock(ing);
      receipt.addBrewStock(brewStock);
    }
    this.manageDisplay();
  }

  private manageDisplay(): void {
    if (this.brewIngredients.length + this.brewStocksWithoutReceipt.length === 0) {
      this.created = true;
    }
    if (this.brewIngredients.length + this.brewStocksWithoutReceipt.length === 1) {
      this.onlyOne = true;
      if (this.brewIngredients.length > 0 && this.brewIngredients[0].brewStocks.length === 0) {
        this.created = true;
      }
      else { this.created = false; }
      this.expanded = false;
      this.collapsed = false;
    }
    else {
      this.onlyOne = false;
      this.created = false;
      this.created = false;
      if (this.expanded === this.collapsed && this.expanded === false) {
        this.expanded = true;
      }
    }
  }

  private getReceiptLinkToStock(bIng: BrewIngredient): ReceiptLinkToStock {
    let index = this.brewIngredients.findIndex(x => x.brewIngredient.id === bIng.id);
    if (index < 0) {
      this.brewIngredients.push(new ReceiptLinkToStock(bIng));
      index = this.brewIngredients.length - 1;
    }
    return this.brewIngredients[index];
  }
}

export class ReceiptLinkToStock {
  brewIngredient: BrewIngredient;
  brewStocks = new Array<BrewStock>();

  constructor(bIng: BrewIngredient) {
    this.brewIngredient = bIng;
  }

  public addBrewStock(bStock: BrewStock) {
    this.brewStocks.push(bStock);
  }
}
