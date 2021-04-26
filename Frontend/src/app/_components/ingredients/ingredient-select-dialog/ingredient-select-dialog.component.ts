import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { contentDialogMarginExpand, filterDialogExpand } from '@app/_components/animations/filter-animation';
import { Ingredient } from '@app/_models';
import { IngredientDisplayService } from '@app/_services/ingredient/ingredient-display.service';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';

@Component({
  selector: 'app-ingredient-select-dialog',
  templateUrl: './ingredient-select-dialog.component.html',
  styleUrls: ['./ingredient-select-dialog.component.scss'],
  animations: [
    filterDialogExpand,
    contentDialogMarginExpand
  ]
})
export class IngredientSelectDialogComponent implements OnInit {
  private previousSelected: Ingredient = undefined;
  constructor(
    public service: IngredientService,
    public display: IngredientDisplayService,
    public dialogRef: MatDialogRef<IngredientSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ingredient
  ) {
    this.previousSelected = this.service.selected;
    if (data !== null && data !== undefined) {
      const index = this.service.model.findIndex(c => c.id === data.id);
      if (index >= 0 && index < this.service.model.length) {
        this.service.setSelected(this.service.model[index]);
      }
    }
  }

  ngOnInit(): void {
  }


  onSubmitClick() {
    this.dialogRef.close(this.service.selected);
    this.service.selected = this.previousSelected;
  }

  onCancelClick() {
    this.dialogRef.close(undefined);
    this.service.selected = this.previousSelected;
  }
}
