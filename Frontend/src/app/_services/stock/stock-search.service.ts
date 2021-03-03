import { ISearch } from './../isearch';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';
import { StockSearch } from '@app/_models/stock-search';
import { Supplier } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class StockSearchService implements ISearch {
  stockSearch = new StockSearch();
  changePageSubject = new Subject<boolean>();

  constructor() { }

  initSearchParams(httpParams: HttpParams): HttpParams {
    if (httpParams == null) { httpParams = new HttpParams(); }
    if (this.stockSearch.states && this.stockSearch.states.length > 0) {
      httpParams = httpParams.append(
        'states',
        this.stockSearch.states.toString()
      );
    }
    if (this.stockSearch.suppliers && this.stockSearch.suppliers.length > 0) {
      const selected = this.stockSearch.suppliers.map(e => e.id);
      httpParams = httpParams.append(
        'suppliers',
        selected.toString()
      );
    }
    if (this.stockSearch.searchValue.length > 0) {
      httpParams = httpParams.append(
        'search',
        this.stockSearch.searchValue
      );
    }
    return httpParams;
  }

  setParametersFromUrl(params: Params): void {
    if (params && params.hasOwnProperty('search')) {
      this.stockSearch.searchValue = params.search;
    } else {
      this.stockSearch.searchValue = '';
    }
    if (params && params.hasOwnProperty('suppliers')) {
      this.stockSearch.suppliers = [];
    } else {
      this.stockSearch.suppliers = [];
    }
  }

  public updateSearch(search: string) {
    if (this.stockSearch.searchValue !== search) {
      this.stockSearch.searchValue = search;
      this.changePageSubject.next(true);
    }
  }

  public updateSuppliers(suppliers: Supplier[]) {
    this.stockSearch.suppliers = suppliers;
    this.changePageSubject.next(true);
  }

  public updateStates(states: string[]) {
    this.stockSearch.states = states;
    this.changePageSubject.next(true);
  }

}
