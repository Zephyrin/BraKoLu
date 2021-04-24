import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { SupplierSearch } from '@app/_models/supplier-search';
import { Subject } from 'rxjs';
import { ISearch } from '../isearch';

@Injectable({
  providedIn: 'root'
})
export class SupplierSearchService implements ISearch {
  search = new SupplierSearch();
  changePageSubject = new Subject<boolean>();

  constructor() { }

  initSearchParams(httpParams: HttpParams): HttpParams {
    if (httpParams == null) { httpParams = new HttpParams(); }

    if (this.search.searchValue.length > 0) {
      httpParams = httpParams.append(
        'search',
        this.search.searchValue
      );
    }
    return httpParams;
  }


  setParametersFromUrl(params: Params): void {
    if (params && params.hasOwnProperty('search')) {
      this.search.searchValue = params.search;
    } else {
      this.search.searchValue = '';
    }
  }

  public updateSearch(search: string) {
    if (this.search.searchValue !== search) {
      this.search.searchValue = search;
      this.changePageSubject.next(true);
    }
  }

}
