import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatChipSelectionChange } from '@angular/material/chips';
import { ValueViewChildSelected } from '@app/_models/ValueViewChildSelected';
import { StockSearchService } from '@app/_services/stock/stock-search.service';
import { StockService } from '@app/_services/stock/stock.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-state-filter',
  templateUrl: './stock-state-filter.component.html',
  styleUrls: ['./stock-state-filter.component.scss']
})
export class StockStateFilterComponent implements OnInit, OnDestroy {
  @Output() selectedStates = new EventEmitter<string[]>();

  private endUpdateSubscription: Subscription;

  public model: ValueViewChildSelected[] = [];
  constructor(private service: StockService) { }

  ngOnInit(): void {
    (this.service.search as StockSearchService).stockSearch?.states?.forEach(value => {
      this.model.push(new ValueViewChildSelected({ value, viewValue: undefined }, true));
    });
    this.endUpdateSubscription = this.service.endUpdate.subscribe(data => {
      if (data === undefined) {
        this.service.states.forEach(elt => {
          const index = this.model.findIndex(x => x.value === elt.value);
          if (index < 0) {
            this.model.push(new ValueViewChildSelected(elt, false));
          } else {
            this.model[index].viewValue = elt.viewValue;
          }
        });
      }
    });
    this.service.states.forEach(elt => {
      const index = this.model.findIndex(x => x.value === elt.value);
      if (index < 0) {
        this.model.push(new ValueViewChildSelected(elt, false));
      } else {
        this.model[index].viewValue = elt.viewValue;
      }
    });
  }

  ngOnDestroy(): void {

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
    child.selected = !child.selected;
    this.selectedStates.emit(this.model.filter(e => e.selected).map(e => e.value));
  }

}
