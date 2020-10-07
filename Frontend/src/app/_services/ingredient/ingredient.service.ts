import { IngredientSearchService } from './ingredient-search.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { IngredientFactory } from '@app/_models/ingredientFactory';
import { IngredientHttpService } from './ingredient-http.service';
import { Injectable } from '@angular/core';
import { Ingredient, Other, Cereal, Hop, Bottle, Box } from '@app/_models';
import { CService, ValueViewChild } from '@app/_services/iservice';

@Injectable({
  providedIn: 'root'
})
export class IngredientService extends CService<Ingredient>{
  public ingredientChildrenNames: ValueViewChild[] = [
    { value: 'cereal', viewValue: 'Céréale' },
    { value: 'hop', viewValue: 'Houblon' },
    { value: 'other', viewValue: 'Autre' },
    { value: 'bottle', viewValue: 'Bouteille' },
    { value: 'box', viewValue: 'Carton' },
    { value: 'keg', viewValue: 'Fût' }
  ];

  public headers: ValueViewChild[] = [
    { value: 'name', viewValue: 'Nom' },
    { value: 'unit', viewValue: 'Unité' },
    { value: 'unitFactor', viewValue: 'Facteur d\'unité' },
    { value: 'comment', viewValue: 'Commentaire' },
    { value: 'type', viewValue: 'Type' },
    { value: 'plant', viewValue: 'Plante' },
    { value: 'format', viewValue: 'Format' },
    { value: 'ebc', viewValue: 'EBC' },
    { value: 'volume', viewValue: 'Volume' },
    { value: 'color', viewValue: 'Couleur' },
    { value: 'capacity', viewValue: 'Capacité' },
    { value: 'acidAlpha', viewValue: 'Acid-Alpha' },
    { value: 'harvestYear', viewValue: 'Année de la récolte' },
    { value: 'childName', viewValue: 'Catégory' },
    { value: 'head', viewValue: 'Tête' }
  ];

  public cerealTypes: ValueViewChild[] = [
    { value: 'malt', viewValue: 'Malté' },
    { value: 'cru', viewValue: 'Cru' }
  ];

  public hopTypes: ValueViewChild[] = [
    { value: 'pellets_t90', viewValue: 'Pellets T90' },
    { value: 'pellets_t45', viewValue: 'Pellets T45' },
    { value: 'cones', viewValue: 'Cônes' }
  ];

  public cerealFormats: ValueViewChild[] = [
    { value: 'grain', viewValue: 'Grain' },
    { value: 'flocon', viewValue: 'Flocon' },
    { value: 'extrait', viewValue: 'Extrait' }
  ];

  public bottleType: ValueViewChild[] = [
    { value: 'long_neck', viewValue: 'Long Neck' },
    { value: 'champenoise', viewValue: 'Champenoise' },
  ];

  public bottleVolume: ValueViewChild[] = [
    { value: '75', viewValue: '75 cL' },
    { value: '33', viewValue: '33 cL' },
  ];

  public kegVolume: ValueViewChild[] = [
    { value: '20', viewValue: '20 L' },
    { value: '30', viewValue: '30 L' },
  ];

  public kegHead: ValueViewChild[] = [
    { value: 'A', viewValue: 'Type A' },
    { value: 'S', viewValue: 'Type S' },
  ];


  constructor(
    private h: IngredientHttpService) {
    super(h, new IngredientSearchService());
    (this.search as IngredientSearchService).setListIngredient(this.ingredientChildrenNames);
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
      case 'cereal':
        this.form.addControl('format', new FormControl('', Validators.required));
        this.form.addControl('plant', new FormControl('', Validators.required));
        this.form.addControl('type', new FormControl('', Validators.required));
        this.form.addControl('ebc', new FormControl('', Validators.required));
        break;
      case 'hop':
        this.form.addControl('type', new FormControl('', Validators.required));
        this.form.addControl('acidAlpha', new FormControl('', Validators.required));
        this.form.addControl('harvestYear', new FormControl('', Validators.required));
        break;
      case 'other':
        this.form.addControl('type', new FormControl('', Validators.required));
        break;
      case 'bottle':
        this.form.addControl('type', new FormControl('', Validators.required));
        this.form.addControl('volume', new FormControl('', Validators.required));
        this.form.addControl('color', new FormControl('', Validators.required));
        break;
      case 'box':
        this.form.addControl('capacity', new FormControl('', Validators.required));
        break;
      case 'keg':
        this.form.addControl('volume', new FormControl('', Validators.required));
        this.form.addControl('head', new FormControl('', Validators.required));
        break;
    }
  }
}