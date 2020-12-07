import { DialogOrderDetailResult } from './../dialog-order-detail-base';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-order-detail-supplier',
  templateUrl: './dialog-order-detail-supplier.component.html',
  styleUrls: ['./dialog-order-detail-supplier.component.scss']
})
export class DialogOrderDetailSupplierComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogOrderDetailSupplierComponent>) { }

  onNoClick(): void {
    this.dialogRef.close({ data: DialogOrderDetailResult.cancel });
  }

  onSubmit(): void {
    this.dialogRef.close({ data: DialogOrderDetailResult.continue });
  }

}
