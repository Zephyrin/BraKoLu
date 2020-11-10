import { Brew } from '@app/_models/brew';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OrderHttpService } from './order-http.service';
import { CService, ValueViewChild } from '@app/_services/iservice';
import { Injectable } from '@angular/core';
import { Order } from '@app/_models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends CService<Order> {
  public states: ValueViewChild[] = [];
  private nbEnumLeft = 0;

  public pronostic: Order;
  constructor(
    private h: OrderHttpService,
    public datepipe: DatePipe) {
    super(h, undefined);
  }

  public initEnums(): void {
    this.nbEnumLeft = 0;
    if (this.states.length === 0) {
      this.nbEnumLeft++;
      this.h.getEnum('states').subscribe(response => {
        response.forEach(elt => {
          this.states.push(elt);
        });
        this.nbEnumLeft--;
        if (this.nbEnumLeft <= 0) {
          this.initEnumDone.next(true);
        }
      });
    }
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

  public create(): Order {
    return new Order(undefined);
  }

  public createCpy(brew: Order): Order {
    return new Order(brew);
  }

  public createFormBasedOn(formBuilder: FormBuilder, value: Order): void {
    this.form = formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      abv: ['', Validators.required],
      ibu: ['', Validators.required],
      ebc: ['', Validators.required],
      state: ['', Validators.required],
      producedQuantity: [''],
      started: [''],
      ended: [''],
    });
  }

  public getDisplay(name: string, value: Order): any {
    switch (name) {
      case 'created':
        return this.datepipe.transform(value[name], 'y-MM-dd');
      default:
        break;
    }
    return value[name];
  }

  public getPronostic(brews: Brew[]) {
    (this.http as OrderHttpService).getPronostic(brews).subscribe(response => {
      this.pronostic = response;
    }, err => {
      this.end(true, err);
    });
  }
}
