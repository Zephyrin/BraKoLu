import { ValueViewChild } from '@app/_services/iservice';
import { Ingredient } from '@app/_models';
import { HttpService } from '@app/_services/http.service';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientHttpService extends HttpService<Ingredient> {

  private path = 'ingredient';
  private pathAll = 'ingredients';
  constructor(protected http: HttpClient) {
    super(http);
  }

  createPath() { return this.path; }

  getAllPath() { return this.pathAll; }

  getPath() { return this.path; }

  updatePath() { return this.path; }

  deletePath() { return this.path; }

  public getEnums(name: string, enums: string): Observable<ValueViewChild[]> {
    if (name !== undefined) {
      return this.http.get<ValueViewChild[]>(`${environment.apiUrl}/ingredients/${name}/enum/${enums}`);
    }
    return this.http.get<ValueViewChild[]>(`${environment.apiUrl}/ingredients/enum/${enums}`);
  }
}
