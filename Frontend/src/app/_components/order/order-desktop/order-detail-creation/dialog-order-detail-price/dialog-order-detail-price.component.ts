import { DialogOrderDetailResult } from './../dialog-order-detail-base';
import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dialog-order-detail-price',
  templateUrl: './dialog-order-detail-price.component.html',
  styleUrls: ['./dialog-order-detail-price.component.scss']
})
export class DialogOrderDetailPriceComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogOrderDetailPriceComponent>) { }

  onNoClick(): void {
    this.dialogRef.close({ data: DialogOrderDetailResult.cancel });
  }

  onSubmit(): void {
    this.dialogRef.close({ data: DialogOrderDetailResult.removeEmptyQuantity });
  }
}
