import { BrewService } from '@app/_services/brew/brew.service';
import { BrewIngredientCreateComponent } from './../brew-ingredient-create/brew-ingredient-create.component';
import { MatDialog } from '@angular/material/dialog';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Brew, BrewIngredient } from '@app/_models/brew';
import { Component, Input, OnInit } from '@angular/core';
import { RemoveDialogComponent } from '@app/_components/helpers/remove-dialog/remove-dialog.component';

@Component({
  selector: 'app-brew-ingredient-desktop',
  templateUrl: './brew-ingredient-desktop.component.html',
  styleUrls: ['./brew-ingredient-desktop.component.scss']
})
export class BrewIngredientDesktopComponent implements OnInit {
  @Input() brew: Brew;
  @Input() ingredientService: IngredientService;
  @Input() brewService: BrewService;
  private inputIntervalBeforeSave: NodeJS.Timeout;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  addIngredient() {
    if (this.brew) {
      const dialogRef = this.dialog.open(BrewIngredientCreateComponent, { minWidth: '30em' });
      (dialogRef.componentInstance as unknown as BrewIngredientCreateComponent).ingredientService = this.ingredientService;
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.brewService.addIngredientToBrew(this.brew, result);
        }
      });
    }
  }

  hasChildren(childrenName: string): boolean {
    if (this.brew) {
      const length = this.brew.brewIngredients.filter(c => c.stock.ingredient.childName === childrenName).length;
      if (length > 0) {
        return true;
      }
    }
    return false;
  }

  getChildren(childrenName: string): BrewIngredient[] {
    if (this.brew) {
      const arr = this.brew.brewIngredients.filter(c => c.stock.ingredient.childName === childrenName);
      if (arr.length > 0) {
        return arr;
      }
    }
    return undefined;
  }

  updateIngredient(evt: any, ingredient: BrewIngredient) {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      (this.brewService as BrewService).updateIngredientToBrew(this.brew, ingredient, evt.srcElement.value);
      this.inputIntervalBeforeSave = undefined;
    }, 300);
  }

  deleteIngredient(evt: MouseEvent, ingredient: BrewIngredient) {
    evt.stopPropagation();
    const dialogRef = this.dialog.open(RemoveDialogComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as RemoveDialogComponent).title = ingredient.stock.ingredient.brewView();
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data === true) {
        this.brewService.deleteIngredientToBrew(this.brew, ingredient);
      }
    });
  }
}
