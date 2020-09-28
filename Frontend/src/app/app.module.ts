import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';

import { IngredientsComponent } from './_components/ingredients/ingredients.component';
import { RemoveDialogComponent } from './_components/helpers/remove-dialog/remove-dialog.component';
import { ToolsEditComponent } from './_components/tools/tools-edit/tools-edit.component';
import { MatTableModule } from '@angular/material/table';
import { IngredientsDesktopComponent } from './_components/ingredients/ingredients-desktop/ingredients-desktop.component';
import { IngredientsMobileComponent } from './_components/ingredients/ingredients-mobile/ingredients-mobile.component';
import { IngredientCreateFormComponent } from './_components/ingredients/ingredient/ingredient-create-form/ingredient-create-form.component';
import { StockComponent } from './_components/stock/stock.component';
import { StockCreateComponent } from './_components/stock/stock-create/stock-create.component';
import { StockDesktopComponent } from './_components/stock/stock-desktop/stock-desktop/stock-desktop.component';
import { StockMobileComponent } from './_components/stock/stock-mobile/stock-mobile/stock-mobile.component';

@NgModule({
  declarations: [
    AppComponent,
    IngredientsComponent,
    RemoveDialogComponent,
    ToolsEditComponent,
    IngredientsDesktopComponent,
    IngredientsMobileComponent,
    IngredientCreateFormComponent,
    StockComponent,
    StockCreateComponent,
    StockDesktopComponent,
    StockMobileComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NgbModule,
    HammerModule,
    MatTableModule,
    MatSelectModule,
    MatSortModule,
    MatExpansionModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
