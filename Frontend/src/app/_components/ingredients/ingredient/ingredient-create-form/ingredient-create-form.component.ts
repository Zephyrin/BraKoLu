import { Subscription } from 'rxjs';
import { IngredientService, IngredientChildName } from '@app/_services/ingredient/ingredient.service';
import { Ingredient } from '@app/_models';

import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return isSubmitted && (control && control.invalid);
  }
}

@Component({
  selector: 'app-ingredient-create-form',
  templateUrl: './ingredient-create-form.component.html',
  styleUrls: ['./ingredient-create-form.component.scss']
})
export class IngredientCreateFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  selectedChildName: IngredientChildName;
  ingredient: Ingredient;
  matcher = new MyErrorStateMatcher();
  endUpdateSubscription: Subscription;
  constructor(
    public dialogRef: MatDialogRef<IngredientCreateFormComponent>,
    public service: IngredientService,
    private formBuilder: FormBuilder,
  ) {
    this.endUpdateSubscription = service.endUpdate.subscribe(status => {
      if (status === true) {
        this.dialogRef.close();
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.service.setForm(undefined);
    if (this.endUpdateSubscription) { this.endUpdateSubscription.unsubscribe(); }
  }

  childNameChange($evt): void {
    let newIngredient: Ingredient;
    newIngredient = this.service.createWithChildName($evt.value);
    if (this.form) {
      newIngredient.comment = this.form.value.comment;
      newIngredient.name = this.form.value.name;
      newIngredient.unit = this.form.value.unit;
      newIngredient.unitFactor = this.form.value.unitFactor;
    }
    this.createFormBasedOnIngredient(newIngredient);
  }

  onSubmitClick(): void {
    if (this.form.invalid) {
      return;
    }
    this.service.update(undefined, this.ingredient, this.form.value);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  private createFormBasedOnIngredient(ingredient: Ingredient) {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      unit: [''],
      unitFactor: ['', Validators.required],
      comment: [''],
      childName: ['']
    });
    switch (ingredient.childName) {
      case 'other':
        this.form.addControl('type', new FormControl('', Validators.required));
        break;
      case 'cereal':
        this.form.addControl('plant', new FormControl('', Validators.required));
        this.form.addControl('type', new FormControl('', Validators.required));
        this.form.addControl('format', new FormControl('', Validators.required));
        this.form.addControl('ebc', new FormControl('', Validators.required));
    }
    this.form.patchValue(ingredient);
    this.service.setForm(this.form);
  }
}
