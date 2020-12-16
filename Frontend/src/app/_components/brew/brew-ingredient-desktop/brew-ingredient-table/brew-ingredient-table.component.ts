import { BrewService } from '@app/_services/brew/brew.service';
import { BrewIngredientByType } from './../brew-ingredient-desktop.component';
import { BrewIngredient } from '@app/_models/brew';
import { MatDialog } from '@angular/material/dialog';
import { RemoveDialogComponent } from '@app/_components/helpers/remove-dialog/remove-dialog.component';
import { Subscription } from 'rxjs';
import { ValueViewChild } from '@app/_services/iservice';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort } from '@angular/material/sort';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-brew-ingredient-table',
  templateUrl: './brew-ingredient-table.component.html',
  styleUrls: ['./brew-ingredient-table.component.scss']
})
export class BrewIngredientTableComponent implements OnInit, AfterViewInit {
  @Input() brewIngredientByType: BrewIngredientByType;
  @ViewChild(MatSort) sort: MatSort;
  private afterClosedSubscription: Subscription;
  private inputIntervalBeforeSave: any;

  constructor(
    public dialog: MatDialog,
    public ingredientService: IngredientService,
    public brewService: BrewService) { }

  ngOnInit(): void {
    this.brewIngredientByType.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
  }

  getDisplay(column: string, element: BrewIngredient) {
    if (column === 'quantity') {
      return (element.quantity / element.ingredient.unitFactor) + ' ' + element.ingredient.unit;
    } else {
      return this.ingredientService.getDisplay(column, element.ingredient);
    }
  }
  dropListDropped(event: CdkDragDrop<ValueViewChild>) {
    if (event) {
      moveItemInArray(this.brewIngredientByType.displayedColumns, event.previousIndex, event.currentIndex);
      const elt = this.brewIngredientByType.displayedColumns[event.currentIndex];
      const index = this.ingredientService.headers.findIndex(x => x.value === elt);
      moveItemInArray(this.ingredientService.headers, index, event.currentIndex);
      localStorage.setItem(this.ingredientService.constructor.name + '_headers_brew_ingredient',
        JSON.stringify(this.ingredientService.headers));
    }
  }

  openDeleteDialog(evt: MouseEvent, element: BrewIngredient, title: string): void {
    evt.stopPropagation();
    const dialogRef = this.dialog.open(RemoveDialogComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as RemoveDialogComponent).title = title;
    this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result && result.data === true) {
        this.brewService.deleteIngredientToBrew(this.brewIngredientByType.brew, element);
      }
      if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
    });
  }

  updateIngredient(evt: any, ingredient: BrewIngredient) {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      (this.brewService as BrewService).updateIngredientToBrew(
        this.brewIngredientByType.brew,
        ingredient,
        +evt.srcElement.value);
      this.inputIntervalBeforeSave = undefined;
    }, 300);
  }
}
