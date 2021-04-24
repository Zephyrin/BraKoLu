import { Router, NavigationEnd, ActivatedRoute, NavigationStart, NavigationError } from '@angular/router';
import { map, shareReplay, withLatestFrom, filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface MenuNode {
  routerLink?: string;
  svgIcon: string;
  label: string;
  children?: MenuNode[];
}

const TREE_MENU: MenuNode[] = [
  {
    routerLink: 'sale',
    svgIcon: 'beer',
    label: 'Ventes'
  },
  {
    routerLink: 'stock',
    svgIcon: 'flask-outline',
    label: 'Stock'
  },
  {
    routerLink: 'brew',
    svgIcon: 'silverware',
    label: 'Brassin'
  },
  {
    routerLink: 'command',
    svgIcon: 'truck',
    label: 'Commande'
  },
  {
    svgIcon: 'cog',
    label: 'Options',
    children: [
      {
        routerLink: 'ingredients',
        svgIcon: 'beaker',
        label: 'Ingrédient'
      }, {
        routerLink: 'suppliers',
        svgIcon: 'folder-account',
        label: 'Fournisseur'
      }
    ]
  }
];


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(90deg)' })),
      transition('rotated => default', animate('400ms ease-out')),
      transition('default => rotated', animate('400ms ease-in'))
    ])
    ,
    trigger('expandedState', [
      state('collapsed', style({ height: '0px' })),
      state('expanded', style({ height: 'initial' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)'))

    ])
  ]
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
  isSmallScreen$ = this.breakpointObserver.observe('(max-width: 1280px)').pipe(
    map(result => result.matches),
    shareReplay()
  );

  treeControl = new NestedTreeControl<MenuNode>(node => node.children);
  menuSource = new MatTreeNestedDataSource<MenuNode>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.menuSource.data = TREE_MENU;
  }

  hasChild = (_: number, node: MenuNode) => !!node.children && node.children.length > 0;

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
        this.menuSource.data.forEach(menu => {
          if (menu.children) {
            menu.children.forEach(child => {
              if (event.url.startsWith('/' + child.routerLink)) {
                this.treeControl.expand(menu);
              }
            });
          }
        });
        if (!event.url.startsWith('/sign')) {
          this.returnUrl = event.url;
        }
      }

      if (event instanceof NavigationError) {
      }
    });
  }
}
