import { Observable } from 'rxjs';
import { BrewStock } from './../../_models/brew';
import { Brew } from '@app/_models/brew';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OrderHttpService } from './order-http.service';
import { CService, ValueViewChild } from '@app/_services/iservice';
import { Injectable } from '@angular/core';
import { Order } from '@app/_models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends CService<Order> {
  public selectedOrders = new Array<Order>();
  public formSelectedOrder = new FormControl(0);

  public states: ValueViewChild[] = [];
  private nbEnumLeft = 0;

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
      created: ['']
    });
  }

  public getDisplay(name: string, value: Order): any {
    switch (name) {
      case 'created':
        return this.datepipe.transform(value[name], 'y-MM-dd');
      case 'tabOrder':
        if (value.id) {
          return 'Commande ' + value.id;
        }
        return 'Nouvelle commande';
      default:
        break;
    }
    return value[name];
  }

  public getPronostic(brews: Brew[], order: Order, dataSource: any) {
    (this.http as OrderHttpService).getPronostic(brews, order).subscribe(response => {
      order.update(response);
      dataSource.updateSource(order);
    }, err => {
      this.end(true, err);
    });
  }

  public createOrder(): void {
    if (this.start() === true) {
      this.http.create(new Order(undefined)).subscribe(response => {
        const newOrder = new Order(response);
        this.model.push(newOrder);
        this.selectedOrders.push(newOrder);
        this.end(true);
        this.formSelectedOrder.setValue(this.selectedOrders.length);
      }, error => {
        this.end(true, error);
      });
    }
  }

  public brewStockToOrder(brewStock: BrewStock, brewOrder: BrewStock, order: Order): Observable<Order> {
    if (this.start() === true) {
      const obs = (this.http as OrderHttpService).brewStockToOrder(brewStock, brewOrder, order);
      obs.subscribe(repsonse => {
        this.end(true);
      }, error => {
        this.end(true, error);
      });
      return obs;
    }
  }

  public brewOrderToStock(brewOrder: BrewStock, brewStock: BrewStock, order: Order): Observable<Order> {
    if (this.start() === true) {
      const obs = (this.http as OrderHttpService).brewOrderToStock(brewOrder, brewStock, order);
      obs.subscribe(repsonse => {
        this.end(true);
      }, error => {
        this.end(true, error);
      });
      return obs;
    }
  }

  public setSelected(value: Order): void {
    const index = this.selectedOrders.findIndex(x => x.id === value?.id);
    if (index >= 0) {
      this.formSelectedOrder.setValue(index + 1);
    } else {
      this.selectedOrders.push(value);
      this.formSelectedOrder.setValue(this.selectedOrders.length);
    }
  }

  public setBrewList(brewList: Array<Brew>, allBrews: Array<Brew>, value: Order): void {
    // On ajoute à la liste d'affichage les brassins déjà contenu dans la commande
    brewList.splice(0, brewList.length - 1);
    value.stocks.forEach(stock => {
      stock.brewStocks.forEach(brewStock => {
        const index = brewList.findIndex(x => x.id === brewStock.brew.id);
        if (index < 0) {
          brewList.push(brewStock.brew);
        }
      });
    });
    // Si la commande est au status de créé, on ajoute aussi les brassins au status crée ou planning
    allBrews.filter(x => x.state === 'created' || x.state === 'planning').forEach(brew => {
      const index = brewList.findIndex(x => x.id === brew.id);
      if (index < 0) {
        brewList.push(brew);
      }
    });
  }
}
