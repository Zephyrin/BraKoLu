import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { IngredientFactory } from '@app/_models/ingredientFactory';
import { IngredientHttpService } from './ingredient-http.service';
import { Injectable } from '@angular/core';
import { Ingredient, Other, Cereal } from '@app/_models';
import { CService, ValueViewChild } from '@app/_services/iservice';

@Injectable({
  providedIn: 'root'
})
export class IngredientService extends CService<Ingredient>{
  public ingredientChildrenNames: ValueViewChild[] = [
    { value: 'other', viewValue: 'Autre' },
    { value: 'cereal', viewValue: 'Céréal' },
    { value: 'hop', viewValue: 'Houblon' }
  ];

  public cerealTypes: ValueViewChild[] = [
    { value: 'malt', viewValue: 'Malt' },
    { value: 'cru', viewValue: 'Cru' }
  ];

  public cerealFormats: ValueViewChild[] = [
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
    return IngredientFactory.createNew(childName);
  }

  public createCpy(ingredient: Ingredient) {
    return IngredientFactory.createCpy(ingredient);
  }

  public createFormBasedOn(formBuilder: FormBuilder, value: Ingredient): void {
    this.form = formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      unit: [''],
      unitFactor: ['', Validators.required],
      comment: [''],
      childName: ['']
    });
    switch (value.childName) {
      case 'other':
        this.form.addControl('type', new FormControl('', Validators.required));
        break;
      case 'cereal':
        this.form.addControl('plant', new FormControl('', Validators.required));
        this.form.addControl('type', new FormControl('', Validators.required));
        this.form.addControl('format', new FormControl('', Validators.required));
        this.form.addControl('ebc', new FormControl('', Validators.required));
        break;
      case 'hop':
        this.form.addControl('type', new FormControl('', Validators.required));
        this.form.addControl('acidAlpha', new FormControl('', Validators.required));
        this.form.addControl('harvestYear', new FormControl('', Validators.required));
        break;
    }
  }
}
