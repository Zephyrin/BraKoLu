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

  public getPronostic(brews: Brew[], order: Order): Observable<Order> {
    let params = new HttpParams();
    for (const brew of brews) {
      params = params.append('brews[]', `${brew.id}`);
    }

    return this.http.get<Order>(
      `${environment.apiUrl}/${this.getPath()}/pronostic/${order.id}`, { params }
    );
  }

  public brewStockToOrder(brewStock: BrewStock, brewOrder: BrewStock, order: Order): Observable<Order> {
    return this.http.patch<Order>(
      `${environment.apiUrl}/${this.updatePath()}/${order.id}/brewStockToOrder`, { brewStock, brewOrder });
  }
  public brewOrderToStock(brewOrder: BrewStock, brewStock: BrewStock, order: Order): Observable<Order> {
    return this.http.patch<Order>(
      `${environment.apiUrl}/${this.updatePath()}/${order.id}/brewOrderToStock`, { brewOrder, brewStock });
  }

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
