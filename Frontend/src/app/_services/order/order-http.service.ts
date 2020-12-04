import { Brew, BrewStock } from '@app/_models/brew';
import { Ingredient, IngredientStock } from '@app/_models';
import { environment } from '@app/../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '@app/_models/order';
import { HttpService } from '@app/_services/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderHttpService extends HttpService<Order>{

  private path = 'order';
  private pathAll = 'orders';

  constructor(protected http: HttpClient) {
    super(http);
  }

  createPath() { return this.path; }

  getAllPath() { return this.pathAll; }

  getPath() { return this.path; }

  updatePath() { return this.path; }

  deletePath() { return this.path; }

  public addIngredientToOrder(order: Order, ingredient: Ingredient): Observable<IngredientStock> {
    return this.http.patch<IngredientStock>(
      `${environment.apiUrl}/${this.updatePath()}/${order.id}/addIngredient/${ingredient.id}`, {}
    );
  }

  public deleteIngredientToOrder(order: Order, ingredient: IngredientStock): Observable<{}> {
    return this.http.delete<{}>(
      `${environment.apiUrl}/${this.updatePath()}/${order.id}/deleteIngredient/${ingredient.id}`, {}
    );
  }

}
