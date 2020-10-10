import { FormBuilder, Validators } from '@angular/forms';
import { StockHttpService } from './stock-http.service';

import { Injectable } from '@angular/core';
import { IngredientStock } from '@app/_models';
import { CService, ValueViewChild } from '@app/_services/iservice';

@Injectable({
  providedIn: 'root'
})
export class StockService extends CService<IngredientStock>{
  public states: ValueViewChild[] = [
    { value: 'created', viewValue: 'Créé' },
    { value: 'ordered', viewValue: 'Commandé' },
    { value: 'stocked', viewValue: 'Reçu' },
    { value: 'sold_out', viewValue: 'Épuisé' }
  ];
  constructor(
    private h: StockHttpService) {
    super(h, undefined);
  }

  public initEnums(): void {

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
}
