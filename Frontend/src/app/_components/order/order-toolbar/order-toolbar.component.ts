import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BrewIngredientCreateComponent } from '@app/_components/brew/brew-ingredient-create/brew-ingredient-create.component';
import { OrderService } from '@app/_services/order/order.service';
import { OrderDisplayService } from '@app/_services/order/order-display.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-order-toolbar',
  templateUrl: './order-toolbar.component.html',
  styleUrls: ['./order-toolbar.component.scss']
})
export class OrderToolbarComponent implements OnInit, OnDestroy {
  private closedSubscription: Subscription;
  constructor(
    public orderDisplayService: OrderDisplayService,
    public orderService: OrderService,
    private ingredientService: IngredientService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.closedSubscription) { this.closedSubscription.unsubscribe(); }
  }

  addIngredientToOrder(): void {
    const dialogRef = this.dialog.open(BrewIngredientCreateComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as unknown as BrewIngredientCreateComponent).ingredientService = this.ingredientService;
    this.closedSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderDisplayService.addIngredientToOrder(result);
      }
      if (this.closedSubscription) { this.closedSubscription.unsubscribe(); }
    });
  }
}
