import { DialogOrderDetailDateComponent } from './../../order/order-desktop/order-detail-creation/dialog-order-detail-date/dialog-order-detail-date.component';
import { SupplierCreateComponent } from '@app/_components/supplier/supplier-create/supplier-create.component';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { SupplierDisplayService } from '@app/_services/supplier/supplier-display.service';
import { SupplierSearchService } from '@app/_services/supplier/supplier-search.service';
@Component({
  selector: 'app-supplier-toolbar',
  templateUrl: './supplier-toolbar.component.html',
  styleUrls: ['./supplier-toolbar.component.scss']
})
export class SupplierToolbarComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;

  get getSearch() { return this.service.search as SupplierSearchService; }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isSmallScreen$ = this.breakpointObserver.observe('(max-width: 1280px)').pipe(
    map(result => result.matches),
    shareReplay()
  );

  @Input() isDialog = false;
  constructor(
    public dialog: MatDialog,
    public service: SupplierService,
    public display: SupplierDisplayService,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: [this.getSearch.search.searchValue]
    });
    if (this.isDialog) { this.display.loadOtherConfig('dialog'); }
    else { this.display.loadOtherConfig(); }
  }

  ngOnDestroy(): void {
  }


  openCreateDialog(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(SupplierCreateComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as unknown as SupplierCreateComponent).create();
  }

  search(): void {
    this.getSearch.updateSearch(this.searchForm.value.search);
  }

  clear(): void {
    this.searchForm.patchValue({ search: '' });
    this.search();
  }
}
