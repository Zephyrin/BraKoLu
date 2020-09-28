import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component } from '@angular/core';
import { StockCreateComponent } from '@app/_components/stock/stock-create/stock-create.component';

@Component({
  selector: 'app-stock-mobile',
  templateUrl: './stock-mobile.component.html',
  styleUrls: ['./stock-mobile.component.scss']
})
export class StockMobileComponent extends ChildBaseComponent<StockCreateComponent> {

  constructor(public dialog: MatDialog) {
    super(dialog, StockCreateComponent);
  }
}
