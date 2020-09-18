import { Router, NavigationEnd, ActivatedRoute, NavigationStart, NavigationError } from '@angular/router';
import { map, shareReplay, withLatestFrom, filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  returnUrl: string;
  @ViewChild('drawer') drawer: MatSidenav;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public router: Router,
    public route: ActivatedRoute
  ) {
  }
  ngOnInit(): void {
    this.router.events.pipe(
      withLatestFrom(this.isHandset$),
      filter(([a, b]) => b && a instanceof NavigationEnd)
    ).subscribe(_ => { if (this.drawer) { this.drawer.close(); } });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        if (!event.url.startsWith('/sign')) {
          this.returnUrl = event.url;
        }
      }

      if (event instanceof NavigationError) {
        console.warn(event.error);
      }
    });
  }
}
