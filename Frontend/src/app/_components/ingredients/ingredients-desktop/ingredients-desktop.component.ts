import { IngredientDisplayService } from '@app/_services/ingredient/ingredient-display.service';
import { TableComponent } from '@app/_components/helpers/table/table.component';
import { ValueViewChildSelected } from '@app/_models/ValueViewChildSelected';
import { IngredientSearchService } from '@app/_services/ingredient/ingredient-search.service';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { IngredientCreateFormComponent } from './../ingredient/ingredient-create-form/ingredient-create-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, AfterViewInit, OnInit, SimpleChange } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-ingredients-desktop',
  templateUrl: './ingredients-desktop.component.html',
  styleUrls: ['./ingredients-desktop.component.scss']
})
export class IngredientsDesktopComponent extends ChildBaseComponent<IngredientCreateFormComponent> implements AfterViewInit {
  @ViewChild('tableComponent') tableComponent: TableComponent;

  constructor(
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    public displayService: IngredientDisplayService) {
    super(dialog, breakpointObserver);
    this.componentOrTemplateRef = IngredientCreateFormComponent;
  }

  // Helper pour passer de IService à IngredientService
  get getService() { return this.service as IngredientService; }
  get getSearch() { return this.service.search as IngredientSearchService; }

  public selectIngredientChange(child: ValueViewChildSelected) {
    this.getSearch.updateSelected(child);
  }

  ngAfterViewInit(): void {
    this.tableComponent.UpdateComponentOrTemplateRef(IngredientCreateFormComponent);
  }


  public endUpdate(change: SimpleChange) {
    this.selectColumnToDisplay();

    this.tableComponent.endUpdate(change);
  }

  protected selectColumnToDisplay(): void {
    // Ajout des headers en fonction des ingrédients retourné par le backend
    const childNames = this.service.model
      .filter((ingredient, i, arr) => arr.findIndex(t => t.childName === ingredient.childName) === i)
      .map(x => x.childName);
    let countTypeIn = 0;
    // On ajoute les communs
    this.addColumn('name');
    this.addColumn('comment');
    this.addColumn('unit');
    this.addColumn('unitFactor');
    this.addColumn('childName');
    this.getService.ingredientChildrenNames.forEach(element => {
      if (childNames.indexOf(element.value) < 0) {
        switch (element.value) {
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
          case 'keg':
            this.removeColumn('volume');
            this.removeColumn('head');
            break;
          case 'bottleTop':
            this.removeColumn('size');
            this.removeColumn('color');
            break;
          case 'yeast':
            countTypeIn++;
            this.removeColumn('type');
            this.removeColumn('productionYear');
            break;
          default:
            break;
        }
      }
    });
    if (countTypeIn >= 5) {
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
        case 'keg':
          this.addColumn('volume');
          this.addColumn('head');
          break;
        case 'yeast':
          this.addColumn('type');
          this.addColumn('productionYear');
          break;
        case 'bottleTop':
          this.addColumn('size');
          this.addColumn('color');
          break;
        default:
          break;
      }
    });
  }

  removeColumn(name: string): void {
    const index = this.service.displayedColumns.indexOf(name);
    if (index >= 0) {
      this.service.displayedColumns.splice(index, 1);
    }
  }

  addColumn(name: string): void {
    const index = this.service.displayedColumns.indexOf(name);
    if (index < 0) {
      this.service.displayedColumns.push(name);
    }
  }
}
