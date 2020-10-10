import { IngredientSearchService } from './ingredient-search.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { IngredientFactory } from '@app/_models/ingredientFactory';
import { IngredientHttpService } from './ingredient-http.service';
import { Injectable } from '@angular/core';
import { Ingredient } from '@app/_models';
import { CService, ValueViewChild } from '@app/_services/iservice';

@Injectable({
  providedIn: 'root'
})
export class IngredientService extends CService<Ingredient>{
  public ingredientChildrenNames: ValueViewChild[] = [];

  public headers: ValueViewChild[] = [];

  public cerealTypes: ValueViewChild[] = [];

  public hopTypes: ValueViewChild[] = [];

  public cerealFormats: ValueViewChild[] = [];

  public bottleType: ValueViewChild[] = [];

  public bottleVolume: ValueViewChild[] = [];

  public kegVolume: ValueViewChild[] = [];

  public kegHead: ValueViewChild[] = [];

  public yeastType: ValueViewChild[] = [];

  public bottleTopSize: ValueViewChild[] = [];

  constructor(
    private h: IngredientHttpService) {
    super(h, new IngredientSearchService());
  }

  /**
   * Initialise toutes les énumérations d'ingredient.service.
   */
  public initEnums(): void {
    this.initEnum(this.cerealTypes, 'cereal', 'types');
    this.initEnum(this.cerealFormats, 'cereal', 'formats');
    this.initEnum(this.bottleType, 'bottle', 'types');
    this.initEnum(this.bottleVolume, 'bottle', 'volume');
    this.initEnum(this.bottleTopSize, 'bottleTop', 'sizes');
    this.initEnum(this.hopTypes, 'hop', 'types');
    this.initEnum(this.kegHead, 'keg', 'head');
    this.initEnum(this.kegVolume, 'keg', 'volume');
    this.initEnum(this.yeastType, 'yeast', 'types');
    this.initEnum(this.ingredientChildrenNames, undefined, 'childrenNames', this.upadteListIngredientSearch);
    this.initEnum(this.headers, undefined, 'headers');
  }

  /**
   * Permet de mettre à jour le tableau ValueViewChild en se basant sur l'enum reçu du serveur.
   *
   * @param enumVal Le tableau de l'enum que l'on souhaite mettre à jour avec les résultats de la requête http.
   * Par example this.headers ou this.hopTypes.
   * @param childName Le nom du sous ingrédients ou undefined si l'on souhaite aller uniquement sur un ingrédient.
   * @param enumName Le nom de l'enum que l'on souhaite récupérer de la base de données.
   * @param callback Une fonction permettant de mettre à jour d'autre module sur le retoure de la requête.
   */
  private initEnum(
    enumVal: ValueViewChild[],
    childName: string,
    enumName: string,
    callback: (search: IngredientSearchService, n: ValueViewChild[]) => void = null
  ): void {
    if (enumVal === undefined || enumVal.length === 0) {
      this.h.getEnum(childName, enumName).subscribe(response => {
        response.forEach(elt => {
          enumVal.push(elt);
        });
        if (callback !== null) {
          callback(this.search as IngredientSearchService, enumVal);
        }
      });
    }
  }

  /**
   * Met à jour la liste des sous ingrédients dans le module de recherche.
   * Vue que c'est utilisé dans un callback, je n'arrive pas à utiliser « this » du coup je passe directement le module
   * à la fonction. C'est temporaire tant qu'il n'y en a pas d'autre.
   */
  private upadteListIngredientSearch(search: IngredientSearchService, n: ValueViewChild[]): void {
    search.setListIngredient(n);
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
        this.form.addControl('harvestYear', new FormControl('',
          [Validators.required,
          Validators.pattern('^[0-9]{4}$')
          ]));
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
      case 'yeast':
        this.form.addControl('type', new FormControl('', Validators.required));
        this.form.addControl('productionYear',
          new FormControl('',
            [Validators.required,
            Validators.pattern('^[0-9]{4}-(0[1-9])|(1[0-2])$')
            ]));
        break;
      case 'bottleTop':
        this.form.addControl('size', new FormControl('', Validators.required));
        this.form.addControl('color', new FormControl('', Validators.required));
        break;
    }
  }
}
