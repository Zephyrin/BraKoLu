import { StockSearchService } from './stock-search.service';
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
  private nbEnumLeft = 0;
  constructor(
    private h: StockHttpService,
    public datepipe: DatePipe) {
    super(h, new StockSearchService());
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

  public create(): IngredientStock {
    return new IngredientStock(undefined);
  }

  public createPart(): IngredientStock {
    const ing = new IngredientStock(undefined, false, false);

    return ing;
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
      ingredient: ['', Validators.required],
      supplier: ['']
    });
  }

  public patchValue(value: IngredientStock): void {
    this.form.patchValue(value);
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
      case 'receivedDate':
        return this.datepipe.transform(value[name], 'dd-MM-y');
      case 'supplier':
        return value.supplier?.name;
      default:
        break;
    }
    return value[name];
  }
}
