import { Cereal } from './cereal';
import { Other } from './other';
import { Ingredient } from '@app/_models';
export class IngredientFactory {
  public static createCpy(ingredient: Ingredient): Ingredient {
    switch (ingredient.childName) {
      case 'other':
        return new Other(ingredient as Other);
      case 'cereal':
        return new Cereal(ingredient as Cereal);
      default:
        throw new Error('Que faire avec ' + ingredient.childName + ', j\'ai besoin d\'aide !!');
    }
  }

  public static createNew(childName: string): Ingredient {
    switch (childName) {
      case 'other':
        return new Other(undefined);
      case 'cereal':
        return new Cereal(undefined);
      default:
        throw new Error('Mmh c\'est con, je ne sais que faire avec : ' + childName + '.');
    }
  }
}
