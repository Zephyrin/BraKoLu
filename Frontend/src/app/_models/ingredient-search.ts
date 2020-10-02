import { ValueViewChild } from '@app/_services/iservice';
export class IngredientSearch {
  selectChildren = [];

}

export class IngredientChildrenSelected implements ValueViewChild {
  value: string;
  viewValue: string;
  selected: boolean;

  constructor(valueViewChild: ValueViewChild) {
    this.value = valueViewChild.value;
    this.viewValue = valueViewChild.viewValue;
    this.selected = false;
  }
}
