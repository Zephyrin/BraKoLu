import { StockService } from '@app/_services/stock/stock.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BaseComponent } from '@app/_components/base-component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent extends BaseComponent {

  constructor(
    protected breakpointObserver: BreakpointObserver,
    public service: StockService
  ) {
    super(breakpointObserver, service);
  }

}
