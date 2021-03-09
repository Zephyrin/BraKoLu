import { RemoveDialogComponent } from './helpers/remove-dialog/remove-dialog.component';
import { ChildCreateFormBaseComponent } from '@app/_components/child-create-form-base-component';
import { MatDialog } from '@angular/material/dialog';
import { IService } from '@app/_services/iservice';
import { Subscription } from 'rxjs';
import { OnInit, OnDestroy, Input, TemplateRef, Component, SimpleChange } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { timeoutWith } from 'rxjs/operators';

export class ChildBaseComponent<T> implements OnInit, OnDestroy {
  private serviceEndUpdateSubscription: Subscription;
  private afterClosedSubscription: Subscription;
  @Input() service: IService;
  @Input() allowSelection = false;
  constructor(
    public dialog: MatDialog,
    public componentOrTemplateRef: ComponentType<T> | TemplateRef<T>) { }

  public UpdateComponentOrTemplateRef(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>) {
    this.componentOrTemplateRef = componentOrTemplateRef;
  }

  public ngOnInit(): void {
    this.serviceEndUpdateSubscription = this.service.endUpdate.subscribe(data => {
      this.endUpdate(data);
    });
    this.init();
  }

  public init(): void { }
  public endUpdate(change: SimpleChange) { }
  public onDestroy() { }

  ngOnDestroy(): void {
    if (this.serviceEndUpdateSubscription) { this.serviceEndUpdateSubscription.unsubscribe(); }
    if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
    this.onDestroy();
  }

  openCreateDialog(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(this.componentOrTemplateRef, { minWidth: '30em' });
    (dialogRef.componentInstance as unknown as ChildCreateFormBaseComponent).create();
    this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
      if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
    });
  }

  openUpdateDialog(event: MouseEvent, element: any): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(this.componentOrTemplateRef, { minWidth: '30em' });
    this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
      if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
    });
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
