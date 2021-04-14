import { StockCreateComponent } from './../stock-create/stock-create.component';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { StockDisplayService } from '@app/_services/stock/stock-display.service';
import { StockService } from '@app/_services/stock/stock.service';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { Component, OnInit } from '@angular/core';
import { RemoveDialogComponent } from '@app/_components/helpers/remove-dialog/remove-dialog.component';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit {
  private afterClosedSubscription: Subscription;

  constructor(
    public serviceSupplier: SupplierService,
    public service: StockService,
    public displayService: StockDisplayService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openUpdateDialog(event: MouseEvent, element: any): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(StockCreateComponent, { minWidth: '30em' });
    this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
      if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
    });
    (dialogRef.componentInstance as unknown as StockCreateComponent).update(element);
  }

  openDeleteDialog(evt: MouseEvent, element: any, title: string): void {
    evt.stopPropagation();
    this.service.clearErrors();
    const dialogRef = this.dialog.open(RemoveDialogComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as RemoveDialogComponent).title = title;
    (dialogRef.componentInstance as RemoveDialogComponent).element = element;
    (dialogRef.componentInstance as RemoveDialogComponent).service = this.service;
  }
}
