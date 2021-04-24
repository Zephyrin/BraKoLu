import { BreakpointObserver } from '@angular/cdk/layout';
import { SupplierDisplayService } from '@app/_services/supplier/supplier-display.service';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { Component, OnInit } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BaseComponent } from '@app/_components/base-component';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent extends BaseComponent {

  isSmallScreen$ = this.breakpointObserver.observe('(max-width: 950px)').pipe(
    map(result => result.matches),
    shareReplay()
  );
  private isSmallScreenSubscription: Subscription;

  constructor(
    public service: SupplierService,
    public display: SupplierDisplayService,
    protected breakpointObserver: BreakpointObserver
  ) {
    super(breakpointObserver, service);
  }

  public init() {
    this.isSmallScreenSubscription = this.isSmallScreen$.subscribe(
      {
        next: isSmallScreen => {
          if (isSmallScreen) {
            this.display.viewList();
          }
        }
      });
  }

}
