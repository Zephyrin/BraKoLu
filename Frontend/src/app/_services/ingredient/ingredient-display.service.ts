import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IngredientDisplayService {

  public filterExpanded = true;

  constructor(
    public ingredientService: IngredientService,
  ) { }
}
