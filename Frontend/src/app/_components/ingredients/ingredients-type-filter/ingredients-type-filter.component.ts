import { IngredientSearchService } from '@app/_services/ingredient/ingredient-search.service';
import { MatChipSelectionChange } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { ValueViewChildSelected } from '@app/_models/ValueViewChildSelected';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ingredients-type-filter',
  templateUrl: './ingredients-type-filter.component.html',
  styleUrls: ['./ingredients-type-filter.component.scss']
})
export class IngredientsTypeFilterComponent implements OnInit, OnDestroy {
  private endUpdateSubscription: Subscription;

  get getSearch() { return this.service.search as IngredientSearchService; }

  constructor(private service: IngredientService) { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    if (this.endUpdateSubscription) { this.endUpdateSubscription.unsubscribe(); }
  }

  public selectionChange($evt: MatChipSelectionChange) {
    if ($evt.selected === true) {
      $evt.source.color = 'accent';
    } else {
      // On ne peut pas changer la couleur lorsque celui-ci n'est pas sélectionné...
      $evt.source.color = 'primary';
    }

  }

  public selectChange(child: ValueViewChildSelected) {
    (this.service.search as IngredientSearchService).updateSelected(child);
  }
}
