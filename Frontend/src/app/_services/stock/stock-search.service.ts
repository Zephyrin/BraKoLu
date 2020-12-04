import { ISearch } from './../isearch';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';
import { StockSearch } from '@app/_models/stock-search';

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
    return httpParams;
  }

  setParametersFromUrl(params: Params): void {

  }
}
