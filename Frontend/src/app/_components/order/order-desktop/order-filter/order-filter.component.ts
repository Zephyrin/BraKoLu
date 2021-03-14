import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatChipSelectionChange } from '@angular/material/chips';
import { ValueViewChildSelected } from '@app/_models/ValueViewChildSelected';
import { OrderSearchService } from '@app/_services/order/order-search.service';
import { OrderService } from '@app/_services/order/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.scss']
})
export class OrderFilterComponent implements OnInit, OnDestroy {

  @Output() selectedStates = new EventEmitter<string[]>();

  private endUpdateSubscription: Subscription;

  public model: ValueViewChildSelected[] = [];
  constructor(private service: OrderService) { }

  ngOnInit(): void {
    (this.service.search as OrderSearchService).orderSearch?.states?.forEach(value => {
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
    child.selected = !child.selected;
    this.selectedStates.emit(this.model.filter(e => e.selected).map(e => e.value));
  }
}
