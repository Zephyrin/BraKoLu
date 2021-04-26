import { IService } from '@app/_services/iservice';
import { map, shareReplay } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  template: ''
})
export class BaseComponent implements OnInit, OnDestroy {
  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  public service: IService;

  constructor(
    protected breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.service.load(false);
    this.init();
  }

  public init(): void { }

  ngOnDestroy() {
    this.service.edit = false;
    this.destroy();
  }

  public destroy(): void { }
}
