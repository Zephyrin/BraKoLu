import { OrderService } from '@app/_services/order/order.service';
import { BrewService } from '@app/_services/brew/brew.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-order-pronostic',
  templateUrl: './order-pronostic.component.html',
  styleUrls: ['./order-pronostic.component.scss']
})
export class OrderPronosticComponent implements OnInit {
  @ViewChild('brews') brews: MatSelectionList;
  constructor(
    public brewService: BrewService,
    public service: OrderService) {
    this.brewService.load(true);
  }

  ngOnInit(): void {
  }

  pronostic(): void {
    const brews = [];
    this.brews.selectedOptions.selected.forEach(x => {
      brews.push(x.value);
    });
    this.service.getPronostic(brews);
  }

}
