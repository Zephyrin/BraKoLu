import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { IngredientDisplayService } from '@app/_services/ingredient/ingredient-display.service';
import { IngredientSearchService } from '@app/_services/ingredient/ingredient-search.service';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Subscription, Observable } from 'rxjs';
import { IngredientCreateFormComponent } from './../ingredient/ingredient-create-form/ingredient-create-form.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-ingredient-toolbar',
  templateUrl: './ingredient-toolbar.component.html',
  styleUrls: ['./ingredient-toolbar.component.scss']
})
export class IngredientToolbarComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  private afterClosedSubscription: Subscription;

  get getSearch() { return this.service.search as IngredientSearchService; }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isSmallScreen$ = this.breakpointObserver.observe('(max-width: 1280px)').pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    public dialog: MatDialog,
    public service: IngredientService,
    public ingredientDisplay: IngredientDisplayService,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: [this.getSearch.ingredientSearch.searchValue]
    });
  }

  ngOnDestroy(): void {
    if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
  }


  openCreateDialog(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(IngredientCreateFormComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as unknown as IngredientCreateFormComponent).create();
    this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
      if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
    });
  }

  search(): void {
    this.getSearch.updateSearch(this.searchForm.value.search);
  }

}
