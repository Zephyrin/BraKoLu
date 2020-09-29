import { Cereal } from './cereal';
import { Other } from './other';
import { Hop } from './hop';
import { Bottle } from './bottle';
import { Box } from './box';
import { Ingredient } from '@app/_models';
export class IngredientFactory {
  public static createCpy(ingredient: Ingredient): Ingredient {
    switch (ingredient.childName) {
      case 'other':
        return new Other(ingredient as Other);
      case 'cereal':
        return new Cereal(ingredient as Cereal);
      case 'hop':
        return new Hop(ingredient as Hop);
      case 'bottle':
        return new Bottle(ingredient as Bottle);
      case 'box':
        return new Box(ingredient as Box);
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
      case 'hop':
        return new Hop(undefined);
      case 'bottle':
        return new Bottle(undefined);
      case 'box':
        return new Box(undefined);
      default:
        throw new Error('Mmh c\'est con, je ne sais que faire avec : ' + childName + '.');
    }
  }
}
