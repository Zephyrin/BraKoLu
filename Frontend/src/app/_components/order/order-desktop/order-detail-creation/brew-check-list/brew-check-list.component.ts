import { Component, Input, OnInit } from '@angular/core';
import { MatChipSelectionChange } from '@angular/material/chips';
import { BrewDetail, OrderDetailCreation } from '@app/_mapper/order/order-detail-creation';

@Component({
  selector: 'app-brew-check-list',
  templateUrl: './brew-check-list.component.html',
  styleUrls: ['./brew-check-list.component.scss']
})
export class BrewCheckListComponent implements OnInit {
  @Input() orderDetailCreation: OrderDetailCreation;
  constructor() { }

  ngOnInit(): void {
  }

  selectedBrewChange(brewDetail: BrewDetail) {
    brewDetail.isApply = !brewDetail.isApply;
    if (brewDetail.isApply) {
      this.orderDetailCreation.addBrewDetail(brewDetail);
    } else {
      this.orderDetailCreation.removeBrewDetail();
    }
  }

  public selectionChange($evt: MatChipSelectionChange) {
    if ($evt.selected === true) {
      $evt.source.color = 'accent';
    } else {
      // On ne peut pas changer la couleur lorsque celui-ci n'est pas sélectionné...
      $evt.source.color = 'primary';
    }
  }
}
