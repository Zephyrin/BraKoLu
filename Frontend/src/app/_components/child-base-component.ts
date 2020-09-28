import { MatDialog } from '@angular/material/dialog';
import { IService } from '@app/_services/iservice';
import { Subscription } from 'rxjs';
import { OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

export class ChildBaseComponent<T> implements OnInit, OnDestroy {
  private serviceEndUpdateSubscription: Subscription;
  @Input() service: IService;
  constructor(
    public dialog: MatDialog,
    protected componentOrTemplateRef: ComponentType<T> | TemplateRef<T>) { }

  ngOnInit(): void {
    this.serviceEndUpdateSubscription = this.service.endUpdate.subscribe(data => {
      if (data === true) {
        this.endUpdate();
        this.dialog.closeAll();
      }
    });
  }

  public endUpdate() { }

  ngOnDestroy(): void {
    if (this.serviceEndUpdateSubscription) { this.serviceEndUpdateSubscription.unsubscribe(); }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(this.componentOrTemplateRef, { minWidth: '30em' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
}
