import { MatDialog } from '@angular/material/dialog';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { Component, Input, OnInit } from '@angular/core';
import { RemoveDialogComponent } from '@app/_components/helpers/remove-dialog/remove-dialog.component';
import { SupplierDisplayService } from '@app/_services/supplier/supplier-display.service';
import { SupplierCreateComponent } from '../supplier-create/supplier-create.component';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {
  @Input() isDialog = false;
  constructor(
    public service: SupplierService,
    public display: SupplierDisplayService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openUpdateDialog(event: MouseEvent, element: any): void {
    event.stopPropagation();
    if (this.isDialog) {
      this.service.selected = element;
    } else {
      const dialogRef = this.dialog.open(SupplierCreateComponent, { minWidth: '30em' });
      (dialogRef.componentInstance as unknown as SupplierCreateComponent).update(element);
    }
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
