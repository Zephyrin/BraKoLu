import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValueViewChild } from '@app/_services/iservice';

export class BrewState {
  state: ValueViewChild;
  isDoneForm: FormGroup;
  isDone: boolean;
  isCurrent: boolean;
  public constructor(state: ValueViewChild, formBuilder: FormBuilder, isDone: boolean, isCurrent: boolean) {
    this.state = state;
    this.isDone = isDone;
    this.isCurrent = isCurrent;
    this.isDoneForm = formBuilder.group({
      isDone: [isDone, Validators.requiredTrue]
    });
  }
}
