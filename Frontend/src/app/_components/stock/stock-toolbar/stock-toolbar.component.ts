import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StockCreateComponent } from '@app/_components/stock/stock-create/stock-create.component';
import { StockService } from '@app/_services/stock/stock.service';
import { MatDialog } from '@angular/material/dialog';
import { StockSearchService } from '@app/_services/stock/stock-search.service';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockDisplayService } from '@app/_services/stock/stock-display.service';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-stock-toolbar',
  templateUrl: './stock-toolbar.component.html',
  styleUrls: ['./stock-toolbar.component.scss']
})
export class StockToolbarComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;
  private afterClosedSubscription: Subscription;

  get getSearch() { return this.service.search as StockSearchService; }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isSmallScreen$ = this.breakpointObserver.observe('(max-width: 1280px)').pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    public dialog: MatDialog,
    public service: StockService,
    public stockDisplay: StockDisplayService,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver
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

  clear(): void {
    this.searchForm.patchValue({ search: '' });
    this.search();
  }
}
