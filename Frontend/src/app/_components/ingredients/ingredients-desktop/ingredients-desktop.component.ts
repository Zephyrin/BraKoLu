import { filter } from 'rxjs/operators';
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
  displayedColumns: string[] = ['name', 'comment', 'unit', 'unitFactor', 'childName',
    'type'
    ,   /* cereal */ 'plant', 'format', 'ebc'
    ,   /* bottle */ 'volume', 'color'
    , /* box */ 'capacity'
    ,   /* hop */ 'acidAlpha', 'harvestYear'
  ];

  private allSubIngredients: string[] = ['other', 'cereal', 'bottle', 'box', 'hop'];
  dataSource: any;
  @ViewChild('matTable') matTable: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public dialog: MatDialog) {
    super(dialog, IngredientCreateFormComponent);
  }

  public endUpdate() {
    this.selectColumnToDisplay();
    this.dataSource = new MatTableDataSource(this.service.model);
    this.selectColumnToDisplay();

    this.dataSource.sort = this.sort;
  }

  protected selectColumnToDisplay(): void {
    // Ajout des headers en fonction des ingrédients retourné par le backend
    const childNames = this.service.model
      .filter((ingredient, i, arr) => arr.findIndex(t => t.childName === ingredient.childName) === i)
      .map(x => x.childName);
    let countTypeIn = 0;
    this.allSubIngredients.forEach(element => {
      if (childNames.indexOf(element) < 0) {
        switch (element) {
          case 'other':
            countTypeIn++;
            break;
          case 'cereal':
            countTypeIn++;
            this.removeColumn('plant');
            this.removeColumn('format');
            this.removeColumn('ebc');
            break;
          case 'bottle':
            countTypeIn++;
            this.removeColumn('volume');
            this.removeColumn('color');
            break;
          case 'box':
            this.removeColumn('capacity');
            break;
          case 'hop':
            countTypeIn++;
            this.removeColumn('acidAlpha');
            this.removeColumn('harvestYear');
            break;
          default:
            break;
        }
      }
    });
    if (countTypeIn >= 4) {
      this.removeColumn('type');
    }

    childNames.forEach(element => {
      switch (element) {
        case 'other':
          this.addColumn('type');
          break;
        case 'cereal':
          this.addColumn('type');
          this.addColumn('plant');
          this.addColumn('format');
          this.addColumn('ebc');
          break;
        case 'bottle':
          this.addColumn('type');
          this.addColumn('volume');
          this.addColumn('color');
          break;
        case 'box':
          this.addColumn('capacity');
          break;
        case 'hop':
          this.addColumn('type');
          this.addColumn('acidAlpha');
          this.addColumn('harvestYear');
          break;
        default:
          break;
      }
    });
  }

  removeColumn(name: string): void {
    const index = this.displayedColumns.indexOf(name);
    if (index >= 0) {
      this.displayedColumns.splice(index, 1);
    }
  }

  addColumn(name: string): void {
    const index = this.displayedColumns.indexOf(name);
    if (index < 0) {
      this.displayedColumns.push(name);
    }
  }
}
