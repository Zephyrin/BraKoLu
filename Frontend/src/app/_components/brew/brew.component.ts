import { StockService } from '@app/_services/stock/stock.service';
import { BrewSearchService } from '@app/_services/brew/brew-search.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BaseComponent } from '@app/_components/base-component';
import { Component } from '@angular/core';
import { BrewService } from '@app/_services/brew/brew.service';

@Component({
  selector: 'app-brew',
  templateUrl: './brew.component.html',
  styleUrls: ['./brew.component.scss']
})
export class BrewComponent extends BaseComponent {

  constructor(
    protected breakpointObserver: BreakpointObserver,
    public service: BrewService,
    public stockService: StockService
  ) {
    super(breakpointObserver);
    (service.search as BrewSearchService).brewSearch.clearStates();
    this.stockService.load(true);
  }

}
