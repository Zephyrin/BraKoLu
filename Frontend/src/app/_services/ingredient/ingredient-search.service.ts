import { ValueViewChild } from '@app/_services/iservice';
import { ISearch } from './../isearch';
import { Subject } from 'rxjs';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Params } from '@angular/router';
import { IngredientSearch, IngredientChildrenSelected } from '@app/_models/ingredient-search';

export class IngredientSearchService implements ISearch {
  ingredientSearch = new IngredientSearch();
  changePageSubject = new Subject<boolean>();
  constructor() {
  }

  public setListIngredient(ingredientChildrenNames: ValueViewChild[]) {
    ingredientChildrenNames.forEach(x => {
      this.ingredientSearch.selectChildren.push(new IngredientChildrenSelected(x));
    });
  }

  public updateSelected(child: IngredientChildrenSelected) {
    child.selected = !child.selected;
    this.changePageSubject.next(true);
  }
  initSearchParams(httpParams: HttpParams): HttpParams {
    if (httpParams == null) { httpParams = new HttpParams(); }
    if (this.ingredientSearch.selectChildren.length > 0) {
      const selected = [];
      this.ingredientSearch.selectChildren.forEach(x => {
        if (x.selected) {
          selected.push(x.value);
        }
      });
      if (selected.length > 0) {
        httpParams = httpParams.append(
          'selectChildren',
          selected.toString());
      }
    }
    return httpParams;
  }

  setParametersFromUrl(params: Params): void {
    if (params && params.hasOwnProperty('selectChildren')) {

    } else {
      this.ingredientSearch.selectChildren = [];
    }
  }
}
