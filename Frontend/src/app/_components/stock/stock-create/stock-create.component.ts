import { IngredientStock } from '@app/_models/ingredientStock';
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
    protected formBuilder: FormBuilder,
    public ingredientService: IngredientService
  ) {
    super(dialogRef, service, formBuilder);
  }

  init() {
    this.ingredientService.load();
    const stock = new IngredientStock(undefined);
    this.createFormBasedOn(stock);
  }
}