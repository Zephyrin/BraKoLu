import { MatDialogRef } from '@angular/material/dialog';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brew-ingredient-create',
  templateUrl: './brew-ingredient-create.component.html',
  styleUrls: ['./brew-ingredient-create.component.scss']
})
export class BrewIngredientCreateComponent implements OnInit {

  constructor(
    public ingredientService: IngredientService,
    public dialogRef: MatDialogRef<BrewIngredientCreateComponent>) {
    this.ingredientService.load();
  }

  ngOnInit(): void {
  }

  onSubmitClick() {
    this.dialogRef.close(this.ingredientService.selected);
  }

  onCancelClick() {
    this.dialogRef.close(undefined);
  }
}
