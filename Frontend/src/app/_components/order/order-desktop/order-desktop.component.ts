import { MatDialog } from '@angular/material/dialog';
import { OrderCreateComponent } from './../order-create/order-create.component';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-order-desktop',
  templateUrl: './order-desktop.component.html',
  styleUrls: ['./order-desktop.component.scss']
})
export class OrderDesktopComponent extends ChildBaseComponent<OrderCreateComponent> implements AfterViewInit {

  constructor(
    public dialog: MatDialog
  ) {
    super(dialog, OrderCreateComponent);
  }

  ngAfterViewInit(): void {
  }
}
