import { BaseComponent } from '@app/_components/base-component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { OrderService } from '@app/_services/order/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent extends BaseComponent {

  constructor(
    protected breakpointObserver: BreakpointObserver,
    public service: OrderService
  ) {
    super(breakpointObserver);
  }

}
