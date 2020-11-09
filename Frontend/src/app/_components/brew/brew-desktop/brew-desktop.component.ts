import { BrewService } from '@app/_services/brew/brew.service';
import { BrewIngredientCreateComponent } from './../brew-ingredient-create/brew-ingredient-create.component';
import { IngredientsDesktopComponent } from './../../ingredients/ingredients-desktop/ingredients-desktop.component';
import { BrewIngredient } from './../../../_models/brew';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Brew } from '@app/_models/brew';
import { MatTableDataSource } from '@angular/material/table';
import { TableComponent } from '@app/_components/helpers/table/table.component';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { BrewCreateComponent } from './../brew-create/brew-create.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ValueViewChild } from '@app/_services/iservice';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-brew-desktop',
  templateUrl: './brew-desktop.component.html',
  styleUrls: ['./brew-desktop.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BrewDesktopComponent extends ChildBaseComponent<BrewCreateComponent> implements AfterViewInit {
  @ViewChild('Table') tableComponent: TableComponent;
  dataSource: any = [];
  @ViewChild(MatSort) sort: MatSort;
  public selected: Brew | null;

  private inputIntervalBeforeSave;
  constructor(
    public dialog: MatDialog,
    public serviceIngredient: IngredientService) {
    super(dialog, BrewCreateComponent);
    serviceIngredient.load();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    merge(this.sort.sortChange)
      .pipe(tap(() => {
        this.service.sort.change(this.sort.active, this.sort.direction);
      })).subscribe();
  }

  public endUpdate() {
    this.dataSource = new MatTableDataSource(this.service.model);
    const index = this.service.displayedColumns.findIndex(x => x === 'action');
    if (index < 0) {
      this.service.displayedColumns.push('action');
    }
    else if (index < this.service.displayedColumns.length - 1) {
      moveItemInArray(this.service.displayedColumns, index, this.service.displayedColumns.length - 1);
    }
    this.dataSource.sort = this.sort;
  }

  dropListDropped(event: CdkDragDrop<ValueViewChild>) {
    if (event) {
      moveItemInArray(this.service.displayedColumns, event.previousIndex, event.currentIndex);
      const elt = this.service.displayedColumns[event.currentIndex];
      const index = this.service.headers.findIndex(x => x.value === elt);
      moveItemInArray(this.service.headers, index, event.currentIndex);
      localStorage.setItem(this.service.constructor.name + '_headers', JSON.stringify(this.service.headers));
      this.endUpdate();
    }
  }

  hasChildren(element: Brew, childrenName: string): boolean {
    if (element) {
      const length = element.brewIngredients.filter(c => c.stock.ingredient.childName === childrenName).length;
      if (length > 0) {
        return true;
      }
    }
    return false;
  }

  getChildren(element: Brew, childrenName: string): BrewIngredient[] {
    if (element) {
      const arr = element.brewIngredients.filter(c => c.stock.ingredient.childName === childrenName);
      if (arr.length > 0) {
        return arr;
      }
    }
    return undefined;
  }

  addIngredient(element: Brew) {
    if (element) {
      const dialogRef = this.dialog.open(BrewIngredientCreateComponent, { minWidth: '30em' });
      (dialogRef.componentInstance as unknown as BrewIngredientCreateComponent).ingredientService = this.serviceIngredient;
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          (this.service as BrewService).addIngredientToBrew(element, result);
        }
      });
    }
  }

  updateIngredient(evt, element: Brew, ingredient: BrewIngredient) {
    if (this.inputIntervalBeforeSave) {
      clearInterval(this.inputIntervalBeforeSave);
    }
    this.inputIntervalBeforeSave = setInterval(() => {
      clearInterval(this.inputIntervalBeforeSave);
      (this.service as BrewService).updateIngredientToBrew(element, ingredient, evt.srcElement.value);
      this.inputIntervalBeforeSave = undefined;
    }, 300);
  }

  expandRow(event, row: Brew) {
    event.stopPropagation();
    this.selected = this.selected === row ? null : row;
  }
}
