import { MatDialogRef } from '@angular/material/dialog';
import { DialogOrderDetailResult } from './../dialog-order-detail-base';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dialog-order-detail-quantity',
  templateUrl: './dialog-order-detail-quantity.component.html',
  styleUrls: ['./dialog-order-detail-quantity.component.scss']
})
export class DialogOrderDetailQuantityComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogOrderDetailQuantityComponent>) { }

  onNoClick(): void {
    this.dialogRef.close({ data: DialogOrderDetailResult.cancel });
  }

  onSubmit(): void {
    this.dialogRef.close({ data: DialogOrderDetailResult.removeEmptyQuantity });
  }
}
