import { RemoveDialogComponent } from './helpers/remove-dialog/remove-dialog.component';
import { ChildCreateFormBaseComponent } from '@app/_components/child-create-form-base-component';
import { MatDialog } from '@angular/material/dialog';
import { IService } from '@app/_services/iservice';
import { Subscription } from 'rxjs';
import { OnInit, OnDestroy, Input, TemplateRef, Component } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

export class ChildBaseComponent<T> implements OnInit, OnDestroy {
  private serviceEndUpdateSubscription: Subscription;
  @Input() service: IService;
  constructor(
    public dialog: MatDialog,
    protected componentOrTemplateRef: ComponentType<T> | TemplateRef<T>) { }

  public UpdateComponentOrTemplateRef(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>) {
    this.componentOrTemplateRef = componentOrTemplateRef;
  }

  public ngOnInit(): void {
    this.serviceEndUpdateSubscription = this.service.endUpdate.subscribe(data => {
      if (data === true) {
        this.endUpdate();
        this.dialog.closeAll();
      }
    });
    this.init();
  }

  public init(): void { }
  public endUpdate() { }

  ngOnDestroy(): void {
    if (this.serviceEndUpdateSubscription) { this.serviceEndUpdateSubscription.unsubscribe(); }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(this.componentOrTemplateRef, { minWidth: '30em' });
    (dialogRef.componentInstance as unknown as ChildCreateFormBaseComponent).create();
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  openUpdateDialog(element: any): void {
    const dialogRef = this.dialog.open(this.componentOrTemplateRef, { minWidth: '30em' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
    (dialogRef.componentInstance as unknown as ChildCreateFormBaseComponent).update(element);
  }

  openDeleteDialog(element: any, title: string): void {
    const dialogRef = this.dialog.open(RemoveDialogComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as RemoveDialogComponent).title = title;
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data === true) {
        this.service.update(undefined, element, null);
      }
    });
  }
}
