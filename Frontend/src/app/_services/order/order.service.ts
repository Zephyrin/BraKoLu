import { Observable, Subject } from 'rxjs';
import { BrewStock } from './../../_models/brew';
import { Brew } from '@app/_models/brew';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OrderHttpService } from './order-http.service';
import { CService, ValueViewChild } from '@app/_services/iservice';
import { Injectable, SimpleChange } from '@angular/core';
import { Order } from '@app/_models/order';
import { Ingredient, IngredientStock } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends CService<Order> {


  public states: ValueViewChild[] = [];
  private nbEnumLeft = 0;

  public selectedChange = new Subject<Order>();

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
    const order = new Order(undefined);
    return order;
  }

  public createPart(): Order {
    const order = new Order(undefined, false, false);
    return order;
  }

  public createCpy(order: Order): Order {
    return new Order(order);
  }

  public createFormBasedOn(formBuilder: FormBuilder, value: Order): void {
    this.form = formBuilder.group({
      id: [''],
      created: ['']
    });
  }

  public getDisplay(name: string, value: Order): any {
    switch (name) {
      case 'created':
        return this.datepipe.transform(value[name], 'dd-MM-y');
      case 'tabOrder':
        if (value.id) {
          return value.id + ' - ' + this.datepipe.transform(value[`created`], 'dd-MM-y');
        }
        return 'Nouvelle commande';
      default:
        break;
    }
    return value[name];
  }

  public createOrder(): void {
    if (this.start() === true) {
      this.http.create(new Order(undefined)).subscribe(response => {
        const newOrder = new Order(response);
        this.model.push(newOrder);
        const simpleChange = new SimpleChange(null, newOrder, true);
        this.end(true, simpleChange);
      }, error => {
        this.end(true, undefined, error);
      });
    }
  }

  public changeState(order: Order): void {
    if (this.start() === true) {
      (this.http as OrderHttpService).changeState(order).subscribe(response => {
        const simpleChange = new SimpleChange(this.createCpy(order), order, true);
        order.update(response);
        this.end(true, simpleChange);
      }, error => {
        this.end(true, undefined, error);
      });
    }
  }

  public setSelected(value: Order): void {
    this.selectedChange.next(value);
  }
}
