import { BrowserModule, DomSanitizer, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
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
import { DatePipe, DecimalPipe } from '@angular/common';
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
import { IngredientCreateFormComponent } from './_components/ingredients/ingredient/ingredient-create-form/ingredient-create-form.component';
import { StockComponent } from './_components/stock/stock.component';
import { StockCreateComponent } from './_components/stock/stock-create/stock-create.component';
import { StockDesktopComponent } from './_components/stock/stock-desktop/stock-desktop/stock-desktop.component';
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
import { DialogOrderDetailDateComponent } from './_components/order/order-desktop/order-detail-creation/dialog-order-detail-date/dialog-order-detail-date.component';
import { DialogOrderDetailSupplierComponent } from './_components/order/order-desktop/order-detail-creation/dialog-order-detail-supplier/dialog-order-detail-supplier.component';
import { DialogOrderDetailPriceComponent } from './_components/order/order-desktop/order-detail-creation/dialog-order-detail-price/dialog-order-detail-price.component';
import { DialogOrderDetailQuantityComponent } from './_components/order/order-desktop/order-detail-creation/dialog-order-detail-quantity/dialog-order-detail-quantity.component';
import { OrderToolbarComponent } from './_components/order/order-toolbar/order-toolbar.component';
import { HeaderComponent } from './_components/tools/header/header.component';
import { BrewIngredientBrewingComponent } from './_components/brew/brew-ingredient-brewing/brew-ingredient-brewing.component';
import { IngredientToolbarComponent } from './_components/ingredients/ingredient-toolbar/ingredient-toolbar.component';
import { StockToolbarComponent } from './_components/stock/stock-toolbar/stock-toolbar.component';
import { SupplierSelectInputComponent } from './_components/supplier/supplier-select-input/supplier-select-input.component';
import { SupplierSelectDialogComponent } from './_components/supplier/supplier-select-dialog/supplier-select-dialog.component';
import { SupplierSelectorFilterComponent } from './_components/supplier/supplier-selector-filter/supplier-selector-filter.component';
import { StockStateFilterComponent } from './_components/stock/stock-state-filter/stock-state-filter.component';
import { BrewToolbarComponent } from './_components/brew/brew-toolbar/brew-toolbar.component';
import { BrewCheckListComponent } from './_components/order/order-desktop/order-detail-creation/brew-check-list/brew-check-list.component';
import { IngredientTypeComponent } from './_components/order/order-desktop/order-detail-creation/ingredient-type/ingredient-type.component';
import { StockInOrderInlineComponent } from './_components/order/order-desktop/order-detail-creation/stock-in-order-inline/stock-in-order-inline.component';
import { StockInOrderTableComponent } from './_components/order/order-desktop/order-detail-creation/stock-in-order-table/stock-in-order-table.component';
import { BrewsForIngredientComponent } from './_components/order/order-desktop/order-detail-creation/brews-for-ingredient/brews-for-ingredient.component';
import { OrderFilterComponent } from './_components/order/order-desktop/order-filter/order-filter.component';
import { TwoDigitDecimalNumberDirective } from './_directives/two-digit-decimal-number.directive';
import { PriceInputComponent } from './_components/helpers/price-input/price-input.component';
import { QuantityInputComponent } from './_components/helpers/quantity-input/quantity-input.component';
import { StockListComponent } from './_components/stock/stock-list/stock-list.component';

@NgModule({
  declarations: [
    AppComponent,
    IngredientsComponent,
    RemoveDialogComponent,
    ToolsEditComponent,
    IngredientsDesktopComponent,
    IngredientCreateFormComponent,
    StockComponent,
    StockCreateComponent,
    StockDesktopComponent,
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
    DialogOrderDetailDateComponent,
    DialogOrderDetailSupplierComponent,
    DialogOrderDetailPriceComponent,
    DialogOrderDetailQuantityComponent,
    OrderToolbarComponent,
    HeaderComponent,
    BrewIngredientBrewingComponent,
    IngredientToolbarComponent,
    StockToolbarComponent,
    SupplierSelectInputComponent,
    SupplierSelectDialogComponent,
    SupplierSelectorFilterComponent,
    StockStateFilterComponent,
    BrewToolbarComponent,
    BrewCheckListComponent,
    IngredientTypeComponent,
    StockInOrderInlineComponent,
    StockInOrderTableComponent,
    BrewsForIngredientComponent,
    OrderFilterComponent,
    TwoDigitDecimalNumberDirective,
    PriceInputComponent,
    QuantityInputComponent,
    StockListComponent,
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
    MatMomentDateModule,
    MatSlideToggleModule
  ],
  providers: [
    DatePipe,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    iconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')
    );
  }
}
