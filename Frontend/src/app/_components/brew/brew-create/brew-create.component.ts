import { Ingredient } from '@app/_models';
import { FormBuilder } from '@angular/forms';
import { BrewService } from '@app/_services/brew/brew.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChildCreateFormBaseComponent } from '@app/_components/child-create-form-base-component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-brew-create',
  templateUrl: './brew-create.component.html',
  styleUrls: ['./brew-create.component.scss']
})
export class BrewCreateComponent extends ChildCreateFormBaseComponent {
  constructor(
    public dialogRef: MatDialogRef<BrewCreateComponent>,
    public service: BrewService,
    protected formBuilder: FormBuilder,
    protected dialog: MatDialog
  ) {
    super(dialogRef, service, formBuilder, dialog);
  }

  init() {
  }

  compareIngredient(c1: Ingredient, c2: Ingredient): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

}
