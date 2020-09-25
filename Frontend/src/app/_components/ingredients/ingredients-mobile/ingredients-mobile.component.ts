import { Cereal } from './../../../_models/cereal';
import { Hop } from './../../../_models/hop';
import { Other } from './../../../_models/other';
import { Ingredient } from '@app/_models';
import { IngredientCreateFormComponent } from './../ingredient/ingredient-create-form/ingredient-create-form.component';
import { MatDialog } from '@angular/material/dialog';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ingredients-mobile',
  templateUrl: './ingredients-mobile.component.html',
  styleUrls: ['./ingredients-mobile.component.scss']
})
export class IngredientsMobileComponent implements OnInit, OnDestroy {
  private subscribeLoading: Subscription;
  private serviceEndUpdateSubscription: Subscription;
  @Input() service: IngredientService;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.subscribeLoading = this.service.loading.subscribe(data => {
      if (data) {
        if (!this.service.errors.hasErrors) {
          this.dialog.closeAll();
        }
      }
    });
    this.serviceEndUpdateSubscription = this.service.endUpdate.subscribe(data => {
      if (data === true) {
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscribeLoading) { this.subscribeLoading.unsubscribe(); }
    if (this.serviceEndUpdateSubscription) { this.serviceEndUpdateSubscription.unsubscribe(); }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(IngredientCreateFormComponent, { minWidth: '40em' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  getTitle(element: Ingredient): string {
    return element.name;
  }

  getSubtitle(element: Ingredient): string {
    let ret = '';
    switch (element.childName) {
      case 'other':
        ret += (element as Other).type;
        break;
      case 'cereal':
        const cer = element as Cereal;
        ret += cer.plant + ' - ' + cer.type;
        break;
      default:
        ret += 'Aucune idée...';
        break;
    }
    ret += ' - ';
    if (element.unit) {
      ret += element.unit;
    }
    ret += ' avec un facteur de ' + element.unitFactor;
    return ret;
  }

  getContent(element): string {
    let ret = '';
    switch (element.childName) {
      case 'other':
        break;
      case 'cereal':
        const cer = element as Cereal;
        ret += cer.format + ' - ' + cer.ebc + '<br\>';
        break;
      default:
        ret += 'Toujours perdu dans les limbes';
        break;
    }
    ret += element.comment;
    return ret;
  }

}
