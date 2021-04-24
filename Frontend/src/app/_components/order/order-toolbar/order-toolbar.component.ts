import { IngredientSelectDialogComponent } from './../../ingredients/ingredient-select-dialog/ingredient-select-dialog.component';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BrewIngredientCreateComponent } from '@app/_components/brew/brew-ingredient-create/brew-ingredient-create.component';
import { OrderService } from '@app/_services/order/order.service';
import { OrderDisplayService } from '@app/_services/order/order-display.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-order-toolbar',
  templateUrl: './order-toolbar.component.html',
  styleUrls: ['./order-toolbar.component.scss']
})
export class OrderToolbarComponent implements OnInit {
  constructor(
    public orderDisplayService: OrderDisplayService,
    public orderService: OrderService,
    private ingredientService: IngredientService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }


  addIngredientToOrder(): void {
    const dialogRef = this.dialog.open(IngredientSelectDialogComponent, { minWidth: '30em' });
    dialogRef.afterClosed().pipe(first()).subscribe({
      next: result => {
        if (result) {
          this.orderDisplayService.addIngredientToOrder(result);
        }
      }
    });
  }
}
