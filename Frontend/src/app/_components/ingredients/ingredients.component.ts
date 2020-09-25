import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BaseComponent } from '@app/_components/base-component';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent extends BaseComponent {

  constructor(
    protected breakpointObserver: BreakpointObserver,
    public service: IngredientService) {
    super(breakpointObserver, service);
  }
}
