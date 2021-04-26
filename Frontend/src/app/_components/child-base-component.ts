import { RemoveDialogComponent } from './helpers/remove-dialog/remove-dialog.component';
import { ChildCreateFormBaseComponent } from '@app/_components/child-create-form-base-component';
import { MatDialog } from '@angular/material/dialog';
import { IService } from '@app/_services/iservice';
import { Observable, Subscription } from 'rxjs';
import { OnInit, OnDestroy, Input, TemplateRef, Component, SimpleChange } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  template: ''
})
export abstract class ChildBaseComponent<T> implements OnInit, OnDestroy {
  private serviceEndUpdateSubscription: Subscription;
  @Input() service: IService;
  @Input() allowSelection = false;
  @Input() componentOrTemplateRef: ComponentType<T> | TemplateRef<T>;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  public isSmallScreen$ = this.breakpointObserver.observe('(max-width: 950px)').pipe(
    map(result => result.matches),
    shareReplay()
  );
  constructor(
    public dialog: MatDialog,
    protected breakpointObserver: BreakpointObserver) { }

  public UpdateComponentOrTemplateRef(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>) {
    this.componentOrTemplateRef = componentOrTemplateRef;
  }

  public ngOnInit(): void {
    this.serviceEndUpdateSubscription = this.service.endUpdate.subscribe({
      next: data => {
        this.endUpdate(data);
      }
    });
    this.init();
  }

  public init(): void { }
  public endUpdate(change: SimpleChange) { }
  public onDestroy() { }

  ngOnDestroy(): void {
    if (this.serviceEndUpdateSubscription) { this.serviceEndUpdateSubscription.unsubscribe(); }
    this.onDestroy();
  }

  openCreateDialog(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(this.componentOrTemplateRef, { minWidth: '30em' });
    (dialogRef.componentInstance as unknown as ChildCreateFormBaseComponent).create();
  }

  openUpdateDialog(event: MouseEvent, element: any): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(this.componentOrTemplateRef, { minWidth: '30em' });
    (dialogRef.componentInstance as unknown as ChildCreateFormBaseComponent).update(element);
  }

  openDeleteDialog(evt: MouseEvent, element: any, title: string): void {
    evt.stopPropagation();
    this.service.clearErrors();
    const dialogRef = this.dialog.open(RemoveDialogComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as RemoveDialogComponent).title = title;
    (dialogRef.componentInstance as RemoveDialogComponent).element = element;
    (dialogRef.componentInstance as RemoveDialogComponent).service = this.service;
  }
}
