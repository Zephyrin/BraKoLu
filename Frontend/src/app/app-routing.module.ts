import { OrderPronosticComponent } from './_components/order/order-pronostic/order-pronostic.component';
import { OrderComponent } from './_components/order/order.component';
import { BrewComponent } from './_components/brew/brew.component';
import { VenteComponent } from './_components/vente/vente.component';
import { IngredientsComponent } from './_components/ingredients/ingredients.component';
import { StockComponent } from './_components/stock/stock.component';
import { OptionComponent } from './_components/option/option.component';


import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';


const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  useHash: false,
  onSameUrlNavigation: 'reload',
  scrollPositionRestoration: 'enabled',
  scrollOffset: [0, 0],
};

const routes: Routes = [
  { path: 'sale', component: VenteComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'stock', component: StockComponent },
  { path: 'option', component: OptionComponent },
  { path: 'brew', component: BrewComponent },
  { path: 'command', component: OrderComponent },
  { path: 'create-command', component: OrderPronosticComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
