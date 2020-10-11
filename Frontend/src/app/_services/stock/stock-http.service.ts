import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { IngredientStock } from '@app/_models';
import { HttpService } from '@app/_services/http.service';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ValueViewChild } from '../iservice';

@Injectable({
  providedIn: 'root'
})
export class StockHttpService extends HttpService<IngredientStock> {

  private path = 'ingredient/stock';
  private pathAll = 'ingredient/stocks';
  constructor(protected http: HttpClient) {
    super(http);
  }

  createPath() { return this.path; }

  getAllPath() { return this.pathAll; }

  getPath() { return this.path; }

  updatePath() { return this.path; }

  deletePath() { return this.path; }

  getEnum(enumName: string): Observable<ValueViewChild[]> {
    return this.http.get<ValueViewChild[]>(`${environment.apiUrl}/ingredient/stock/enum/${enumName}`);
  }
}
