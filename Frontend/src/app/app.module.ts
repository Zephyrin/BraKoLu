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
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IngredientsComponent } from './_components/ingredients/ingredients.component';
import { RemoveDialogComponent } from './_components/helpers/remove-dialog/remove-dialog.component';
import { ToolsEditComponent } from './_components/tools/tools-edit/tools-edit.component';
import { MatTableModule } from '@angular/material/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { IngredientsDesktopComponent } from './_components/ingredients/ingredients-desktop/ingredients-desktop.component';
import { IngredientsMobileComponent } from './_components/ingredients/ingredients-mobile/ingredients-mobile.component';
import { IngredientCreateFormComponent } from './_components/ingredients/ingredient/ingredient-create-form/ingredient-create-form.component';
import { StockComponent } from './_components/stock/stock.component';
import { StockCreateComponent } from './_components/stock/stock-create/stock-create.component';
import { StockDesktopComponent } from './_components/stock/stock-desktop/stock-desktop/stock-desktop.component';
import { StockMobileComponent } from './_components/stock/stock-mobile/stock-mobile/stock-mobile.component';
import { PaginationComponent } from './_components/helpers/pagination/pagination.component';
import { OptionComponent } from './_components/option/option.component';
import { VenteComponent } from './_components/vente/vente.component';
import { TableComponent } from './_components/helpers/table/table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SupplierDesktopComponent } from './_components/supplier/supplier-desktop/supplier-desktop.component';
import { SupplierCreateComponent } from './_components/supplier/supplier-create/supplier-create.component';
import { BrewComponent } from './_components/brew/brew.component';
import { BrewMobileComponent } from './_components/brew/brew-mobile/brew-mobile.component';
import { BrewDesktopComponent } from './_components/brew/brew-desktop/brew-desktop.component';
import { BrewCreateComponent } from './_components/brew/brew-create/brew-create.component';
import { BrewIngredientCreateComponent } from './_components/brew/brew-ingredient-create/brew-ingredient-create.component';
import { BrewIngredientDesktopComponent } from './_components/brew/brew-ingredient-desktop/brew-ingredient-desktop.component';
import { OrderComponent } from './_components/order/order.component';
import { OrderDesktopComponent } from './_components/order/order-desktop/order-desktop.component';
import { OrderMobileComponent } from './_components/order/order-mobile/order-mobile.component';
import { BrewsTableComponent } from './_components/brew/brew-desktop/brews-table/brews-table.component';
import { BrewDetailsDesktopComponent } from './_components/brew/brew-desktop/brew-details-desktop/brew-details-desktop.component';
import { BrewIngredientTableComponent } from './_components/brew/brew-ingredient-desktop/brew-ingredient-table/brew-ingredient-table.component';
import { OrderDetailComponent } from './_components/order/order-desktop/order-detail/order-detail.component';
import { OrderDetailCreationComponent } from './_components/order/order-desktop/order-detail-creation/order-detail-creation.component';

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
    PaginationComponent,
    OptionComponent,
    VenteComponent,
    TableComponent,
    SupplierDesktopComponent,
    SupplierCreateComponent,
    BrewComponent,
    BrewMobileComponent,
    BrewDesktopComponent,
    BrewCreateComponent,
    BrewIngredientCreateComponent,
    BrewIngredientDesktopComponent,
    OrderComponent,
    OrderDesktopComponent,
    OrderMobileComponent,
    BrewsTableComponent,
    BrewDetailsDesktopComponent,
    BrewIngredientTableComponent,
    OrderDetailComponent,
    OrderDetailCreationComponent,

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
    MatExpansionModule,
    MatChipsModule,
    DragDropModule,
    MatCheckboxModule,
    CdkTreeModule,
    MatBadgeModule,
    MatStepperModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
