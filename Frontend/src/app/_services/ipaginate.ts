import { Subject } from 'rxjs';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Pagination } from '@app/_models/pagination';

export interface IPaginate {
  pagination: Pagination;
  changePageSubject: Subject<boolean>;

  totalItems(): number;
  totalViewItems(): number;

  lastPage(): void;

  nextPage(): void;

  previousPage(): void;

  firstPage(): void;

  hasNextPage(): boolean;

  hasPreviousPage(): boolean;

  numberOfItemsPerPage(): number;
  updatePageSize(limit: number): void;

  numberOfPages(): number;

  currentPage(): number;

  hasThisPage(pageNumber: number): boolean;
  hasThisCalculatePage(addOrMinus: number): boolean;

  isEnabled(): boolean;

  enabled(): void;

  disabled(): void;

  initPaginationParams(httpParams: HttpParams): HttpParams;

  setParametersFromResponse(headers: HttpHeaders): void;
}

export class Paginate implements IPaginate {
  pagination = new Pagination();

  changePageSubject = new Subject<boolean>();

  totalItems(): number {
    return this.pagination.totalCount;
  }

  totalViewItems(): number {
    return this.pagination.paginationCount;
  }
  lastPage(): void {
    this.pagination.paginationPage = this.pagination.lastPage;
    this.changePageSubject.next(true);
  }
  nextPage(): void {
    this.pagination.paginationPage++;
    if (this.pagination.paginationPage > this.pagination.lastPage) {
      this.pagination.paginationPage = this.pagination.lastPage;
    }
    this.changePageSubject.next(true);
  }
  previousPage(): void {
    this.pagination.paginationPage--;
    if (this.pagination.paginationPage < this.pagination.firstPage) {
      this.pagination.paginationPage = this.pagination.firstPage;
    }
    this.changePageSubject.next(true);
  }

  firstPage(): void {
    this.pagination.paginationPage = this.pagination.firstPage;
    this.changePageSubject.next(true);
  }
  hasNextPage(): boolean {
    return this.pagination.paginationPage < this.pagination.lastPage;
  }
  hasPreviousPage(): boolean {
    return this.pagination.paginationPage > this.pagination.firstPage;
  }

  numberOfItemsPerPage(): number {
    return this.pagination.paginationLimit;
  }

  updatePageSize(limit: number): void {
    if (limit && limit >= 0) {
      this.pagination.enabled = true;
      this.pagination.paginationLimit = limit;
      this.changePageSubject.next(true);
    } else {
      this.pagination.paginationLimit = 0;
      this.disabled();
    }
  }
  numberOfPages(): number {
    return this.pagination.lastPage;
  }
  currentPage(): number {
    return this.pagination.paginationPage;
  }
  hasThisPage(pageNumber: number): boolean {
    return this.pagination.firstPage <= pageNumber && this.pagination.lastPage >= pageNumber;
  }

  hasThisCalculatePage(addOrMinus: number): boolean {
    return this.hasThisPage(this.pagination.paginationPage + addOrMinus);
  }
  isEnabled(): boolean {
    return this.pagination.enabled;
  }
  enabled(): void {
    if (!this.pagination.enabled) {
      this.pagination.enabled = true;
      this.changePageSubject.next(true);
    }
  }
  disabled(): void {
    if (this.pagination.enabled) {
      this.pagination.enabled = false;
      this.changePageSubject.next(true);
    }
  }
  initPaginationParams(httpParams: HttpParams): HttpParams {
    if (httpParams == null) { httpParams = new HttpParams(); }
    if (this.isEnabled()) {
      httpParams = httpParams.append(
        'page',
        this.pagination.paginationPage.toString()
      );
      httpParams = httpParams.append(
        'limit',
        this.pagination.paginationLimit.toString()
      );
    }
    return httpParams;
  }

  setParametersFromResponse(headers: HttpHeaders): void {
    let ret = headers.get('X-Total-Count');
    this.pagination.totalCount = parseInt(ret === null ? '0' : ret, 10);
    ret = headers.get('X-Pagination-Count');
    this.pagination.paginationCount = parseInt(ret === null ? '1' : ret, 10);
    ret = headers.get('X-Pagination-Page');
    this.pagination.paginationPage = parseInt(ret === null ? '1' : ret, 10);
    ret = headers.get('X-Pagination-Limit');
    this.pagination.paginationLimit = parseInt(ret === null ? '0' : ret, undefined);
    if (this.pagination.paginationLimit === undefined
      || this.pagination.paginationLimit <= 0) {
      this.pagination.enabled = false;
      this.pagination.lastPage = 1;
    } else {
      this.pagination.enabled = true;
      this.pagination.lastPage = Math.ceil(
        this.pagination.totalCount / this.pagination.paginationLimit
      );
    }

  }
}
