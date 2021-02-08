import { StockCreateComponent } from '@app/_components/stock/stock-create/stock-create.component';
import { StockService } from '@app/_services/stock/stock.service';
import { MatDialog } from '@angular/material/dialog';
import { StockSearchService } from '@app/_services/stock/stock-search.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockDisplayService } from '@app/_services/stock/stock-display.service';

@Component({
  selector: 'app-stock-toolbar',
  templateUrl: './stock-toolbar.component.html',
  styleUrls: ['./stock-toolbar.component.scss']
})
export class StockToolbarComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;
  private afterClosedSubscription: Subscription;

  get getSearch() { return this.service.search as StockSearchService; }

  constructor(
    public dialog: MatDialog,
    public service: StockService,
    public stockDisplay: StockDisplayService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: [this.getSearch.stockSearch.searchValue]
    });
  }

  ngOnDestroy(): void {
    if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
  }


  openCreateDialog(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(StockCreateComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as unknown as StockCreateComponent).create();
    this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
      if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
    });
  }

  search(): void {
    this.getSearch.updateSearch(this.searchForm.value.search);
  }
}
