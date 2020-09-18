import { IngredientsComponent } from './_components/ingredients/ingredients.component';

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
  { path: '', component: IngredientsComponent },
  { path: 'ingredients', component: IngredientsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
