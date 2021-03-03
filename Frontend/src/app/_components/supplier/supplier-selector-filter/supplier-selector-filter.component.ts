import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { MatChipSelectionChange } from '@angular/material/chips';
import { Supplier } from '@app/_models';
import { ValueViewChildSelected } from '@app/_models/ValueViewChildSelected';
import { SupplierService } from '@app/_services/supplier/supplier.service';
import { Subscription } from 'rxjs';

class SupplierSelected {
  supplier: Supplier;
  selected: boolean;

  constructor(supplier: Supplier, selected = false) {
    this.selected = selected;
    this.supplier = supplier;
  }
}

@Component({
  selector: 'app-supplier-selector-filter',
  templateUrl: './supplier-selector-filter.component.html',
  styleUrls: ['./supplier-selector-filter.component.scss']
})
export class SupplierSelectorFilterComponent implements OnInit, OnDestroy {
  @Output() selectedSuppliers = new EventEmitter<Supplier[]>();

  public model: SupplierSelected[] = [];
  private endUpdateSubscription: Subscription;
  constructor(private service: SupplierService) { }

  ngOnInit(): void {
    const withoutSupplier = new Supplier(undefined);
    withoutSupplier.id = -1;
    withoutSupplier.name = 'Sans fournisseur';
    this.model.push(new SupplierSelected(withoutSupplier));
    this.endUpdateSubscription = this.service.endUpdate.subscribe(data => {
      if (data === undefined) {
        this.service.model.forEach(elt => {
          if (this.model.findIndex(x => x.supplier.id === elt.id) < 0) {
            this.model.push(new SupplierSelected(elt));
          }
        });
      }
    });
    this.service.model?.forEach(elt => {
      this.model.push(new SupplierSelected(elt));
    });
  }

  ngOnDestroy(): void {
    if (this.endUpdateSubscription) { this.endUpdateSubscription.unsubscribe(); }
  }

  public selectionChange($evt: MatChipSelectionChange) {
    if ($evt.selected === true) {
      $evt.source.color = 'accent';
    } else {
      // On ne peut pas changer la couleur lorsque celui-ci n'est pas sélectionné...
      $evt.source.color = 'primary';
    }

  }

  public selectChange(child: ValueViewChildSelected) {
    child.selected = !child.selected;
    this.selectedSuppliers.emit(this.model.filter(e => e.selected).map(e => e.supplier));
  }
}
