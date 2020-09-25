import { ValueViewChild } from '@app/_services/iservice';
import { IService } from '@app/_services/iservice';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { OnInit, OnDestroy } from '@angular/core';


export class ChildCreateFormBaseComponent implements OnInit, OnDestroy {
  selectedChildName: ValueViewChild;
  endUpdateSubscription: Subscription;
  value: any;

  constructor(
    public dialogRef: MatDialogRef<ChildCreateFormBaseComponent>,
    public service: IService,
    protected formBuilder: FormBuilder,
  ) {
    this.endUpdateSubscription = service.endUpdate.subscribe(status => {
      if (status === true) {
        this.dialogRef.close();
      }
    });
  }
  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.service.deleteForm();
    if (this.endUpdateSubscription) { this.endUpdateSubscription.unsubscribe(); }
    this.destroy();
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

}
