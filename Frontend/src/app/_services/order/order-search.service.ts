import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { OrderSearch } from '@app/_models/order-search';
import { Subject } from 'rxjs';
import { ISearch } from '../isearch';

@Injectable({
  providedIn: 'root'
})
export class OrderSearchService implements ISearch {
  orderSearch = new OrderSearch();
  changePageSubject = new Subject<boolean>();
  constructor() { }

  initSearchParams(httpParams: HttpParams): HttpParams {
    if (httpParams == null) { httpParams = new HttpParams(); }
    if (this.orderSearch.states && this.orderSearch.states.length > 0) {
      httpParams = httpParams.append(
        'states',
        this.orderSearch.states.toString()
      );
      return httpParams;
    }
  }

  setParametersFromUrl(params: Params): void { }

  public updateStates(states: string[]) {
    this.orderSearch.states = states;
    this.changePageSubject.next(true);
  }
}
