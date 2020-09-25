import { ChildBaseComponent } from '@app/_components/child-base-component';
import { IngredientCreateFormComponent } from './../ingredient/ingredient-create-form/ingredient-create-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-ingredients-desktop',
  templateUrl: './ingredients-desktop.component.html',
  styleUrls: ['./ingredients-desktop.component.scss']
})
export class IngredientsDesktopComponent extends ChildBaseComponent<IngredientCreateFormComponent> {
  displayedColumns: string[] = ['name', 'comment', 'unit', 'unitFactor'];

  dataSource: any;
  @ViewChild('matTable') matTable: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public dialog: MatDialog) {
    super(dialog, IngredientCreateFormComponent);
  }

  public endUpdate() {
    this.dataSource = new MatTableDataSource(this.service.model);
    this.dataSource.sort = this.sort;
  }
}
