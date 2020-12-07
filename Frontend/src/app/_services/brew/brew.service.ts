import { BrewSearchService } from './brew-search.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { BrewHttpService } from './brew-http.service';
import { CService, ValueViewChild } from '@app/_services/iservice';
import { Injectable, SimpleChange } from '@angular/core';
import { Brew, BrewIngredient as BrewIngredient } from '@app/_models/brew';
import { Ingredient } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class BrewService extends CService<Brew> {
  public states: ValueViewChild[] = [];
  private nbEnumLeft = 0;
  constructor(
    private h: BrewHttpService,
    public datepipe: DatePipe) {
    super(h, new BrewSearchService());
  }

  public initEnums(): void {
    this.nbEnumLeft = 0;
    if (this.states.length === 0) {
      this.nbEnumLeft++;
      this.h.getEnum('states').subscribe(response => {
        response.forEach(elt => {
          this.states.push(elt);
        });
        this.nbEnumLeft--;
        if (this.nbEnumLeft <= 0) {
          this.initEnumDone.next(true);
        }
      });
    }
    if (this.headers.length === 0) {
      this.nbEnumLeft++;
      this.h.getEnum('headers').subscribe(response => {
        response.forEach(elt => {
          this.headers.push(elt);
          this.displayedColumns.push(elt.value);
        });
        this.nbEnumLeft--;
        if (this.nbEnumLeft <= 0) {
          this.initEnumDone.next(true);
        }
      });
    }
    if (this.nbEnumLeft <= 0) {
      this.initEnumDone.next(true);
    }
  }

  public create(): Brew {
    return new Brew(undefined);
  }

  public createPart(): Brew {
    const brew = new Brew(undefined, false);

    return brew;
  }

  public createCpy(brew: Brew): Brew {
    return new Brew(brew);
  }

  public createFormBasedOn(formBuilder: FormBuilder, value: Brew): void {
    this.form = formBuilder.group({
      id: [''],
      number: ['', Validators.required],
      name: ['', Validators.required],
      abv: ['125', Validators.required],
      ibu: ['0', Validators.required],
      ebc: ['11', Validators.required],
      state: ['created', Validators.required],
      producedQuantity: [''],
      started: [''],
      ended: [''],
    });
  }

  public getDisplay(name: string, value: Brew): any {
    switch (name) {
      case 'state':
        return this.findInValueViewChild(this.states, value[name]);
      case 'created':
      case 'ended':
      case 'started':
        return this.datepipe.transform(value[name], 'y-MM-dd');
      default:
        break;
    }
    return value[name];
  }

  public addIngredientToBrew(brew: Brew, ingredient: Ingredient) {
    const ingredientToBrew = new BrewIngredient(undefined);
    ingredientToBrew.brew = brew;
    ingredientToBrew.ingredient = ingredient;
    ingredientToBrew.quantity = ingredientToBrew.quantity;
    (this.http as BrewHttpService).addIngredientToBrew(brew.id, ingredientToBrew).subscribe(response => {
      ingredientToBrew.id = response.id;
      brew.brewIngredients.push(ingredientToBrew);
      const simpleChange = new SimpleChange(null, ingredientToBrew, true);
      this.end(true, simpleChange);
    }, err => {
      this.end(true, undefined, err);
    });
  }

  public updateIngredientToBrew(brew: Brew, ingredient: BrewIngredient, newValue: number) {
    const newIngredient = new BrewIngredient(undefined);
    newIngredient.quantity = newValue;
    (this.http as BrewHttpService).updateIngredientToBrew(brew.id, ingredient.id, newIngredient).subscribe(response => {
      ingredient.quantity = newValue;
      const simpleChange = new SimpleChange(ingredient, ingredient, true);
      this.end(true, simpleChange);
    }, err => {
      this.end(true, undefined, err);
    });
  }

  public deleteIngredientToBrew(brew: Brew, ingredient: BrewIngredient) {
    (this.http as BrewHttpService).deleteIngredientToBrew(brew.id, ingredient.id).subscribe(response => {
      const index = brew.brewIngredients.findIndex(x => x.id === ingredient.id);
      const simpleChange = new SimpleChange(null, null, true);
      if (index >= 0) {
        const removed = brew.brewIngredients.splice(index, 1);
        simpleChange.previousValue = removed[0];
      }
      this.end(true, simpleChange);
    }, err => {
      if (err.code === 404) {
        const index = brew.brewIngredients.findIndex(x => x.id === ingredient.id);
        const simpleChange = new SimpleChange(null, null, true);
        if (index >= 0) {
          const removed = brew.brewIngredients.splice(index, 1);
          simpleChange.previousValue = removed[0];

        }
        this.end(true, simpleChange);
      } else {
        this.end(true, undefined, err);
      }
    });
  }

  protected updateData(newData: Brew, oldData: Brew, modelUsedForUpdate: Brew) {
    oldData.update(newData);
  }
}
