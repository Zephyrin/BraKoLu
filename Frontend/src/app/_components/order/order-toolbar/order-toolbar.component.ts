import { OrderService } from '@app/_services/order/order.service';
import { OrderDisplayService } from '@app/_services/order/order-display.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-toolbar',
  templateUrl: './order-toolbar.component.html',
  styleUrls: ['./order-toolbar.component.scss']
})
export class OrderToolbarComponent implements OnInit {

  constructor(
    public orderDisplayService: OrderDisplayService,
    public orderService: OrderService
  ) { }

  ngOnInit(): void {
  }
}
