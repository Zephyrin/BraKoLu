import { Ingredient } from '@app/_models';
import { HttpService } from '@app/_services/http.service';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

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
}
