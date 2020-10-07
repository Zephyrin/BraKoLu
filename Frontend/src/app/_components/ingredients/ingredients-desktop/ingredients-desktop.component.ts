import { FormGroup, FormBuilder } from '@angular/forms';
import { IngredientChildrenSelected } from '@app/_models/ingredient-search';
import { IngredientSearchService } from '@app/_services/ingredient/ingredient-search.service';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { tap } from 'rxjs/operators';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { IngredientCreateFormComponent } from './../ingredient/ingredient-create-form/ingredient-create-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';
import { MatChipSelectionChange } from '@angular/material/chips';

@Component({
  selector: 'app-ingredients-desktop',
  templateUrl: './ingredients-desktop.component.html',
  styleUrls: ['./ingredients-desktop.component.scss']
})
export class IngredientsDesktopComponent extends ChildBaseComponent<IngredientCreateFormComponent> implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'comment', 'unit', 'unitFactor', 'childName'];
  // , /* Other, Cereal, Yeast, bottle and Hop */ 'type'
  // ,   /* cereal */ 'plant', 'format', 'ebc'
  // /* bottle */
  // ,   /* box */ 'capacity'
  // ,   /* hop */ 'acidAlpha', 'harvestYear'
  // ,   /* keg */ 'head'
  // ,   /* yeast */ 'type', 'productionYear'
  // ,   /* bottleTop */ 'size'
  // , /* bottle and keg */ 'volume'
  // , /* bottle and bottleTop */ 'color'
  // ];

  dataSource: any;
  @ViewChild('matTable') matTable: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  searchForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder) {
    super(dialog, IngredientCreateFormComponent);
  }

  // Helper pour passer de IService à IngredientService
  get getService() { return this.service as IngredientService; }
  get getSearch() { return this.service.search as IngredientSearchService; }

  public selectIngredientChange(child: IngredientChildrenSelected) {
    this.getSearch.updateSelected(child);
  }

  public selectionChange($evt: MatChipSelectionChange) {
    if ($evt.selected === true) {
      $evt.source.color = 'accent';
    } else {
      // On ne peut pas changer la couleur lorsque celui-ci n'est pas sélectionné...
      $evt.source.color = 'primary';
    }

  }

  ngOnInit(): void {
    super.ngOnInit();
    this.searchForm = this.formBuilder.group({
      search: [this.getSearch.ingredientSearch.searchValue]
    });
  }
  ngAfterViewInit(): void {
    merge(this.sort.sortChange)
      .pipe(tap(() => {
        this.service.sort.change(this.sort.active, this.sort.direction);
      })).subscribe();
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

  search(): void {
    this.getSearch.updateSearch(this.searchForm.value.search);
  }
}
