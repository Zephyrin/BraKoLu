import { Subscription } from 'rxjs';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RemoveDialogComponent } from '@app/_components/helpers/remove-dialog/remove-dialog.component';
import { IngredientCreateFormComponent } from './../ingredient/ingredient-create-form/ingredient-create-form.component';

@Component({
  selector: 'app-ingredients-list',
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.scss']
})
export class IngredientsListComponent implements OnInit {
  private afterClosedSubscription: Subscription;

  constructor(
    public service: IngredientService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openUpdateDialog(event: MouseEvent, element: any): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(IngredientCreateFormComponent, { minWidth: '30em' });
    this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
      if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
    });
    (dialogRef.componentInstance as unknown as IngredientCreateFormComponent).update(element);
  }

  openDeleteDialog(evt: MouseEvent, element: any, title: string): void {
    evt.stopPropagation();
    this.service.clearErrors();
    const dialogRef = this.dialog.open(RemoveDialogComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as RemoveDialogComponent).title = title;
    (dialogRef.componentInstance as RemoveDialogComponent).element = element;
    (dialogRef.componentInstance as RemoveDialogComponent).service = this.service;
  }

}
