import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Supplier } from '@app/_models';
import { SupplierService } from '@app/_services/supplier/supplier.service';

@Component({
  selector: 'app-supplier-select-dialog',
  templateUrl: './supplier-select-dialog.component.html',
  styleUrls: ['./supplier-select-dialog.component.scss']
})
export class SupplierSelectDialogComponent implements OnInit {
  private previousSelected: Supplier = undefined;
  constructor(
    public supplierService: SupplierService,
    public dialogRef: MatDialogRef<SupplierSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Supplier
  ) {
    this.previousSelected = this.supplierService.selected;
    if (data !== null && data !== undefined) {
      const index = this.supplierService.model.findIndex(c => c.id === data.id);
      if (index >= 0 && index < this.supplierService.model.length) {
        this.supplierService.setSelected(this.supplierService.model[index]);
      }
    }
  }

  ngOnInit(): void {
  }


  onSubmitClick() {
    this.dialogRef.close(this.supplierService.selected);
    this.supplierService.selected = this.previousSelected;
  }

  onCancelClick() {
    this.dialogRef.close(undefined);
    this.supplierService.selected = this.previousSelected;
  }
}
