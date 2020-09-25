import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Cereal } from '@app/_models/cereal';
import { Other } from '@app/_models/other';
import { Ingredient } from '@app/_models';
import { IngredientCreateFormComponent } from './../ingredient/ingredient-create-form/ingredient-create-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ingredients-mobile',
  templateUrl: './ingredients-mobile.component.html',
  styleUrls: ['./ingredients-mobile.component.scss']
})
export class IngredientsMobileComponent extends ChildBaseComponent<IngredientCreateFormComponent> {

  constructor(public dialog: MatDialog) {
    super(dialog, IngredientCreateFormComponent);
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
