import { ValueViewChild } from '@app/_services/iservice';


export class ValueViewChildSelected implements ValueViewChild {
  value: string;
  viewValue: string;
  selected: boolean;

  constructor(valueViewChild: ValueViewChild, selected: boolean) {
    this.value = valueViewChild.value;
    this.viewValue = valueViewChild.viewValue;
    this.selected = selected;
  }
}
