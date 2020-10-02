import { Subject } from 'rxjs';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Params } from '@angular/router';

export interface ISearch {
  changePageSubject: Subject<boolean>;

  initSearchParams(httpParams: HttpParams): HttpParams;

  setParametersFromUrl(params: Params): void;
}
