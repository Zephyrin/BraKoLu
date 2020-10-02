import { Subject } from 'rxjs';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Sort } from '@app/_models/sort';
import { Params } from '@angular/router';

export interface ISortable {
  sort: Sort;
  changePageSubject: Subject<boolean>;

  change(sortName: string, order: string): void;

  initSortParams(httpParams: HttpParams): HttpParams;

  setParametersFromUrl(params: Params): void;
}

export class Sortable implements ISortable {
  sort = new Sort();

  changePageSubject = new Subject<boolean>();
  change(sortName: string, order: string): void {
    this.sort.sortBy = sortName;
    this.sort.direction = order;
    this.changePageSubject.next(true);
  }
  initSortParams(httpParams: HttpParams): HttpParams {
    if (httpParams == null) { httpParams = new HttpParams(); }
    if (this.sort.sortBy && this.sort.direction) {
      httpParams = httpParams.append(
        'sort',
        this.sort.direction.toString()
      );
      httpParams = httpParams.append(
        'sortBy',
        this.sort.sortBy.toString()
      );
    }
    return httpParams;
  }

  setParametersFromUrl(params: Params): void {
    if (params && params.hasOwnProperty('sort')) {
      this.sort.direction = params.sort;
    } else {
      this.sort.direction = undefined;
    }
    if (params && params.hasOwnProperty('sortBy')) {
      this.sort.sortBy = params.sortBy;
    } else {
      this.sort.sortBy = undefined;
    }
  }
}
