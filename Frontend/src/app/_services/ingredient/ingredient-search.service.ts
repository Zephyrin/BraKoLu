import { ValueViewChild } from '@app/_services/iservice';
import { ISearch } from './../isearch';
import { Subject } from 'rxjs';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Params } from '@angular/router';
import { IngredientSearch } from '@app/_models/ingredient-search';
import { ValueViewChildSelected } from '@app/_models/ValueViewChildSelected';

export class IngredientSearchService implements ISearch {
  ingredientSearch = new IngredientSearch();
  changePageSubject = new Subject<boolean>();
  constructor() {
  }

  public setListIngredient(ingredientChildrenNames: ValueViewChild[]) {
    ingredientChildrenNames.forEach(x => {
      const saveStatusStr = localStorage.getItem('ingredientSearch_' + x.value);
      const saveStatus = saveStatusStr === undefined || saveStatusStr === null ? false : JSON.parse(saveStatusStr);
      this.ingredientSearch.selectChildren.push(new ValueViewChildSelected(x, saveStatus));
    });
  }

  public updateSelected(child: ValueViewChildSelected) {
    child.selected = !child.selected;
    localStorage.setItem('ingredientSearch_' + child.value, JSON.stringify(child.selected));
    this.changePageSubject.next(true);
  }

  public updateSearch(search: string) {
    if (this.ingredientSearch.searchValue !== search) {
      this.ingredientSearch.searchValue = search;
      this.changePageSubject.next(true);
    }
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
    if (this.ingredientSearch.searchValue.length > 0) {
      httpParams = httpParams.append(
        'search',
        this.ingredientSearch.searchValue
      );
    }
    return httpParams;
  }

  setParametersFromUrl(params: Params): void {
    if (params && params.hasOwnProperty('selectChildren')) {

    } else {
      this.ingredientSearch.selectChildren = [];
    }
    if (params && params.hasOwnProperty('search')) {
      this.ingredientSearch.searchValue = params.search;
    } else {
      this.ingredientSearch.searchValue = '';
    }
  }
}
