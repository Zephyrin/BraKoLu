import { RemoveDialogComponent } from './../../helpers/remove-dialog/remove-dialog.component';
import { Subscription } from 'rxjs';
import { SupplierCreateComponent } from '@app/_components/supplier/supplier-create/supplier-create.component';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { FormBuilder } from '@angular/forms';
import { StockService } from '@app/_services/stock/stock.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChildCreateFormBaseComponent } from '@app/_components/child-create-form-base-component';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-stock-create',
  templateUrl: './stock-create.component.html',
  styleUrls: ['./stock-create.component.scss']
})
export class StockCreateComponent extends ChildCreateFormBaseComponent implements OnDestroy {
  private afterClosedDeleteSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<StockCreateComponent>,
    public dialogSupplier: MatDialog,
    public service: StockService,
    public supplierService: SupplierService,
    protected formBuilder: FormBuilder,
    public ingredientService: IngredientService,
    public dialog: MatDialog
  ) {
    super(dialogRef, service, formBuilder);
  }

  ngOnDestroy(): void {
    if (this.afterClosedDeleteSubscription) { this.afterClosedDeleteSubscription.unsubscribe(); }
  }

  init() {
    this.ingredientService.load(true);
    this.supplierService.load(true);
  }

  onSubmitClick(): void {
    if (this.service.form.invalid) {
      return;
    }
    const val = Object.assign({}, this.service.form.value);
    this.service.update(undefined, this.value, val);
  }

  compareId(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onDeleteClick() {
    this.service.clearErrors();
    const dialogRef = this.dialog.open(RemoveDialogComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as RemoveDialogComponent).title = this.service.getDisplay('name', this.value);
    (dialogRef.componentInstance as RemoveDialogComponent).element = this.value;
    (dialogRef.componentInstance as RemoveDialogComponent).service = this.service;
    this.afterClosedDeleteSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close();
      }
      if (this.afterClosedDeleteSubscription) { this.afterClosedDeleteSubscription.unsubscribe(); }
    });
  }
}
