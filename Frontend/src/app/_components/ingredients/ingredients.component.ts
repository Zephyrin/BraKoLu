import { IngredientDisplayService } from '@app/_services/ingredient/ingredient-display.service';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BaseComponent } from '@app/_components/base-component';
import { map, shareReplay } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent extends BaseComponent implements OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isSmallScreen$ = this.breakpointObserver.observe('(max-width: 950px)').pipe(
    map(result => result.matches),
    shareReplay()
  );
  private isSmallScreenSubscription: Subscription;
  constructor(
    protected breakpointObserver: BreakpointObserver,
    public service: IngredientService,
    public display: IngredientDisplayService) {
    super(breakpointObserver, service);
  }

  public init() {
    this.isSmallScreenSubscription = this.isSmallScreen$.subscribe(isSmallScreen => {
      if (isSmallScreen) {
        this.display.viewList();
      }
    });
  }

  ngOnDestroy() {
    if (this.isSmallScreenSubscription) { this.isSmallScreenSubscription.unsubscribe(); }
  }
}
