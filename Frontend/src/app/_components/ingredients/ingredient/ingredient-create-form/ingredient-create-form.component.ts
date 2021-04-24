import { Bottle } from '@app/_models/bottle';
import { ValueViewChild } from '@app/_services/iservice';
import { ChildCreateFormBaseComponent } from '@app/_components/child-create-form-base-component';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Ingredient } from '@app/_models';

import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { MatDatepicker } from '@angular/material/datepicker';

// const moment = _rollupMoment || _moment;
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM-YYYY',
  },
  display: {
    dateInput: 'MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-ingredient-create-form',
  templateUrl: './ingredient-create-form.component.html',
  styleUrls: ['./ingredient-create-form.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class IngredientCreateFormComponent extends ChildCreateFormBaseComponent {
  selectedChildName: ValueViewChild;
  years = new Array<number>();
  constructor(
    public dialogRef: MatDialogRef<IngredientCreateFormComponent>,
    public service: IngredientService,
    protected formBuilder: FormBuilder,
    protected dialog: MatDialog
  ) {
    super(dialogRef, service, formBuilder, dialog);
    const date = new Date();
    const year = date.getFullYear();
    for (let i = year - 20; i < year + 1; i++) {
      this.years.push(i);
    }
  }

  public create() {
  }

  childNameChange($evt): void {
    let newIngredient: Ingredient;
    newIngredient = this.service.createWithChildName($evt.value);
    if (this.service.form) {
      newIngredient.comment = this.service.form.value.comment;
      newIngredient.name = this.service.form.value.name;
      newIngredient.unit = this.service.form.value.unit;
      newIngredient.unitFactor = this.service.form.value.unitFactor;
    }
    this.createFormBasedOn(newIngredient);
  }

  chosenYearHandler(normalizedYear: any) {
    const ctrlValue = this.manageProductionYear();
    ctrlValue.setFullYear(normalizedYear.year());
    this.service.form.patchValue({ productionYear: ctrlValue });
  }

  chosenMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const ctrlValue = this.manageProductionYear();
    ctrlValue.setMonth(normalizedMonth.month());
    this.service.form.patchValue({ productionYear: ctrlValue });
    datepicker.close();
  }

  private manageProductionYear(): Date {
    let ctrlValue: Date | string = this.service.form.value.productionYear;
    if (ctrlValue === null) {
      ctrlValue = new Date();
    }
    if (typeof ctrlValue === 'string' && (ctrlValue.includes('-'))) {
      const str = ctrlValue.split('-');

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      ctrlValue = new Date(year, month, 1);
    } else {
      ctrlValue = new Date();
    }
    return ctrlValue;
  }
  compareBottle(c1: Bottle, c2: Bottle): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
