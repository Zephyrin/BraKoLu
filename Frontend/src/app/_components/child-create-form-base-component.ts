import { ValueViewChild } from '@app/_services/iservice';
import { IService } from '@app/_services/iservice';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { OnInit, OnDestroy, Component } from '@angular/core';
import { RemoveDialogComponent } from './helpers/remove-dialog/remove-dialog.component';

@Component({
  template: ''
})
export class ChildCreateFormBaseComponent implements OnInit, OnDestroy {
  selectedChildName: ValueViewChild;
  endUpdateSubscription: Subscription;
  value: any;
  private afterClosedDeleteSubscription: Subscription;
  public service: IService;
  constructor(
    public dialogRef: MatDialogRef<ChildCreateFormBaseComponent>,
    protected formBuilder: FormBuilder,
    protected dialog: MatDialog
  ) {
  }
  ngOnInit(): void {
    this.init();
    this.endUpdateSubscription = this.service.endUpdate.subscribe(status => {
      if (status?.currentValue) {
        this.dialogRef.close(status?.currentValue);
      }
    });
  }

  ngOnDestroy(): void {
    this.service.deleteForm();
    if (this.endUpdateSubscription) { this.endUpdateSubscription.unsubscribe(); }
    this.destroy();
    if (this.afterClosedDeleteSubscription) { this.afterClosedDeleteSubscription.unsubscribe(); }
  }

  public init() { }
  public destroy() { }

  onSubmitClick(): void {
    if (this.service.form.invalid) {
      return;
    }
    this.service.update(undefined, this.value, this.service.form.value);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  protected createFormBasedOn(value: any) {
    const id = 'id';
    if (value[id]) {
      this.value = value;
    }
    this.service.createForm(this.formBuilder, value);
  }

  public create() {
    const value = this.service.create();
    this.createFormBasedOn(value);
  }

  public update(value: any) {
    this.createFormBasedOn(value);
  }

  onDeleteClick() {
    this.service.clearErrors();
    const dialogRef = this.dialog.open(RemoveDialogComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as RemoveDialogComponent).title = this.service.getDisplay('name', this.value);
    (dialogRef.componentInstance as RemoveDialogComponent).element = this.value;
    (dialogRef.componentInstance as RemoveDialogComponent).service = this.service;
    this.afterClosedDeleteSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close();
      }
      if (this.afterClosedDeleteSubscription) { this.afterClosedDeleteSubscription.unsubscribe(); }
    });
  }
}
