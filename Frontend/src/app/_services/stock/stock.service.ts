import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { StockHttpService } from './stock-http.service';

import { Injectable } from '@angular/core';
import { IngredientStock } from '@app/_models';
import { CService, ValueViewChild } from '@app/_services/iservice';

@Injectable({
  providedIn: 'root'
})
export class StockService extends CService<IngredientStock>{

  public states: ValueViewChild[] = [];

  /* headers: ValueViewChild[] = [
     { value: 'name', viewValue: 'Nom' },
    { value: 'quantity', viewValue: 'Quantité' },
    { value: 'state', viewValue: 'État' },
    { value: 'creationDate', viewValue: 'Crée le' },
    { value: 'orderedDate', viewValue: 'Commandé le' },
    { value: 'endedDate', viewValue: 'Terminé le' }
  ]; */
  constructor(
    private h: StockHttpService,
    public datepipe: DatePipe) {
    super(h, undefined);
  }

  public initEnums(): void {
    if (this.states.length === 0) {
      this.h.getEnum('states').subscribe(response => {
        response.forEach(elt => {
          this.states.push(elt);
        });
      });
    }
    if (this.headers.length === 0) {
      this.h.getEnum('headers').subscribe(response => {
        response.forEach(elt => {
          this.headers.push(elt);
          this.displayedColumns.push(elt.value);
        });
      });
    }
  }

  public create(): IngredientStock {
    return new IngredientStock(undefined);
  }

  public createCpy(stock: IngredientStock): IngredientStock {
    return new IngredientStock(stock);
  }

  public createFormBasedOn(formBuilder: FormBuilder, value: IngredientStock): void {
    this.form = formBuilder.group({
      id: [''],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      state: ['', Validators.required],
      ingredient: ['', Validators.required]
    });
  }

  public getDisplay(name: string, value: IngredientStock): any {
    switch (name) {
      case 'name':
        return value.ingredient.name;
      case 'quantity':
        return value.quantityCalc() + ' ' + value.ingredient.unit;
      case 'state':
        return this.findInValueViewChild(this.states, value[name]);
      case 'creationDate':
      case 'orderedDate':
      case 'endedDate':
        return this.datepipe.transform(value[name], 'y-MM-dd');
      default:
        break;
    }
    return value[name];
  }
}
