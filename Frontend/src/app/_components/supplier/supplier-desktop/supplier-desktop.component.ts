import { TableComponent } from '@app/_components/helpers/table/table.component';

import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component, ViewChild, AfterViewInit, SimpleChange } from '@angular/core';
import { SupplierCreateComponent } from '@app/_components/supplier/supplier-create/supplier-create.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-supplier-desktop',
  templateUrl: './supplier-desktop.component.html',
  styleUrls: ['./supplier-desktop.component.scss']
})
export class SupplierDesktopComponent extends ChildBaseComponent<SupplierCreateComponent> implements AfterViewInit {

  @ViewChild('Table') tableComponent: TableComponent;
  constructor(public dialog: MatDialog, public breakpointObserver: BreakpointObserver) {
    super(dialog, breakpointObserver);
    this.componentOrTemplateRef = SupplierCreateComponent;
  }

  ngAfterViewInit(): void {
    this.tableComponent.UpdateComponentOrTemplateRef(SupplierCreateComponent);
  }

  public endUpdate(change: SimpleChange) {
    this.tableComponent.endUpdate(change);
  }
}
