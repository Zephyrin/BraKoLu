import { IService } from '@app/_services/iservice';
import { map, shareReplay } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { OnDestroy, OnInit } from '@angular/core';

export class BaseComponent implements OnInit, OnDestroy {
  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(
    protected breakpointObserver: BreakpointObserver,
    public service: IService) { }

  ngOnInit(): void {
    this.service.load(false);
  }

  ngOnDestroy() {
    this.service.edit = false;
  }
}
