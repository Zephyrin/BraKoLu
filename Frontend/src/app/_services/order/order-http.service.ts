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

  public changeState(order: Order): Observable<Order> {
    return this.http.patch<Order>(
      `${environment.apiUrl}/${this.updatePath()}/${order.id}/changeState`, {}
    );
  }

  public deleteIngredientToOrder(order: Order, ingredient: IngredientStock): Observable<{}> {
    return this.http.delete<{}>(
      `${environment.apiUrl}/${this.updatePath()}/${order.id}/deleteIngredient/${ingredient.id}`, {}
    );
  }

}
