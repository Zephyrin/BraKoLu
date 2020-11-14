import { SupplierService } from '@app/_services/supplier/supplier.service';
import { OrderService } from '@app/_services/order/order.service';
import { BrewService } from '@app/_services/brew/brew.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderCreateComponent } from '@app/_components/order/order-create/order-create.component';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '@app/_components/helpers/table/table.component';

@Component({
  selector: 'app-order-desktop',
  templateUrl: './order-desktop.component.html',
  styleUrls: ['./order-desktop.component.scss']
})
export class OrderDesktopComponent extends ChildBaseComponent<OrderCreateComponent> {
  @ViewChild('tableComponent') tableComponent: TableComponent;

  get orderService() { return this.service as OrderService; }
  constructor(
    public dialog: MatDialog,
    public brewService: BrewService,
    public supplierService: SupplierService
  ) {
    super(dialog, OrderCreateComponent);
    brewService.load(true);
    supplierService.load(true);
  }

  public endUpdate() {
    this.tableComponent.endUpdate();
  }

  public addNewOrder(): void {
    let index = this.service.model.findIndex(x => x.state === 'created');
    if (index >= 0) {
      index = this.orderService.selectedOrders.findIndex(x => x.id === undefined || x.id === undefined);
      if (index >= 0) {
        this.orderService.formSelectedOrder.setValue(index + 1);
      } else {
        this.orderService.selectedOrders.push(this.service.model[index]);
        this.orderService.formSelectedOrder.setValue(this.orderService.selectedOrders.length);
      }
    } else {
      this.orderService.createOrder();
    }
  }

}
