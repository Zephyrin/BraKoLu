import { Yeast } from '@app/_models/yeast';
import { Other } from '@app/_models/other';
import { Keg } from '@app/_models/keg';
import { Hop } from '@app/_models/hop';
import { Cereal } from '@app/_models/cereal';
import { Box } from '@app/_models/box';
import { BottleTop } from '@app/_models/bottleTop';
import { Bottle } from '@app/_models/bottle';
import { IngredientSearchService } from './ingredient-search.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { IngredientFactory } from '@app/_models/ingredientFactory';
import { IngredientHttpService } from './ingredient-http.service';
import { Injectable } from '@angular/core';
import { Ingredient } from '@app/_models';
import { CService, ValueViewChild } from '@app/_services/iservice';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class IngredientService extends CService<Ingredient>{
  public ingredientChildrenNames: ValueViewChild[] = [];

  public headers: ValueViewChild[] = [];

  public bottleType: ValueViewChild[] = [];

  public bottleVolume: ValueViewChild[] = [];

  public bottleTopSize: ValueViewChild[] = [];

  public cerealFormats: ValueViewChild[] = [];

  public cerealTypes: ValueViewChild[] = [];

  public hopTypes: ValueViewChild[] = [];

  public kegHead: ValueViewChild[] = [];

  public kegVolume: ValueViewChild[] = [];

  public yeastType: ValueViewChild[] = [];

  constructor(
    private h: IngredientHttpService,
    public datepipe: DatePipe) {
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

  public getDisplay(name: string, value: Ingredient): any {
    if (value === undefined || name === undefined) {
      return undefined;
    }
    if (name === 'childName') {
      return this.findInValueViewChild(this.ingredientChildrenNames, value[name]);
    }
    switch (value.childName) {
      case 'bottle':
        return this.getDisplayBottle(name, value as Bottle);
      case 'bottleTop':
        return this.getDisplayBottleTop(name, value as BottleTop);
      case 'box':
        return this.getDisplayBox(name, value as Box);
      case 'cereal':
        return this.getDisplayCereal(name, value as Cereal);
      case 'hop':
        return this.getDisplayHop(name, value as Hop);
      case 'keg':
        return this.getDisplayKeg(name, value as Keg);
      case 'other':
        break;
      case 'yeast':
        return this.getDisplayYeast(name, value as Yeast);
      default:
        break;
    }
    return value[name];
  }
  //#region Affichage par type d'ingrédient
  private getDisplayBottle(name: string, value: Bottle): any {
    switch (name) {
      case 'type':
        return this.findInValueViewChild(this.bottleType, value[name]);
      case 'volume':
        return this.findInValueViewChild(this.bottleVolume, value[name].toString());
      default:
        break;
    }
    return value[name];
  }
  private getDisplayBottleTop(name: string, value: BottleTop): any {
    switch (name) {
      case 'size':
        return this.findInValueViewChild(this.bottleTopSize, value[name].toString());
      default:
        break;
    }
    return value[name];
  }
  private getDisplayBox(name: string, value: Box): any {
    switch (name) {
      case 'bottle':
        // TODO
        break;
      default:
        break;
    }
    return value[name];
  }
  private getDisplayCereal(name: string, value: Cereal): any {
    switch (name) {
      case 'format':
        return this.findInValueViewChild(this.cerealFormats, value[name]);
      case 'type':
        return this.findInValueViewChild(this.cerealTypes, value[name]);
      default:
        break;
    }
    return value[name];
  }
  private getDisplayHop(name: string, value: Hop): any {
    switch (name) {
      case 'harvestYear':
        return this.datepipe.transform(value[name], 'y');
      case 'type':
        return this.findInValueViewChild(this.hopTypes, value[name]);
      default:
        break;
    }
    return value[name];
  }
  private getDisplayKeg(name: string, value: Keg): any {
    switch (name) {
      case 'head':
        return this.findInValueViewChild(this.kegHead, value[name]);
      case 'volume':
        return this.findInValueViewChild(this.kegVolume, value[name].toString());
      default:
        break;
    }
    return value[name];
  }
  private getDisplayYeast(name: string, value: Yeast): any {
    switch (name) {
      case 'productionYear':
        return this.datepipe.transform(value[name], 'y-MM');
      case 'type':
        return this.findInValueViewChild(this.yeastType, value[name].toString());
      default:
        break;
    }
    return value[name];
  }
  //#endregion
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
