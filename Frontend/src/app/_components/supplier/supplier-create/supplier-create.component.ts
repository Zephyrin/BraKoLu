import { SupplierService } from '@app/_services/supplier/supplier.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChildCreateFormBaseComponent } from '@app/_components/child-create-form-base-component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-supplier-create',
  templateUrl: './supplier-create.component.html',
  styleUrls: ['./supplier-create.component.scss']
})
export class SupplierCreateComponent extends ChildCreateFormBaseComponent {

  constructor(
    public dialogRef: MatDialogRef<SupplierCreateComponent>,
    public service: SupplierService,
    protected formBuilder: FormBuilder,
    protected dialog: MatDialog
  ) {
    super(dialogRef, service, formBuilder, dialog);
  }

  init() {
  }
}
