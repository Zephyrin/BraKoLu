import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { SupplierHttpService } from './supplier-http.service';

import { Injectable } from '@angular/core';
import { Supplier } from '@app/_models';
import { CService, ValueViewChild } from '@app/_services/iservice';

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends CService<Supplier>{

  public states: ValueViewChild[] = [];
  private nbEnumLeft = 0;
  constructor(
    private h: SupplierHttpService,
    public datepipe: DatePipe) {
    super(h, undefined);
  }

  public initEnums(): void {
    this.nbEnumLeft = 0;
    if (this.headers.length === 0) {
      this.nbEnumLeft++;
      this.h.getEnum('headers').subscribe(response => {
        response.forEach(elt => {
          this.headers.push(elt);
          this.displayedColumns.push(elt.value);
        });
        this.nbEnumLeft--;
        if (this.nbEnumLeft <= 0) {
          this.initEnumDone.next(true);
        }
      });
    }
    if (this.nbEnumLeft <= 0) {
      this.initEnumDone.next(true);
    }
  }

  public create(): Supplier {
    return new Supplier(undefined);
  }
  public createPart(): Supplier {
    const supplier = new Supplier(undefined);
    return supplier;
  }

  public createCpy(stock: Supplier): Supplier {
    return new Supplier(stock);
  }

  public createFormBasedOn(formBuilder: FormBuilder, value: Supplier): void {
    this.form = formBuilder.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  public getDisplay(name: string, value: Supplier): any {
    switch (name) {
      case 'name':
        return value.name;
      default:
        break;
    }
    return value[name];
  }
}
