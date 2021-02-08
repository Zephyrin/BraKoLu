import { SupplierService } from '@app/_services/supplier/supplier.service';
import { Ingredient } from '@app/_models';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { FormBuilder } from '@angular/forms';
import { StockService } from '@app/_services/stock/stock.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ChildCreateFormBaseComponent } from '@app/_components/child-create-form-base-component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-create',
  templateUrl: './stock-create.component.html',
  styleUrls: ['./stock-create.component.scss']
})
export class StockCreateComponent extends ChildCreateFormBaseComponent {

  constructor(
    public dialogRef: MatDialogRef<StockCreateComponent>,
    public service: StockService,
    public supplierService: SupplierService,
    protected formBuilder: FormBuilder,
    public ingredientService: IngredientService
  ) {
    super(dialogRef, service, formBuilder);
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
    val.quantity = val.quantity * val.ingredient.unitFactor;
    this.service.update(undefined, this.value, val);
  }

  compareId(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
