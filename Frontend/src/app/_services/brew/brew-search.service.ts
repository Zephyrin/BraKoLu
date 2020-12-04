import { ISearch } from './../isearch';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';
import { BrewSearch } from '@app/_models/brew-search';

@Injectable({
  providedIn: 'root'
})
export class BrewSearchService implements ISearch {
  brewSearch = new BrewSearch();
  changePageSubject = new Subject<boolean>();

  constructor() { }

  initSearchParams(httpParams: HttpParams): HttpParams {
    if (httpParams == null) { httpParams = new HttpParams(); }
    if (this.brewSearch.states && this.brewSearch.states.length > 0) {
      httpParams = httpParams.append(
        'states',
        this.brewSearch.states.toString()
      );
    }
    if (this.brewSearch.orderBy) {
      httpParams = httpParams.append(
        'sortBy',
        this.brewSearch.orderBy
      );
    }
    if (this.brewSearch.direction) {
      httpParams = httpParams.append(
        'sort',
        this.brewSearch.direction
      );
    }
    return httpParams;
  }

  setParametersFromUrl(params: Params): void {

  }
}
