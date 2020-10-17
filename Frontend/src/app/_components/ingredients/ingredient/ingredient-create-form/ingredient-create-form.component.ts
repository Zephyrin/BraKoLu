import { Bottle } from '@app/_models/bottle';
import { ValueViewChild } from '@app/_services/iservice';
import { ChildCreateFormBaseComponent } from '@app/_components/child-create-form-base-component';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Ingredient } from '@app/_models';

import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ingredient-create-form',
  templateUrl: './ingredient-create-form.component.html',
  styleUrls: ['./ingredient-create-form.component.scss']
})
export class IngredientCreateFormComponent extends ChildCreateFormBaseComponent {
  selectedChildName: ValueViewChild;
  constructor(
    public dialogRef: MatDialogRef<IngredientCreateFormComponent>,
    public service: IngredientService,
    protected formBuilder: FormBuilder,
  ) {
    super(dialogRef, service, formBuilder);
  }

  childNameChange($evt): void {
    let newIngredient: Ingredient;
    newIngredient = this.service.createWithChildName($evt.value);
    if (this.service.form) {
      newIngredient.comment = this.service.form.value.comment;
      newIngredient.name = this.service.form.value.name;
      newIngredient.unit = this.service.form.value.unit;
      newIngredient.unitFactor = this.service.form.value.unitFactor;
    }
    this.createFormBasedOn(newIngredient);
  }

  compareBottle(c1: Bottle, c2: Bottle): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
