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
  private afterClosedSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<StockCreateComponent>,
    public dialogSupplier: MatDialog,
    public service: StockService,
    public supplierService: SupplierService,
    protected formBuilder: FormBuilder,
    public ingredientService: IngredientService
  ) {
    super(dialogRef, service, formBuilder);
  }

  ngOnDestroy(): void {
    if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
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

  addSupplier(evt: any): void {
    const dialogRef = this.dialogSupplier.open(SupplierCreateComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as SupplierCreateComponent).create();
    this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.form.patchValue({ supplier: result });
      }
      if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
    });
  }
}
