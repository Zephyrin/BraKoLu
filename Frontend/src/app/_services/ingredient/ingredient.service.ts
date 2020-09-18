import { IngredientHttpService } from './ingredient-http.service';
import { Injectable } from '@angular/core';
import { Ingredient, Other, Cereal } from '@app/_models';
import { CService } from '@app/_services/iservice';

export interface IngredientChildName {
  value: string;
  viewValue: string;
}
@Injectable({
  providedIn: 'root'
})
export class IngredientService extends CService<Ingredient>{
  public ingredientChildrenNames: IngredientChildName[] = [
    { value: 'other', viewValue: 'Autre' },
    { value: 'cereal', viewValue: 'Céréal' }
  ];

  public cerealTypes: IngredientChildName[] = [
    { value: 'malt', viewValue: 'Malt' },
    { value: 'cru', viewValue: 'Cru' }
  ];

  public cerealFormats: IngredientChildName[] = [
    { value: 'grain', viewValue: 'Grain' },
    { value: 'flocon', viewValue: 'Flocon' },
    { value: 'extrait', viewValue: 'Extrait' }
  ];

  constructor(
    private h: IngredientHttpService) {
    super(h);
  }

  public create(): Ingredient {
    throw new Error('Tu ne peux pas créer d\'ingrédient générique comme ça.');
  }

  public createWithChildName(childName: string): Ingredient {
    switch (childName) {
      case 'other':
        return new Other(undefined);
      case 'cereal':
        return new Cereal(undefined);
      default:
        throw new Error('Je ne connais pas '
          + childName
          + '. Du coup je ne peux pas te créer un ingrédient.');
    }
  }

  public createWithIngredient(ingredient: Ingredient): Ingredient {
    switch (ingredient.childName) {
      case 'other':
        return new Other(ingredient as Other);
      case 'cereal':
        return new Cereal(ingredient as Cereal);
      default:
        throw new Error('Je ne connais pas '
          + ingredient.childName
          + '. Du coup je ne peux pas te créer un ingrédient avec '
          + ingredient.name);
    }
  }

  public createCpy(value: Ingredient) {
    switch (value.childName) {
      case 'other':
        return new Other(value as Other);
      default:
        throw new Error('Je ne connais pas '
          + value.childName
          + '. Du coup je ne peux pas te créer un ingrédient');
    }
  }
}
