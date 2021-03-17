import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ValueViewChild } from '@app/_services/iservice';
import { BrewService } from '@app/_services/brew/brew.service';
import { BrewIngredientCreateComponent } from './../brew-ingredient-create/brew-ingredient-create.component';
import { MatDialog } from '@angular/material/dialog';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Brew, BrewIngredient } from '@app/_models/brew';
import { Component, Input, OnInit, SimpleChange, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-brew-ingredient-desktop',
  templateUrl: './brew-ingredient-desktop.component.html',
  styleUrls: ['./brew-ingredient-desktop.component.scss']
})
export class BrewIngredientDesktopComponent implements OnInit, OnDestroy {
  @Input() brew: Brew;
  @Input() ingredientService: IngredientService;
  @Input() brewService: BrewService;
  @Input() isPlanedView = false;
  public brewIngredientByType = new Array<BrewIngredientByType>();

  private serviceEndUpdateSubscription: Subscription;
  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.brew) {
      this.serviceEndUpdateSubscription = this.brewService.endUpdate.subscribe((simpleChange: SimpleChange) => {
        this.updateBrewIngredientList(simpleChange);
      });
      this.ingredientService.ingredientChildrenNames.forEach(childName => {
        this.addBrewIngredientList(childName);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.serviceEndUpdateSubscription) { this.serviceEndUpdateSubscription.unsubscribe(); }
  }

  updateStartedDate(event: any) {
    this.updateDate(event, 'started');
  }
  updateEndedDate(event: any) {
    this.updateDate(event, 'ended');
  }
  updateDate(event: any, date: string) {
    if (event.target.value) {
      this.brewService.update(date, this.brew, new Date(event.target.value));
    } else {
      this.brewService.update(date, this.brew, null);
    }

  }

  deleteDate(event: MouseEvent, date: string) {
    this.brewService.update(date, this.brew, null);
  }

  private updateBrewIngredientList(simpleChange: SimpleChange) {
    // Ici on ne gère que la vue des brewIngredients et plus tard des brewStock
    if (simpleChange.currentValue instanceof BrewIngredient
      || simpleChange.previousValue instanceof BrewIngredient) {
      const current = simpleChange.currentValue as BrewIngredient;
      const previous = simpleChange.previousValue as BrewIngredient;
      if (current === null) {
        // C'est une suppression
        // On cherche l'ingrédient du brassin puis on le supprime.
        if (previous.brew.id === this.brew.id) {
          const index = this.brewIngredientByType.findIndex(x => x.type.value === previous.ingredient.childName);
          if (index >= 0) {
            const brewIngredients = this.brewIngredientByType[index].dataSource.data;
            const indexToDelete = brewIngredients.findIndex(x => x.id === previous.id);
            if (indexToDelete >= 0) {
              brewIngredients.splice(indexToDelete, 1);
              if (brewIngredients.length > 0) {
                this.brewIngredientByType[index].dataSource = new MatTableDataSource(brewIngredients);
              } else {
                // On supprime la table car il n'y a plus d'ingrédient de brassin. Donc inutile de le laisser
                // afficher.
                this.brewIngredientByType.splice(index, 1);
              }
            }
          }
        }
      } else if (previous === null) {
        // C'est un ajout
        if (current.brew.id === this.brew.id) {
          const index = this.brewIngredientByType.findIndex(x => x.type.value === current.ingredient.childName);
          if (index >= 0) {
            this.brewIngredientByType[index].dataSource = new MatTableDataSource(
              this.brew.brewIngredients.filter(x => x.ingredient.childName === current.ingredient.childName)
            );
          } else {
            const childName = this.ingredientService.ingredientChildrenNames.find(x => x.value === current.ingredient.childName);
            this.addBrewIngredientList(childName);
          }
        }
      }
    }
  }

  private addBrewIngredientList(childName: ValueViewChild) {
    const brewIngredients = this.brew.brewIngredients.filter(c => c.ingredient.childName === childName.value);
    if (brewIngredients.length > 0) {
      const headersBrewIngredientByType = new Array<ValueViewChild>();
      const ingredient = brewIngredients[0].ingredient;
      headersBrewIngredientByType.push({ value: 'quantity', viewValue: 'Quantité (' + ingredient.unit + ')' });
      this.ingredientService.headers.forEach(x => {
        headersBrewIngredientByType.push(x);
      });
      const displayedColums = ['quantity', 'name'];
      switch (childName.value) {
        case 'other':
          break;
        case 'cereal':
          displayedColums.push('plant');
          displayedColums.push('format');
          displayedColums.push('ebc');
          break;
        case 'bottle':
          displayedColums.push('volume');
          displayedColums.push('color');
          break;
        case 'box':
          displayedColums.push('capacity');
          break;
        case 'hop':
          displayedColums.push('acidAlpha');
          displayedColums.push('harvestYear');
          break;
        case 'keg':
          displayedColums.push('volume');
          displayedColums.push('head');
          break;
        case 'bottleTop':
          displayedColums.push('size');
          displayedColums.push('color');
          break;
        case 'yeast':
          displayedColums.push('type');
          displayedColums.push('productionYear');
          break;
        default:
          break;
      }
      displayedColums.push('action');
      const brewIngredientsByType = new BrewIngredientByType();
      brewIngredientsByType.dataSource = new MatTableDataSource(brewIngredients);
      brewIngredientsByType.type = childName;
      brewIngredientsByType.displayedColumns = displayedColums;
      brewIngredientsByType.headers = headersBrewIngredientByType;
      brewIngredientsByType.brew = this.brew;

      this.brewIngredientByType.push(brewIngredientsByType);
    }
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

  letsGoBrew() {
    this.brewService.update('state', this.brew, 'brewing');
  }
}

export class BrewIngredientByType {
  // Les colonnes à afficher dans la liste des headers d'ingredient.
  public displayedColumns: string[];
  // La liste des ingrédients qui sont utilisée par le brassin.
  public dataSource: MatTableDataSource<BrewIngredient>;
  // Permet de filtrer la liste sur le type des ingrédients (childName).
  public type: ValueViewChild;
  // La liste des headers possible.
  public headers: ValueViewChild[];

  // Le brassin qui possède ces ingrédients
  public brew: Brew;
  // On pourra ajouter par la suite les BrewStock (quand l'ingrédient sera utilisé dans le brassin physiquement)
  // Et surtout la liste du stock
  // En lien avec les autres brassins (à l'état planning) permettant de savoir la quantité qui sera disponible pour se
  // brassin si celui-ci est à l'état planning.
}
